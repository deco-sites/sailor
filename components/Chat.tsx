import { useScript } from "deco/hooks/useScript.ts"

const onLoad = () => {
  // me when bottom scroller lmao
  const chatContainer = document.getElementById("chatContainer")

  if (chatContainer) {
    const observer = new MutationObserver(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight
    })

    observer.observe(chatContainer, { childList: true, subtree: true })
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}

export const Chat = () => {
  return (
    <>
      <script
        type="module"
        defer
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      />
      <div class="flex justify-center w-full flex-row w-full h-[50dvh] flex-col items-center absolute top-0 mt-10 left-0 right-0 mx-auto text-slate-200 gap-3 z-50">
        <div
          id="chatContainer"
          class="flex w-full flex-col-reverse p-4 max-w-[1032px] overflow-y-scroll text-sm"
        >
          <ul
            id="chat"
            class="w-full h-full text-white"
            hx-swap="beforeend"
            hx-swap-oob="beforeend"
          ></ul>
        </div>
      </div>
    </>
  )
}
