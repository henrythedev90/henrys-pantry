import React, { useState } from "react";
import Container from "../../components/Container";
import { useAuth } from "../../components/common/AuthContext";
import { useRouter } from "next/navigation";
// import Button from "../../components/Button";
// import Link from "next/link";
import axios from "axios";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const res = await axios
        .post(
          "/api/users",
          {
            name,
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const { newUser, token } = res.data;
          console.log("Token received:", token); // Log the token
          localStorage.setItem("token", token);
          login(token, newUser._id);
          console.log("Redirecting to:", `/users/${newUser._id}`); // Log the redirect URL
          router.push(`/users/${newUser._id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occurred while signing up.");
    }
  };
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </Container>
  );
};

export default SignUp;
