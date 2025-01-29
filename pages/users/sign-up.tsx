import React, { useState } from "react";
import Container from "../../components/Container";
import { useRouter } from "next/router";
// import Button from "../../components/Button";
// import Link from "next/link";
import axios from "axios";

const SignUp = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (values.password !== values.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      await axios.post("/api/users", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      setValues({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        alert("Welcome to Henrys Pantry, please login");
        router.push(`/users/login`);
      }, 500);
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occurred while signing up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={values.firstName}
              onChange={handleChanges}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={values.lastName}
              onChange={handleChanges}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChanges}
              required
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChanges}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChanges}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
      </Container>
    </div>
  );
};

export default SignUp;
