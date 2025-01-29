"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useAuth();
  useEffect(() => {
    if (!token) {
      router.push("/users/login");
    }
  }, [router, token]);
  if (!token) {
    return null;
  }
  return <>{children}</>;
}
