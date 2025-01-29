import React from "react";
import jwt from "jsonwebtoken";
import Container from "../components/Container";
import { useRouter } from "next/router";
import classes from "./style/not-found.module.css";

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
    <div>
      <Container>
        <div className={classes.notFoundContainer}>
          <button type="button" onClick={handleRedirect}>
            Go to User Page
          </button>
          <div>You are not authorize to visit this page</div>
        </div>
      </Container>
    </div>
  );
}
