import { useScript } from "deco/hooks/useScript.ts";
import { Chat } from "site/components/Chat.tsx";
import MessageBox from "site/sections/MessageBox.tsx";

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

      <div class="flex flex-col h-full w-full justify-center">
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

          <MessageBox />

        </div>
      </div>
    </>
  );
}
