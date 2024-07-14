import { useScript } from "deco/hooks/useScript.ts"
import { Chat } from "site/components/Chat.tsx"
import MessageBox from "site/sections/MessageBox.tsx"
//mesage
const onLoad = () => {
  const showToast = (msmg: string, error?: boolean) => {
    const toast = document.createElement("div")
    toast.className = `absolute text-white top-0 mt-10 z-20 left-0 right-0 mx-auto w-full  ${
      error ? "bg-red-500 " : "bg-secondary"
    } shadow-xl p-2 max-w-48 rounded-md`
    toast.id = "toast"

    const txt = document.createElement("p")
    txt.innerText = msmg
    txt.className = "text-xs"
    toast.appendChild(txt)

    const apd = document.getElementById("apd")

    apd?.appendChild(toast)

    setTimeout(() => {
      document.getElementById("toast")?.remove()
    }, 2398)
  }

  globalThis.addEventListener("DOMContentLoaded", () => {
    document.getElementById("create")?.click()

    document.getElementById("link")?.addEventListener("click", () => {
      const currUrl = document.getElementById("currentUrl")
      const roomId = document.getElementById("roomId")?.innerHTML
      navigator.clipboard.writeText(`${currUrl?.innerHTML}${roomId}`)
      showToast("Link copied to the clipboard !")
    })
  })

  globalThis.addEventListener("htmx:wsAfterSend", () => {
    const currUrl = document.getElementById("currentUrl")
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

      <div id="apd" class="flex flex-col h-full w-full justify-center ">
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
            <h1 class="text-md md:text-2xl text-secondary">
              YOU ARE A LONE SAILOR...
            </h1>
            <h2 class="text-lg md:text-4xl text-secondary">
              INVITE SOMEONE TO SAIL WITH YOU?
            </h2>
            <div class="flex flex-col gap-1 justify-center items-center text-xs md:text-sm text-secondary">
              <p>send them this link:</p>
              <div>
                <p
                  class="flex item-center justify-center cursor-pointer text-xs md:text-sm"
                  id="link"
                >
                  <span id="currentUrl"></span>
                  <span id="roomId"></span>
                </p>
              </div>
            </div>
          </div>

          <MessageBox />
        </div>
      </div>
    </>
  )
}
