import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  console.log("req.headers:", req.headers);

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log("token:", token);
  try {
    const user = jwt.verify(token, JWT_SECRET);
    if (user) {
      console.log("user:", user);
      res.status(200).json({ message: "Logged out successfully" });
    }
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error" });
  }

  res.status(200).json({ message: "Logged out successfully" });
}

// Example React component for logging out
// import React from 'react';

// const LogoutButton = () => {
//   const handleLogout = async () => {
//     // Call the logout API
//     await fetch('/api/users/log-out', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in local storage
//       },
//     });

//     // Remove the token from local storage
//     localStorage.removeItem('token');
//     // Optionally, redirect the user or update the UI
//   };

//   return <button onClick={handleLogout}>Log Out</button>;
// };

// export default LogoutButton;
