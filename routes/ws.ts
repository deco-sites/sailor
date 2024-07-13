// routes/ws.ts
import { Handlers } from "$fresh/server.ts";

type Room = {
  id: string;
  owner: WebSocket;
  ownerId: string;
  peer?: WebSocket;
  peerId?: string;
};

const rooms: Room[] = [];

export const handler: Handlers = {
  GET(req) {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "create":
          createRoom();
          break;
        case "join":
          joinRoom(message);
          break;
        default:
          sendMessage(message);
          break;
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      removeConnection(socket);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      removeConnection(socket);
    };

    const createRoom = () => {
      const roomId = "69420"; // crypto.randomUUID();
      const connectionId = crypto.randomUUID() as string;

      rooms.push({
        id: roomId,
        ownerId: connectionId,
        owner: socket,
      });

      socket.send(
        JSON.stringify({ type: "info", ownId: connectionId, roomId: roomId }),
      );
    };

    const joinRoom = (message: { roomId: string }) => {
      const room = rooms.find((room) => room.id === message.roomId);
      if (room) {
        if (!room.peerId) {
          const ownId = crypto.randomUUID();

          room.peer = socket;
          room.peerId = ownId;
          room.owner.send(
            JSON.stringify({ type: "peerJoined", peerId: ownId }),
          );
          socket.send(
            JSON.stringify({ type: "info", roomId: room.id, ownId }),
          );

          return;
        }

        socket.send(
          JSON.stringify({
            type: "error",
            description: "Room already has a peer",
          }),
        );
      } else {
        socket.send(
          JSON.stringify({
            type: "error",
            description: "No room found for that id",
          }),
        );
      }
    };

    const sendMessage = (
      message: { roomId: string; ownId: string; content: string },
    ) => {
      const room = rooms.find((room) => room.id = message.roomId);

      if (!room) {
        socket.send(
          JSON.stringify({
            type: "error",
            description: "No room found for that id",
          }),
        );
        return;
      }

      if (!message.ownId) {
        socket.send(
          JSON.stringify({
            type: "error",
            description: "Invalid ownId",
          }),
        );
        return;
      }

      if (room.ownerId === message.ownId) {
        console.log("ownId", message.ownId);
        room.peer?.send(
          JSON.stringify({ type: "message", content: message.content }),
        );
        return;
      }

      room.owner.send(
        JSON.stringify({ type: "message", content: message.content }),
      );
    };

    const removeConnection = (socket: WebSocket) => {
      for (const room of rooms) {
        if (room.owner === socket) {
          if (room.peer) {
            room.peer.send(JSON.stringify({ type: "ownerDisconnected" }));
            room.peer.close();
          }
          rooms.splice(rooms.indexOf(room), 1);
          break;
        }
        if (room.peer === socket) {
          room.owner.send(JSON.stringify({ type: "peerDisconnected" }));
          room.peer = undefined;
          room.peerId = undefined;
          break;
        }
      }
    };

    return response;
  },
};
