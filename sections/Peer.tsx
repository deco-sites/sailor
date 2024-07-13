import { useScript } from "deco/hooks/useScript.ts";
import htmx from "site/apps/deco/htmx.ts";
import { Chat } from "site/components/Chat.tsx";

interface Props {
  /**
   * @description The description of name.
   */
  name?: string;
}

const onLoad = () => {
  htmx.onLoad(() => {
    const hash = window.location.hash;
    document.getElementById("roomId").value = hash.substring(1);
    document.getElementById("join")?.click();
  });
};

export default function Section({ name = "Capy" }: Props) {
  return (
    <>
      <script
        type="module"
        defer
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      >
      </script>

      <Chat />

      <div
        hx-ext="ws"
        ws-connect="/ws"
      >
        <form class="hidden" hx-trigger="click" id="form" ws-send>
          <input name="type" value="join" />
          <input id="roomId" name="roomId" value="69420" />
          <button id="join" type="submit"></button>
        </form>

        <form
          class="flex absolute bottom-0 mb-8 left-1/2 -translate-y-1/2 gap-2"
          id="form"
          ws-send
        >
          <input class="hidden" name="type" value="message" />
          <input class="bg-red-200" type="text" name="content" id="content" />
          <button id="join">send</button>
        </form>
      </div>
    </>
  );
}
