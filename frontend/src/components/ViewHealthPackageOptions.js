import React, { useState } from "react";

const ViewHealthPackageOptions = () => {
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const handleViewOptions = async () => {
    if (showOptions) {
      // If options are already shown, hide them
      setShowOptions(false);
    } else {
      try {
        const response = await fetch("/api/patient/viewHealthPackageOptions", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setOptions(data);
          setShowOptions(true);
        } else {
          console.error("Error fetching health package options.");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching health package options:",
          error
        );
      }
    }
  };

  return (
    <div>
      <h3>Not Subscribed?</h3>
      <button className="btn btn-primary" onClick={handleViewOptions}>
        {showOptions
          ? "Hide Health Package Options"
          : "View Health Package Options"}
      </button>
      {showOptions && (
        <div>
          <h2>Health Package Options</h2>
          <ul>
            {options.map((option, index) => (
              <li key={index}>
                <strong>Name: {option.name}</strong>
                <p>Price: {option.price}</p>
                <p>Discount on Subscription: {option.discountOnSubscription}</p>
                <p>Discount on Session: {option.discountOnSession}</p>
                <p>Discount on Medicine: {option.discountOnMedicine}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewHealthPackageOptions;
