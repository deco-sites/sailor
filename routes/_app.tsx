import { asset, Head } from "$fresh/runtime.ts"
import { defineApp } from "$fresh/server.ts"
import { Context } from "deco/deco.ts"
import Theme from "../sections/Theme/Theme.tsx"

export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision()

  return (
    <>
      {/* Include default fonts and css vars */}
      <Theme colorScheme="any" />

      <Head>
        {/* Enable View Transitions API */}
        <meta name="view-transition" content="same-origin" />

        {/* Tailwind v3 CSS file */}
        <link
          href={asset(`/styles.css?revision=${revision}`)}
          rel="stylesheet"
        />

        {/* Web Manifest */}
        <link rel="manifest" href={asset("/site.webmanifest")} />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />
      </Head>

      {/* Rest of Preact tree */}
      <main class="h-screen">
        <ctx.Component />
      </main>
    </>
  )
})
