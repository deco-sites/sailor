import { useScript } from "deco/hooks/useScript.ts"

interface Props {
  /**
   * @description The description of name.
   */
  name?: string
}

const onLoad = () => {
  let [h, w] = [window.innerHeight, window.innerWidth]

  const blobSvg = document.getElementById("blobSvg") as SVGElement | null
  const boat = document.getElementById("boat")
  const wave = document.getElementById("wave")

  const getPathAtPos = (path: SVGElement, pos: number) => {
    const totalLength = path.getTotalLength()
    const waveLength = totalLength * 0.2
    const point = path.getPointAtLength((waveLength * pos) / w)
    return point
  }

  const animateBoat = () => {
    let linpx
    if (w > 1030) {
      let rem = (w - 1032) / 2
      linpx = rem + 44
    } else {
      linpx = 44
    }

    const point = getPathAtPos(wave, linpx)
    let a = h / 300
    boat.style.left = `${linpx}px`
    boat.style.top = `${point.y * a}px`

    requestAnimationFrame(animateBoat)
  }

  function waitForPathToLoad(callback) {
    const blobPath = blobSvg.querySelector("#wave")
    if (blobPath && blobPath.getTotalLength() > 0) {
      callback()
    } else {
      requestAnimationFrame(() => waitForPathToLoad(callback))
    }
  }

  waitForPathToLoad(animateBoat)
}

export default function Section({ name = "Capy" }: Props) {
  return (
    <>
      <script
        type="module"
        defer
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      />

      <div class="flex flex-col min-h-screen bg-slate-950">
        <div class="flex flex-col h-full relative">
          <div class="w-full relative">
            <svg
              width="100%"
              viewBox="0 0 500 700"
              id="blobSvg"
              preserveAspectRatio="none"
              style="margin-top: -10px"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color: rgb(21, 93, 169)"></stop>
                  <stop
                    offset="15%"
                    style="stop-color: rgb(11, 62, 117)"
                  ></stop>
                  <stop offset="100%" style="stop-color: rgb(4, 18, 43)"></stop>
                </linearGradient>
              </defs>
              <path id="wave" fill="url(#gradient)">
                <animate
                  attributeName="d"
                  dur="8000ms"
                  repeatCount="indefinite"
                  values="
                  M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,700 L0.00,700 Z;
                  M0.00,49.98 C149.99,150 202.88,48.86 500.00,49.98 L500.00,700 L0.00,700 Z;
                  M0.00,49.98 C184.25,129.78 96.22,14.31 500.00,49.98 L500.00,700 L0.00,700 Z;
                  M0.00,49.98 C12.13,43.92 96.22,14.31 500.00,49.98 L500.00,700 L0.00,700 Z;
                  M0.00,49.98 C12.13,43.92 128.94,116.95 500.00,49.98 L500.00,700 L0.00,700 Z;
                  M0.00,49.98 C241.82,24.19 128.94,116.95 500.00,49.98 L500.00,700 L0.00,700 Z;
                  M0.00,49.98 C405.47,10.38 254.79,113.98 500.00,49.98 L500.00,700 L0.00,700.00 Z;
                  M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,700.00 L0.00,700.00 Z;
                 "
                ></animate>
              </path>
            </svg>
            <svg id="boat" class="absolute w-14" viewBox="0 0 64 64">
              <path
                fill="#fff"
                d="M32 2c-1.1 0-2 .9-2 2v44c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2zm0 48c-3.3 0-6-2.7-6-6H10.6c-.4 0-.8.2-1 .5l-4.2 6.7c-.4.7-.1 1.6.7 2 .2.1.4.1.6.1h48c.4 0 .8-.2 1-.5.4-.7.1-1.6-.7-2l-4.2-6.7c-.2-.3-.6-.5-1-.5H38c0 3.3-2.7 6-6 6zm8-12h8c1.1 0 2-.9 2-2s-.9-2-2-2H24c-1.1 0-2 .9-2 2s.9 2 2 2h8z"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}
