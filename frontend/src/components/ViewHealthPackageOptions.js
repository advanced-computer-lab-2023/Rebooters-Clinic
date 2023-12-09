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
    <div className="card">
      <h1>Not Subscribed?</h1>
      <button className="btn btn-primary" onClick={handleViewOptions}>
        {showOptions
          ? "Hide Health Package Options"
          : "View Health Package Options"}
      </button>
      <br/>
      {showOptions && (
        <table className="table table-bordered">
          <tbody>
            <tr>
              {options.map((option, index) => (
                <td key={index}>
                  <h2>{option.name}</h2>
                  <p>
                    <strong>Price:</strong> {option.price}
                  </p>
                  <p>
                    <strong>Discount on Subscription:</strong>{" "}
                    {option.discountOnSubscription}
                  </p>
                  <p>
                    <strong>Discount on Session:</strong>{" "}
                    {option.discountOnSession}
                  </p>
                  <p>
                    <strong>Discount on Medicine:</strong>{" "}
                    {option.discountOnMedicine}
                  </p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewHealthPackageOptions;
