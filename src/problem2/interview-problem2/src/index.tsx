import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/global.scss";
import "./styles/common.scss";
import "@radix-ui/themes/styles.css";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <App />
  </>
);
