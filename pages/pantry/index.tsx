import ProtectedRoute from "../../components/common/ProtectedRoute";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "../../components/Container";
import classes from "./styles/pantry.module.css";
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
        debugger;
        setPantry(res.data);
        console.log(res.data, "this is the pantry");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(pantry, "this is the pantry");
  return (
    <ProtectedRoute>
      <Container>
        <div className={classes.pantry_container}>
          <div>Pantry</div>
          <div>{pantry?.pantry?.length}</div>
          <div>
            {pantry?.pantry?.map(
              (el: {
                name: string;
                quantity: number;
                unit: string;
                expirationDate: Date;
              }) => (
                <div key={el.name}>
                  <p>{el.name}</p>
                  <p>{el.quantity}</p>
                  <p>{el.unit}</p>
                  <p>
                    {el.expirationDate
                      ? el.expirationDate.toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
