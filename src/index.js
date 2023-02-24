import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { ChatContextProvider } from "./context/MessageContext";

const root = ReactDOM.createRoot(document.body);
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);
