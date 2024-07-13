import { useScript } from "deco/hooks/useScript.ts";

const onLoad = () => {
  htmx.onLoad(function () {
    const withHash = document.getElementById("withHash");
    const withNoHash = document.getElementById("withNoHash");

    const hash = window.location.hash;
    if (hash) {
      withNoHash?.classList.add("hidden");
      withHash?.classList.remove("hidden");
    } else {
      withHash?.classList.add("hidden");
      withNoHash?.classList.remove("hidden");
    }
  });
};

export default function Section() {
  return (
    <>
      <script
        type="module"
        defer
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      />
      <div class="container py-10 flex flex-col h-screen w-full items-center justify-center gap-16">
        <div
          class={"hidden"}
          id="withNoHash"
          hx-ext="ws"
          ws-connect="/ws"
          hx-target="#roomId"
        >
          <div>
            <p>
              http://localhost:8000/<span id="roomId"></span>
            </p>
          </div>
        </div>


    </>
  );
}
