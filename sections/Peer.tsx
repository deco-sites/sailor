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

      <div hx-ext="ws" ws-connect="/ws">
        <form class="hidden" hx-trigger="click" id="form" ws-send>
          <input name="type" value="join" />
          <input id="roomId" name="roomId" value="69420" />
          <button id="join" type="submit"></button>
        </form>

        <MessageBox />
      </div>
    </>
  )
}
