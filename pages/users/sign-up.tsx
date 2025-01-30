import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/router";
import axios from "axios";
import Container from "../../components/Container";
// import Button from "../../components/Button";
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
          <div>
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                  className="btn btn-primary"
                >
                  {values.image
                    ? "Change Profile Picture"
                    : "Upload Profile Picture"}
                </button>
              )}
            </CldUploadWidget>

            {values.image && (
              <div>
                <p>Preview:</p>
                {values.email}
                {values.firstName}
                {values.lastName}
                <img src={values.image} alt="Profile" width="150" />
              </div>
            )}
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
