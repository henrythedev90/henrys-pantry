"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import axios from "axios";
import Link from "next/link";
import Container from "../../components/Container";
import Image from "next/image";
import classes from "./styles/user.module.css";
import Pantry from "../../pages/pantry";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

export default function UserPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`/api/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUserData(res.data);
        console.log(res.data, "this is the user data");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(userData, "this is the user data");
  return (
    <ProtectedRoute>
      <Container>
        <div className={classes.user_page_container}>
          <div className={classes.user_page_container_header}>
            <div className={classes.user_page_container_header_desktop}>
              <div className={classes.user_page_container_header_welcome}>
                <h3>Welcome!</h3>
                <p style={{ marginTop: "10px" }}>{userData?.user?.firstName}</p>
                <p style={{ marginTop: "5px" }}>{userData?.user?.email}</p>
              </div>
              <div className={classes.user_page_container_header_image}>
                <Image
                  src={userData?.user?.image}
                  alt="Profile"
                  width={150}
                  height={150}
                />
              </div>
            </div>
          </div>
          <div className={classes.user_page_container_stats}>
            <div className={classes.user_page_container_stats_header}>
              <h3 style={{ borderBottom: "2px solid var(--text-primary)" }}>
                Quick Stats:
              </h3>
            </div>
            <div className={classes.user_page_container_stats_total_recipes}>
              <h5>Total Recipes: </h5>
              <p>
                {userData?.user?.recipes?.length
                  ? userData?.user?.recipes?.length
                  : 0}
              </p>
            </div>
            <div className={classes.user_page_container_stats_total_pantry}>
              <h5>Total in Pantry: </h5>
              <p>
                {userData?.user?.pantry?.length
                  ? userData?.user?.pantry?.length
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </Container>
      <Container>
        <Pantry />
      </Container>
    </ProtectedRoute>
  );
}
