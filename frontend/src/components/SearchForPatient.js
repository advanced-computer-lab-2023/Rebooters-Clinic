import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SearchForPatient = () => {
  const [name, setName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await fetch("/api/doctor/doctor-patients-name", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
        const json = await response.json();
        setSearchResults(json);
      } catch (error) {
        console.error("Error during search:", error);
      }
    };

    // Avoid making an unnecessary request when the name is empty
    if (name.trim() !== "") {
      handleSearch();
    } else {
      // Clear results if the search input is empty
      setSearchResults([]);
    }
  }, [name]);

  return (
    <div className="search-container">
      <form>
        <h3>Search For Patient by Name</h3>
        <input
          type="text"
          placeholder="Search For Patient by Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="form-control"
        />
      </form>
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Search Results</h4>
          <ul>
            {searchResults.map((result) => (
              <li key={result._id}>
                <p>ID: {result._id}</p>
                <p>Name: {result.name}</p>
                <p>Email: {result.email}</p>
                <p>
                  Date of Birth:{" "}
                  {new Date(result.dateOfBirth).toLocaleDateString()}
                </p>
                <p>Gender: {result.gender}</p>
                <p>Mobile Number: {result.mobile_number}</p>
                <p>
                  Emergency Contact:{" "}
                  {`${result.emergency_contact.firstName} ${result.emergency_contact.middleName} ${result.emergency_contact.lastName} (${result.emergency_contact.mobile_number})`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchForPatient;
