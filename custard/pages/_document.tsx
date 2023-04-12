import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <title>NAKL</title>
        <meta name="description" content="Not a Keylogger" />
        <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
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
