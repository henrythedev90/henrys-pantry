import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/router";
import axios from "axios";
import Container from "../../components/Container";
import SectionSubtitle from "../../components/SectionSubtitle";
import classes from "./styles/signUp.module.css";
import Button from "../../components/Button";
// import Link from "next/link";

const SignUp = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
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
      debugger;
      await axios.post("/api/users", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        image: values.image,
      });

      setValues({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: "",
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
        <div className={classes.signup_container}>
          <SectionSubtitle subTitle="Welcome to Henry's Pantry App" />
          <div className={classes.signup_container_form}>
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
              <div className={classes.signup_container_form_image}>
                <label>Profile Picture:</label>
                <CldUploadWidget
                  uploadPreset="profile_picture_pantryApp"
                  onSuccess={(result: any) => {
                    setValues((prev) => ({
                      ...prev,
                      image: result.info.secure_url,
                    }));
                  }}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      onClick={() => open()}
                      text={
                        values.image
                          ? "Change Profile Picture"
                          : "Upload Profile Picture"
                      }
                    />
                  )}
                </CldUploadWidget>

                {/* {values.image && (
                  <div>
                    <p>Preview:</p>
                    {values.email}
                    {values.firstName}
                    {values.lastName}
                    <img src={values.image} alt="Profile" width="150" />
                  </div>
                )} */}
              </div>
              <div className={classes.signup_container_form_buttons}>
                <Button
                  type="submit"
                  disabled={loading}
                  text={loading ? "Signing up..." : "Sign Up"}
                />
                <Button
                  type="button"
                  onClick={() => router.push("/users/login")}
                  text="Login"
                />
              </div>

              {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SignUp;
