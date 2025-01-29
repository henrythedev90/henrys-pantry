import React from "react";
import { AuthProvider } from "../components/common/AuthContext";
import Header from "../components/Header";
export default function MyApp({ Component, pageProps }: any) {
  return (
    <AuthProvider>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Header />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
