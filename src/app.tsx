import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js";
import "./app.css"
import { MetaProvider } from "@solidjs/meta"
import { inject } from "@vercel/analytics"
 
export default function App() {
  inject()

  return (
    <Router
      root={props => (
        <MetaProvider>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <Suspense><FileRoutes /></Suspense>
    </Router>
  );
}