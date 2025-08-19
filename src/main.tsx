// src/main.tsx (добавь обёртку AuthProvider)
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import {theme} from "./theme";
import App from "./App";
import "./index.css";
import './App.css'
import { AuthProvider } from "./auth/AuthProvider";
import { store } from "./store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
