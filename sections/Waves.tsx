import { useScript } from "deco/hooks/useScript.ts"
import { Boat } from "site/components/Boat.tsx"

interface Props {
  /**
   * @description The description of name.
   */
  name?: string
}

const onLoad = () => {
  const [h, w] = [globalThis.innerHeight, globalThis.innerWidth]

  const blobSvg = document.getElementById("blobSvg") as SVGElement | null
  const boat = document.getElementById("boat")
  const boatPeer = document.getElementById("boatPeer")
  const wave = document.getElementById("wave") as SVGPathElement | null

  const getPathAtPos = (path: SVGPathElement, pos: number) => {
    const totalLength = path.getTotalLength()
    const waveLength = totalLength * 0.2
    const point = path.getPointAtLength((waveLength * pos) / w)
    return point
  }

  const animateBoat = () => {
    if (!boat || !wave) return

    let linpx: number
    let a: number
    if (w > 1030) {
      const rem = (w - 1032) / 2
      linpx = rem + 64
      a = h / 300
    } else {
      a = h / 700
      linpx = 64
    }

    const point = getPathAtPos(wave, linpx)
    boat.style.left = `${linpx}px`
    boat.style.top = `${point.y * a}px`

    requestAnimationFrame(animateBoat)
  }

  const animateBoatPeer = () => {
    if (!boatPeer || !wave) return

    let rinpx: number
    let a: number
    if (w > 1030) {
      const rem = (w - 1032) / 2
      rinpx = 1032 + rem - 128
      a = h / 300
    } else {
      a = h / 700
      rinpx = w - 128
    }

    const point = getPathAtPos(wave, rinpx)
    boatPeer.style.left = `${rinpx}px`
    boatPeer.style.top = `${point.y * a}px`

    requestAnimationFrame(animateBoatPeer)
  }

  function waitForPathToLoad(callback: () => void) {
    if (!blobSvg) {
      requestAnimationFrame(() => waitForPathToLoad(callback))
      return
    }

    const blobPath = blobSvg.querySelector("#wave") as SVGPathElement
    if (blobPath && blobPath.getTotalLength() > 0) {
      callback()
    } else {
      requestAnimationFrame(() => waitForPathToLoad(callback))
    }
  }

  waitForPathToLoad(animateBoatPeer)
  waitForPathToLoad(animateBoat)
}

export default function Section() {
  return (
    <>
      <script
        type="module"
        defer
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      />

      <div class="absolute flex flex-col bg-black absolute top-[50%] left-0 right-0 ">
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
            <div>
              <div id="boat" class=" absolute w-14">
                <Boat />
              </div>
              <div id="boatPeer" class="absolute w-14 transform scaleY(-1)">
                <Boat inverted />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
