/* import { StrictMode } from "react"; */
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import appStore from "./redux/appStore";

createRoot(document.getElementById("root")).render(
  <Provider store={appStore}>
    <App />
  </Provider>,
);
