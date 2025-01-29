import ProtectedRoute from "../../components/common/ProtectedRoute";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "../../components/Container";

export default function Pantry() {
  const [pantry, setPantry] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`/api/pantry`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPantry(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(pantry, "this is the pantry");
  return (
    <ProtectedRoute>
      <Container>
        <div>
          <div>Pantry</div>
          <div>{pantry?.pantry?.length}</div>
          <div>
            {pantry?.pantry?.map((el: any) => {
              <p>{el}</p>;
            })}
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
