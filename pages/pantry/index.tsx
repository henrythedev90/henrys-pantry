import ProtectedRoute from "../../components/common/ProtectedRoute";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "../../components/Container";
import classes from "./styles/pantry.module.css";
export default function Pantry() {
  const [pantry, setPantry] = useState<any>(null);
  const [openAisle, setOpenAisle] = useState<string | null>(null);

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
            {pantry &&
              Object.entries(
                pantry.pantry.reduce(
                  (acc: Record<string, any[]>, item: any) => {
                    if (!acc[item.aisle]) acc[item.aisle] = [];
                    acc[item.aisle].push(item);
                    return acc;
                  },
                  {}
                )
              )
                .sort(([aisleA], [aisleB]) => aisleA.localeCompare(aisleB))
                .map(([aisle, items]) => (
                  <div
                    key={aisle}
                    className={`pantry_${aisle
                      .toLowerCase()
                      .replace(" ", "_")}`}
                  >
                    <div
                      className={classes.toggle_pantry}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenAisle(openAisle === aisle ? null : aisle);
                      }}
                    >
                      <h1 className={classes.pantry_list_mobile_title}>
                        {aisle}
                      </h1>
                      {openAisle === aisle ? (
                        <div className={classes.chevron_arrow_up}></div>
                      ) : (
                        <div className={classes.chevron_arrow_down}></div>
                      )}
                    </div>
                    {openAisle === aisle && (
                      <ul
                        className={`${classes.pantry_list_mobile_item}${
                          openAisle === aisle ? " open" : ""
                        }`}
                      >
                        {Array.isArray(items) &&
                          items.map((el: any) => (
                            <div key={el._id.toString()}>
                              <p>{el.name}</p>
                              <p>{el.quantity}</p>
                              <p>{el.aisle}</p>
                              <p>
                                {el.expirationDate
                                  ? new Date(
                                      el.expirationDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
