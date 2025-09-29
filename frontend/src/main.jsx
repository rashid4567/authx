import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import Store from "../store"; 
import App from "./App"; 
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={Store}> 
      <App />
    </Provider>
  </StrictMode>
);