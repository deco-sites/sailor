import { useScript } from "deco/hooks/useScript.ts"
import { Boat } from "site/components/Boat.tsx"

const onLoad = () => {
  const w = globalThis.innerWidth
  const blobSvg = document.getElementById("blobSvg") as SVGElement | null
  const boat = document.getElementById("boat")
  const boatPeer = document.getElementById("boatPeer")
  const wave = document.getElementById("wave") as SVGPathElement | null
  let shouldCalculatePeer = !!window.location.hash
  let shouldPeerSink = false
  let peerDeph = 0
  let newPos = -240

  const showToast = (msmg: string, error?: boolean) => {
    const toast = document.createElement("div")
    toast.className = `absolute top-0 mt-10 z-20 left-0 right-0 mx-auto w-full  ${
      error ? "bg-red-500 text-white" : "bg-base-100"
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

  const getPathAtPos = (path: SVGPathElement, pos: number) => {
    const totalLength = path.getTotalLength()
    const waveLength = totalLength * 0.22
    const point = path.getPointAtLength((waveLength * pos) / w)
    return point
  }

  const calculatePeerBoat = () => {
    const [h, w] = [globalThis.innerHeight, globalThis.innerWidth]

    let linpx: number
    let a: number
    if (w > 1030) {
      const rem = (w - 1032) / 2
      linpx = rem + 128
      a = h / 300
    } else {
      a = h / 700
      linpx = 128
    }

    if (!shouldCalculatePeer) {
      if (!boatPeer) return [10, a]
      boatPeer.style.left = `${-240}px`
      return [10, a]
    }

    if (!boatPeer) return [linpx, a]
    boatPeer.style.left = `${linpx}px`
    return [linpx, a]
  }

  const calculateBoat = () => {
    const [h, w] = [globalThis.innerHeight, globalThis.innerWidth]

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

    if (!boat) return [rinpx, a]
    boat.style.left = `${rinpx}px`
    return [rinpx, a]
  }

  const animateBoatPeer = () => {
    if (!boatPeer || !wave) return
    const [linpx, a] = calculatePeerBoat()

    if (!linpx) return
    const pox = window.location.hash ? linpx : newPos
    const point = getPathAtPos(wave, pox)

    peerDeph = point.y * a - 80
    if (shouldPeerSink) return
    boatPeer.style.top = `${peerDeph}px`

    requestAnimationFrame(animateBoatPeer)
  }

  const animateBoat = () => {
    if (!boat || !wave) return

    const [rinpx, a] = calculateBoat()
    const point = getPathAtPos(wave, rinpx)
    boat.style.left = `${rinpx}px`

    boat.style.top = `${point.y * a - 80}px`
    requestAnimationFrame(animateBoat)
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

  waitForPathToLoad(animateBoat)
  waitForPathToLoad(animateBoatPeer)

  globalThis.addEventListener("resize", () => {
    calculateBoat()
    calculatePeerBoat()
  })

  let leftPos = 0
  const animatePeerEnter = () => {
    const w = globalThis.innerWidth
    if (!boatPeer) return
    leftPos += 0.8
    newPos = leftPos
    boatPeer.style.left = leftPos + "px"

    let max = 0

    if (w > 1030) {
      const rem = (w - 1032) / 2
      max = rem + 128
    } else {
      max = 128
    }

    console.log("anim", Number(boatPeer.style.left.slice(0, -2)))
    if (Number(boatPeer.style.left.slice(0, -2)) >= max) {
      shouldCalculatePeer = true
      return
    }

    requestAnimationFrame(animatePeerEnter)
  }

  let peerTilt = 0

  const animatePeerSink = () => {
    if (!boatPeer) return
    peerTilt += 0.6

    if (peerTilt < 62) {
      boatPeer.style.transform = `rotate(${-peerTilt}deg)`
      requestAnimationFrame(animatePeerSink)
      return
    }

    peerDeph += 1
    if (peerDeph > 690) {
      boatPeer.hidden = true
      return
    }

    boatPeer.style.top = peerDeph + "px"
    requestAnimationFrame(animatePeerSink)
  }

  globalThis.addEventListener("htmx:wsAfterMessage", (data: any) => {
    let message
    try {
      message = JSON.parse(data.detail.message)
    } catch (e) {
      console.debug(e)
    }

    if (!message) return

    if (message.type === "peerConnected") {
      showToast("Peer connected")
      // trigger the boat animation
      requestAnimationFrame(animateBoatPeer)
      // animate boat untill it reaches the correct pos
      requestAnimationFrame(animatePeerEnter)
    }

    if (message.type === "ownerDisconnected") {
      showToast("Peer disconnected")
      shouldPeerSink = true
      requestAnimationFrame(animatePeerSink)
    }

    if (message.type === "peerDisconnected") {
      showToast("Peer disconnected")
      shouldPeerSink = true
      requestAnimationFrame(animatePeerSink)
    }

    if (message.type === "error") {
      showToast(message.description || "An error has ocurred", true)
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
      />

      <div class="absolute flex flex-col absolute top-[50%] left-0 right-0 max-h-[60%] overflow-hidden z-10">
        <div class="flex flex-col h-full relative">
          <div class="w-full relative">
            <svg
              class="fill-primary"
              width="100%"
              viewBox="0 0 500 700"
              id="blobSvg"
              preserveAspectRatio="none"
            >
              <path id="wave">
                <animate
                  attributeName="d"
                  dur="8000ms"
                  repeatCount="indefinite"
                  values="
                    M-64.61,49.84 C25.52,-25.14 96.22,134.72 525.11,38.00 L500.00,700.00 L0.00,700.00 Z;
                    M-64.61,49.84 C40.91,23.20 276.24,61.69 525.11,38.00 L500.00,700.00 L0.00,700.00 Z;
                    M-64.61,49.84 C313.37,57.73 229.28,10.39 555.11,38.00 L500.00,700.00 L0.00,700.00 Z;
                    M-64.61,49.84 C242.37,66.63 296.32,25.56 631.65,50.44 L500.00,700.00 L0.00,700.00 Z;
                    M-64.61,49.84 C142.37,-25.14 196.22,35.72 525.11,38.00 L500.00,700.00 L0.00,700.00 Z;
                    M-64.61,49.84 C90.37,-25.14 96.22,61.69 625.11,38.00 L500.00,700.00 L0.00,700.00 Z;
                    M-64.61,49.84 C25.52,-25.14 96.22,134.72 525.11,38.00 L500.00,700.00 L0.00,700.00 Z;
                  "
                ></animate>
              </path>
            </svg>
            <div>
              <div id="boat" class="absolute w-14">
                <Boat inverted />
              </div>
              <div id="boatPeer" class=" absolute w-14">
                <Boat />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
