import { useScript } from "deco/hooks/useScript.ts"
import { Chat } from "site/components/Chat.tsx"
import MessageBox from "site/sections/MessageBox.tsx"

const onLoad = () => {
  globalThis.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash
    const roomId = document.getElementById("roomId") as HTMLInputElement

    if (roomId) {
      roomId.value = hash.substring(1)
    }
    document.getElementById("join")?.click()
  })
}

export default function Section() {
  return (
    <>
      <script
        type="module"
        defer
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      ></script>

      <Chat />

      <div id="apd" hx-ext="ws" ws-connect="/ws">
        <form
          aria-hidden="true"
          class="hidden"
          hx-trigger="click"
          id="form"
          ws-send
        >
          <input aria-hidden="true" name="type" value="join" />
          <input aria-hidden="true" id="roomId" name="roomId" value="69420" />
          <button aria-hidden="true" id="join" type="submit"></button>
        </form>

        <MessageBox />
      </div>
    </>
  )
}
