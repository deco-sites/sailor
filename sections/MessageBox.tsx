import Icon from "site/components/ui/Icon.tsx";

interface Props {
  /**
   * @description The description of name.
   */
  name?: string;
}

export default function Section() {
  return (
    <>
      <form
        class="flex absolute bottom-0 mb-8 left-0 right-0 mx-auto z-50 justify-center"
        id="form"
        ws-send
      >
        <div class="flex gap-2 items-center">
          <input class="hidden" name="type" value="message" />
          <input
            class="w-full p-1 rounded-md border-gray-200 shadow-sm sm:text-sm placeholder:text-sm"
            type="text"
            name="content"
            id="content"
            placeholder={"type..."}
          />
          <button class="flex " id="join">
            <Icon class="w-5 h-5" id="ChevronRight" />
          </button>
        </div>
      </form>
    </>
  );
}
