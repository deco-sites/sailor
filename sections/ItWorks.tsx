import { useScript } from "deco/hooks/useScript.ts";
import { Chat } from "site/components/Chat.tsx";

const onLoad = () => {
  window.addEventListener("load", (event) => {
    document.getElementById("create")?.click();
  });
};

export default function Section() {
  return (
    <>
      <script
        type="module"
        defer
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      >
      </script>

      <Chat />

      <div class="container py-10 flex flex-col h-screen w-full items-center justify-center gap-16">
        <div
          hx-ext="ws"
          ws-connect="/ws"
          hx-target="#roomId"
        >
          <form hx-trigger="click" id="form" ws-send>
            <input class="hidden" name="type" value="create" />
            <button class="hidden" id="create" type={"button"}></button>
          </form>

          <div>
            <p>
              http://localhost:8000/receive#<span id="roomId"></span>
            </p>
          </div>

          <form id="form" ws-send hx-select="#chat2" hx-swap="innerHTML">
            <input class="hidden" name="type" value="message" />
            <input class="bg-red-200" type="text" name="content" id="content" />
            <button
              type="submit"
              id="join"
            >
              send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
