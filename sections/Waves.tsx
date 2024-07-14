import { useScript } from "deco/hooks/useScript.ts"
import { Boat } from "site/components/Boat.tsx"

interface Props {
  /**
   * @description The description of name.
   */
  name?: string
}

const onLoad = () => {
  const w = globalThis.innerWidth
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

  const calculateFirstBoat = () => {
    const [h, w] = [globalThis.innerHeight, globalThis.innerWidth]

    let linpx: number
    let a: number
    if (w > 1030) {
      const rem = (w - 1032) / 2
      linpx = rem + 64
      a = h / 300
    } else {
      a = h / 720
      linpx = 64
    }

    if (!boat) return [linpx, a]
    boat.style.left = `${linpx}px`
    return [linpx, a]
  }

  const calculateSecondBoat = () => {
    const [h, w] = [globalThis.innerHeight, globalThis.innerWidth]

    let rinpx: number
    let a: number
    if (w > 1030) {
      const rem = (w - 1032) / 2
      rinpx = 1032 + rem - 128
      a = h / 300
    } else {
      a = h / 720
      rinpx = w - 128
    }

    if (!boat) return [rinpx, a]
    boat.style.left = `${rinpx}px`
    return [rinpx, a]
  }

  const animateBoat = () => {
    if (!boat || !wave) return

    const [linpx, a] = calculateFirstBoat()

    const point = getPathAtPos(wave, linpx)
    boat.style.left = `${linpx}px`
    boat.style.top = `${point.y * a}px`

    requestAnimationFrame(animateBoat)
  }

  const animateBoatPeer = () => {
    if (!boatPeer || !wave) return

    const [rinpx, a] = calculateSecondBoat()

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

  globalThis.addEventListener("resize", () => {
    calculateFirstBoat()
    calculateSecondBoat()
  })
}

export default function Section() {
  return (
    <>
      <script
        type="module"
        defer
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      />

      <div class="absolute flex flex-col absolute top-[50%] left-0 right-0 max-h-[60%] overflow-hidden z-10">
        <div class="flex flex-col h-full relative">
          <div class="w-full relative">
            <svg
              class="fill-primary"
              width="100%"
              viewBox="0 0 500 800"
              id="blobSvg"
              preserveAspectRatio="none"
            >
              <path id="wave">
                <animate
                  attributeName="d"
                  dur="8000ms"
                  repeatCount="indefinite"
                  values="
                  M-64.61,49.84 C15.52,-25.14 96.22,134.72 525.11,38.00 L500.00,150.00 L0.00,150.00 Z;
                  M-64.61,49.84 C40.91,23.20 276.24,61.69 525.11,38.00 L500.00,150.00 L0.00,150.00 Z;
                  M-64.61,49.84 C413.37,57.73 329.28,-18.23 525.11,38.00 L500.00,150.00 L0.00,150.00 Z;
                  M-64.61,49.84 C242.37,66.63 496.32,11.36 731.65,80.44 L500.00,150.00 L0.00,150.00 Z;
                  M-64.61,49.84 C15.52,-25.14 96.22,134.72 525.11,38.00 L500.00,150.00 L0.00,150.00 Z;
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
