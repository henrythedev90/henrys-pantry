"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import axios from "axios";
import Link from "next/link";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

export default function UserPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    debugger;
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
      <div>Welcome {userData?.user?.name}</div>
      <div>{userData?.user?.email}</div>
      {/* <Link href="/users/recipes">Recipes</Link> */}
      <Link href="/pantry">Pantry</Link>
      <div>
        <h1>Quick Stats:</h1>
        <div>
          Total Recipes:{" "}
          {userData?.user?.recipes?.length
            ? userData?.user?.recipes?.length
            : 0}
        </div>
        <div>
          Total in Pantry:{" "}
          {userData?.user?.ingredients?.length
            ? userData?.user?.ingredients?.length
            : 0}
        </div>
      </div>
      <div>
        <Link href="/users/logout">Logout</Link>
      </div>
    </ProtectedRoute>
  );
}
