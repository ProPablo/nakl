import { Html, Head, Main, NextScript } from 'next/document'

// https://github.com/vercel/next.js/discussions/39821
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/custard.svg" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/comic-mono@0.0.1/index.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
