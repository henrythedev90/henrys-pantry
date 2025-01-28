import React from "react";
import { AuthProvider } from "../components/common/AuthContext";

export default function MyApp({ Component, pageProps }: any) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
