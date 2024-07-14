import { useScript } from "deco/hooks/useScript.ts"
import { Icon } from "site/components/Icon.tsx"

const onLoad = () => {
  document.body.addEventListener("htmx:wsAfterSend", () => {
    const content = document.getElementById("content") as HTMLInputElement
    if (!content) return

    content.value = ""
  })
}

export default function Section() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: useScript(onLoad) }} />
      <form
        class="flex absolute bottom-0 mb-8 left-0 right-0 mx-auto z-50 justify-center "
        id="form"
        ws-send
      >
        <div class="flex gap-2 items-center">
          <input class="hidden" name="type" value="message" />
          <input
            class="w-full p-2 rounded-md h-8 border-gray-200 sm:text-sm placeholder:text-sm bg-secondary"
            type="text"
            name="content"
            id="content"
            placeholder={"type ..."}
          />
          <button
            class="flex items-center p-2 w-8 h-8 rounded-md justify-center bg-secondary "
            id="join"
          >
            <Icon name="send" />
          </button>
        </div>
      </form>
    </>
  )
}
