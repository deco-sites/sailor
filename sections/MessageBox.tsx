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
        class="flex absolute bottom-0 mb-8 left-1/2 -translate-y-1/2 gap-2 z-50"
        id="form"
        ws-send
      >
        <input class="hidden" name="type" value="message" />
        <input class="bg-red-200" type="text" name="content" id="content" />
        <button id="join">send</button>
      </form>
    </>
  );
}
