"use client";
import { useState } from "react";
import { useAuth } from "../../components/common/AuthContext";
import Container from "../../components/Container";
import Button from "../../components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import classes from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      await axios
        .post(
          "/api/users/auth/login",
          {
            email,
            password,
          },
          {
            headers: headers,
          }
        )
        .then((response) => {
          const { token, userId } = response.data;
          localStorage.setItem("token", token);
          login(token, userId);
        });
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error logging in. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.login_container}>
      <div className={classes.login_container_welcome_container}>
        <Container>
          <h1>Welcome to the Pantry App</h1>
          <p>Simplify your pantry management with our easy-to-use app.</p>
          <p>Recipes with ingredients you already have</p>
        </Container>
      </div>
      <div>
        <Container>
          <h1>Button to sign up</h1>
          <Button
            text="Sign up"
            onClick={() => {
              router.push("/users/sign-up");
            }}
          />
        </Container>
      </div>
      <div className={classes.login_container_form_container}>
        <Container>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <div style={{ color: "red" }}>{error}</div>}
          </form>
        </Container>
      </div>
    </div>
  );
}
