import { useScript } from "deco/hooks/useScript.ts"

const onLoad = (numberOfStars: number) => {
  if (numberOfStars > 20) {
    numberOfStars = 20
    console.log("CANNOT HAVE MORE THAN 20 STARS")
  }

  function addStarComponent() {
    let outerDiv = document.createElement("div")
    let innerDiv1 = document.createElement("div")
    innerDiv1.className = "sparkle1"
    let innerDiv2 = document.createElement("div")
    innerDiv2.className = "blur1"

    outerDiv.appendChild(innerDiv1)
    outerDiv.appendChild(innerDiv2)
    let mysection = document.querySelector(".whatever")

    if (mysection) mysection.appendChild(outerDiv)
    else {
      console.log("section doesnt exist")
    }

    const starIndex = document.getElementsByClassName("sparkle1").length - 1
    randomizeLocation(starIndex)
    randomizeSize(starIndex)
    restartAnimation(starIndex)
    loopAnimation(starIndex)
  }

  function addStars(numofstars: number) {
    for (let i = 0; i < numofstars; i++) {
      let delay = getRandomInt(3)
      setTimeout(() => {
        addStarComponent()
      }, delay * 1000)
    }
  }

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  function randomizeSize(i: number) {
    const sparkleEl = document.getElementsByClassName("sparkle1")[
      i
    ] as HTMLElement
    let randomNumber = getRandomInt(3)
    if (randomNumber == 0) {
      sparkleEl.style.width = 12 + "px"
      sparkleEl.style.height = 14 + "px"
    } else if (randomNumber == 1) {
      sparkleEl.style.width = 10 + "px"
      sparkleEl.style.height = 12 + "px"
    } else {
      sparkleEl.style.width = 7 + "px"
      sparkleEl.style.height = 9 + "px"
    }
  }

  function randomizeLocation(i: number) {
    const var1 = Math.round(Math.random() * (globalThis.innerWidth - 5)) + "px"
    const var2 =
      Math.round(Math.random() * (globalThis.innerHeight * 0.6 - 5)) + "px"

    const sparkleEl = document.getElementsByClassName("sparkle1")[
      i
    ] as HTMLElement
    const blurEl = document.getElementsByClassName("blur1")[i] as HTMLElement

    if (sparkleEl && blurEl) {
      sparkleEl.style.right = var1
      blurEl.style.right = var1

      sparkleEl.style.top = var2
      blurEl.style.top = var2
    } else {
      console.log("Elements not generated")
    }
  }

  function restartAnimation(i: number) {
    const sparkleEl = document.getElementsByClassName("sparkle1")[
      i
    ] as HTMLElement
    const blurEl = document.getElementsByClassName("blur1")[i] as HTMLElement

    if (sparkleEl && blurEl) {
      sparkleEl.style.animation = "none"
      blurEl.style.animation = "none"

      sparkleEl.offsetHeight /* trigger reflow */
      blurEl.offsetHeight /* trigger reflow */

      sparkleEl.style.animation = ""
      blurEl.style.animation = ""
    } else {
      console.log("Element doesn't exist yet")
    }
  }

  function loopAnimation(i: number) {
    const sparkleEl = document.getElementsByClassName("sparkle1")[
      i
    ] as HTMLElement
    if (sparkleEl) {
      sparkleEl.addEventListener("animationend", () => {
        randomizeSize(i)
        randomizeLocation(i)
        restartAnimation(i)
        loopAnimation(i) // Continue the loop for this star
      })
    }
  }

  globalThis.onload = (_event) => {
    addStars(numberOfStars)
  }
}

interface Props {
  /**
   * @description The description of name.
   */
  numberOfStars?: number
}

export default function Section({ numberOfStars = 10 }: Props) {
  return (
    <div id="starcontainer" class="bg-base-100 z-0">
      <header>
        <script
          dangerouslySetInnerHTML={{
            __html: useScript(onLoad, numberOfStars),
          }}
          type="module"
        ></script>
      </header>
      <section className="whatever"></section>
    </div>
  )
}
