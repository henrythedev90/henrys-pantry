import ProtectedRoute from "../../components/common/ProtectedRoute";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "../../components/Container";
import classes from "./styles/pantry.module.css";

export default function Pantry() {
  const [pantry, setPantry] = useState<any>(null);
  const [selectedAisle, setSelectedAisle] = useState<string | null>(null);
  const [openAisle, setOpenAisle] = useState<string | null>(null);
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

  if (!pantry) return <div>Loading pantry...</div>;

  // Group items by aisle (handling multiple aisles separated by ";")
  const pantryGroups = pantry.pantry.reduce(
    (acc: Record<string, any[]>, item: any) => {
      const aisleNames = (item.aisle || "Others")
        .split(";")
        .map((aisle: string) => aisle.trim());
      aisleNames.forEach((aisle: string) => {
        if (!acc[aisle]) acc[aisle] = [];
        acc[aisle].push(item);
      });
      return acc;
    },
    {}
  );

  const aisleTypes = ["All", ...Object.keys(pantryGroups).sort()];

  // Filter items based on selected aisle
  const displayedItems =
    selectedAisle && selectedAisle !== "All"
      ? pantryGroups[selectedAisle] || []
      : pantry.pantry;

  return (
    <ProtectedRoute>
      <Container>
        <div className={classes.pantry_container}>
          <h1>Pantry</h1>
          {/* mobile */}
          {/* <div>
            {pantry &&
              Object.entries(
                pantry.pantry.reduce(
                  (acc: Record<string, any[]>, item: any) => {
                    const aisleKey = item.aisle || "Others";
                    if (!acc[aisleKey]) acc[aisleKey] = [];
                    acc[aisleKey].push(item);
                    return acc;
                  },
                  {}
                )
              )
                .sort(([aisleA], [aisleB]) => aisleA.localeCompare(aisleB))
                .map(([aisle, items]) => (
                  <div
                    key={aisle}
                    className={
                      classes[`pantry_${aisle.toLowerCase().replace(" ", "_")}`]
                    }
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
                      <div
                        className={
                          openAisle === aisle
                            ? classes.chevron_arrow_up
                            : classes.chevron_arrow_down
                        }
                      ></div>
                    </div>
                    {openAisle === aisle && (
                      <ul
                        className={`${classes.pantry_list_mobile_item} ${
                          openAisle === aisle ? "open" : ""
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
          </div> */}
          {/* desktop */}
          <div className={classes.aisle_nav}>
            {aisleTypes.map((aisle) => (
              <a
                key={aisle}
                href="#"
                className={selectedAisle === aisle ? classes.active_aisle : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedAisle(aisle === "All" ? null : aisle);
                }}
              >
                {aisle}
              </a>
            ))}
          </div>

          <div className={classes.pantry_list}>
            {displayedItems.length > 0 ? (
              <div className={classes.pantry_table}>
                {displayedItems.map((el: any) => (
                  <div key={el._id.toString()} className={classes.pantry_row}>
                    <span className={classes.pantry_item_name}>{el.name}</span>
                    <span className={classes.pantry_item_quantity}>
                      {el.quantity} {el.unit}
                    </span>
                    <span className={classes.pantry_item_expiration}>
                      {el.expirationDate
                        ? new Date(el.expirationDate).toLocaleDateString()
                        : "No Expiration"}
                    </span>
                    <button className={classes.edit_button}>Edit</button>
                    <button className={classes.delete_button}>Delete</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items found in this aisle.</p>
            )}
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
