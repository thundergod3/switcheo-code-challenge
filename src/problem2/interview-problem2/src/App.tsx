import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";

import SwapCurrencyForm from "./components/modules/SwapCurrencyForm";

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
