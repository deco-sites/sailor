import { useScript } from "deco/hooks/useScript.ts"
import { Chat } from "site/components/Chat.tsx"
import MessageBox from "site/sections/MessageBox.tsx"
//mesage
const onLoad = () => {
  globalThis.addEventListener("DOMContentLoaded", () => {
    document.getElementById("create")?.click()

    document.getElementById("link")?.addEventListener("click", () => {
      const currUrl = document.getElementById("currentUrl")
      const roomId = document.getElementById("roomId")?.innerHTML
      navigator.clipboard.writeText(`${currUrl?.innerHTML}/receive#${roomId}`)
    })
  })

  globalThis.addEventListener("htmx:wsAfterSend", () => {
    const currUrl = document.getElementById("currentUrl")
    console.log("window.location.href", window.location.href)
    if (currUrl) {
      currUrl.innerHTML = window.location.href.toString() + "receive#"
    }
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

      <div class="flex flex-col h-full w-full justify-center ">
        <div hx-ext="ws" ws-connect="/ws" hx-target="#roomId">
          <form hx-trigger="click" id="form" ws-send>
            <input
              aria-hidden="true"
              class="hidden"
              name="type"
              value="create"
            />
            <button
              aria-hidden="true"
              class="hidden"
              id="create"
              type={"button"}
            ></button>
          </form>

          <div
            id="startText"
            class="flex flex-col justify-center items-center absolute top-0 mt-10 left-0 right-0 mx-auto text-slate-200 gap-3 z-20"
          >
            <h1 class="text-2xl text-secondary">YOU ARE A LONE SAILOR...</h1>
            <h2 class="text-4xl text-secondary">
              INVITE SOMEONE TO SAIL WITH YOU?
            </h2>
            <div class="flex flex-row gap-1 text-sm text-secondary">
              <p>send them this link:</p>
              <p class="cursor-pointer" id="link">
                <span id="currentUrl"></span>
                <span id="roomId"></span>
              </p>
            </div>
          </div>

          <MessageBox />
        </div>
      </div>
    </>
  )
}
