import React from "react";
import jwt from "jsonwebtoken";
import Container from "../components/Container";
import { useRouter } from "next/router";

export default function NotFound() {
  const token = localStorage.getItem("token");
  const router = useRouter();
  const handleRedirect = () => {
    const decodedToken = token ? jwt.decode(token) : null; // Decode the token
    const userId =
      decodedToken && typeof decodedToken === "object" ? decodedToken.id : null; // Safely access the user ID
    if (userId) {
      // Use Next.js router for navigation instead of window.location
      router.push(`/users/${userId}`);
    }
  };

  return (
    <Container>
      <div
        style={{
          padding: "200px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid red",
          marginTop: "140px",
        }}
      >
        <div>
          <button type="button" onClick={handleRedirect}>
            Go to User Page
          </button>
        </div>
        <div>
          <p>You are not authorized to visit this page</p>
        </div>
      </div>
    </Container>
  );
}
