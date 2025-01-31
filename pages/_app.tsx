import React from "react";
import { AuthProvider } from "../components/common/AuthContext";
import Header from "../components/Header";
import "../src/app/globals.css";
export default function MyApp({ Component, pageProps }: any) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
