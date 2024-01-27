import React from "react";
import { Theme } from "@radix-ui/themes";

import SwapCurrencyForm from "./components/modules/SwapCurrencyForm";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Theme>
      <SwapCurrencyForm />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Theme>
  );
};

export default App;
