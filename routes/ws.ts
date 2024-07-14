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
    const socketId = req.headers.get("sec-websocket-key");

    if (!socketId) {
      //TODO: fix this
      return response;
    }

    socket.onopen = () => {
      console.log("newConnection");
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
      const roomId = crypto.randomUUID();
      rooms.push({
        id: roomId,
        ownerId: socketId,
        owner: socket,
      });
      socket.send(`<span hx-swap="beforeend" id="roomId">${roomId}</span>`);
    };

    const joinRoom = (message: { roomId: string }) => {
      const room = rooms.find((room) => room.id === message.roomId);
      if (room) {
        if (!room.peerId) {
          room.peer = socket;
          room.peerId = socketId;
          room.owner.send(
            `
              <div id="startText" hx-swap-oob="outerHTML">
                <span class="hidden" id="roomId"></span>
              </div>
            `,
          );

          room.owner.send(JSON.stringify({
            type: "peerConnected",
          }));

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
            description: "No room found for this id",
          }),
        );
      }
    };

    const sendMessage = (
      message: { content: string },
    ) => {
      const room = rooms.find((room) =>
        room.ownerId == socketId || room.peerId == socketId
      );

      if (!room) {
        socket.send(
          JSON.stringify({
            type: "error",
            description: "No room found for that id",
          }),
        );
        return;
      }

      if (room.ownerId === socketId) {
        room.peer?.send(
          `
          <div id="chat" hx-swap-oob="beforeend">
            <li id="message" style="width: 100%;">
              <p> ${message.content}</p>
            </li>
          </div>
          `,
        );

        room.owner.send(
          `
          <div id="chat" hx-swap-oob="beforeend">
            <li id="message" style="width: 100%;" >
              <p style="width: 100%; display: flex; justify-content: flex-end;"> ${message.content}</p>
            </li>
          </div>
          `,
        );
        return;
      }

      room.peer?.send(
        `
        <div id="chat" hx-swap-oob="beforeend">
          <li id="message" style="width: 100%;">
            <p style="width: 100%; display: flex; justify-content: flex-end;"> ${message.content}</p>
          </li>
        </div>
        `,
      );
      room.owner.send(
        `
        <div id="chat" hx-swap-oob="beforeend">
          <li id="message" style="width: 100%;">
            <p> ${message.content}</p>
          </li>
        </div>
        `,
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
