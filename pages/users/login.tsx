"use client";
import { useState } from "react";
import { useAuth } from "../../components/common/AuthContext";
import Container from "../../components/Container";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./styles/login.module.css"; // Correctly importing CSS module
import SectionSubtitle from "../../components/SectionSubtitle";
import Link from "next/link";

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const handleChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            email: values.email,
            password: values.password,
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
    <div>
      <Container>
        <div className={styles.login_container}>
          <div className={styles.login_container_title}>
            <div className={styles.login_container_title_text}>
              <SectionSubtitle subTitle="Welcome to Henry's Pantry App" />

              <ul>
                <li>
                  Simplify your pantry management with our easy-to-use app.
                </li>
                <li>Recipes with ingredients you already have</li>
              </ul>
            </div>
          </div>
          <div className={styles.login_container_title_buttons}>
            <div className={styles.login_form_container}>
              <form onSubmit={handleSubmit}>
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
                <div className={styles.login_form_container_button}>
                  <Button
                    type="submit"
                    disabled={loading}
                    text={loading ? "Logging in..." : "Login"}
                  />
                </div>

                {error && <div style={{ color: "red" }}>{error}</div>}
              </form>
            </div>
          </div>
          <div className={styles.login_container_signup_container}>
            <h4>New to the app?</h4>
            <div className={styles.login_container_title_buttons_container}>
              <Button
                text="Sign up"
                onClick={() => {
                  router.push("/users/sign-up");
                }}
              />
              <Button
                text="Learn more about founder"
                onClick={() => {
                  window.open("https://henry-nunez.com/", "_blank");
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
