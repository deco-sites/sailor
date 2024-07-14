import { useScript } from "deco/hooks/useScript.ts"

const onLoad = (numberOfStars: number) => {
  if (numberOfStars > 20) {
    numberOfStars = 20
    console.log("CANNOT HAVE MORE THAN 20 STARS")
  }

  function addStarComponent() {
    // to do: stars appear at different intervals independently of each other
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
  }

  function addStars(numofstars: number) {
    for (let i = 0; i < numofstars; i++) {
      addStarComponent()
    }
  }

  addStars(numberOfStars)

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  function randomizeSize(array: HTMLCollectionOf<Element>) {
    const sparkleEl = Array.from(array as HTMLCollectionOf<HTMLElement>)

    for (let i = 0; i < array.length; i++) {
      let randomNumber = getRandomInt(3)
      if (randomNumber == 0) {
        sparkleEl[i].style.width = 12 + "px"
        sparkleEl[i].style.height = 14 + "px"
      } else if (randomNumber == 1) {
      } else {
        sparkleEl[i].style.width = 7 + "px"
        sparkleEl[i].style.height = 9 + "px"
      }
    }
  }

  function randomizeLocation(i: number) {
    //console.log("I got here 3");
    const var1 = Math.round(Math.random() * (globalThis.innerWidth - 5)) + "px"
    const var2 =
      Math.round(Math.random() * (globalThis.innerHeight * 0.6 - 5)) + "px"

    const sparkleEl = Array.from(
      document.getElementsByClassName(
        "sparkle1"
      ) as HTMLCollectionOf<HTMLElement>
    )
    const blurEl = Array.from(
      document.getElementsByClassName("blur1") as HTMLCollectionOf<HTMLElement>
    )

    if (sparkleEl && blurEl) {
      sparkleEl[i].style.right = var1
      blurEl[i].style.right = var1

      sparkleEl[i].style.top = var2
      blurEl[i].style.top = var2
    } else {
      console.log("Elements not generated")
    }
  }

  function finishAnimation() {
    const animated = document.getElementsByClassName("sparkle1")

    if (animated[0]) {
      for (let i = 0; i < animated.length; i++) {
        animated[i].addEventListener("animationend", () => {
          randomizeSize(animated)
          randomizeLocation(i)
          restartAnimation(i)
        })
      }
    } else {
      console.log("ITS BROKEN")
    }
  }

  function loopFunction(delay: number, func: () => void) {
    const loop = function () {
      func()
      setTimeout(loop, delay)
    }
    loop()
  }

  function restartAnimation(i: number) {
    const el = Array.from(
      document.getElementsByClassName(
        "sparkle1"
      ) as HTMLCollectionOf<HTMLElement>
    )
    const el2 = Array.from(
      document.getElementsByClassName("blur1") as HTMLCollectionOf<HTMLElement>
    )

    if (el && el2) {
      el[i].style.animation = "none"
      el2[i].style.animation = "none"

      el[i].offsetHeight /* trigger reflow */
      el2[i].offsetHeight /* trigger reflow */

      el[i].style.animation = ""
      el2[i].style.animation = ""
    } else {
      console.log("Element doesn't exist yet")
    }
  }

  globalThis.onload = (_event) => {
    const animated = document.getElementsByClassName("sparkle1")

    for (let i = 0; i < animated.length; i++) {
      randomizeLocation(i)
    }

    finishAnimation()

    loopFunction(10000, function () {
      finishAnimation()
    })
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
