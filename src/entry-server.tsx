import { createHandler, StartServer } from "@solidjs/start/server";
 
export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" class="dark">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body class="overflow-x-hidden overflow-y-scroll dark:bg-background-dark">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));