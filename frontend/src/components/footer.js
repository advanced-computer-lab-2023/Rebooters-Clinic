import React from "react";

const Footer = () => {
  return (
    <footer
      class="border-top"
      style={{
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "20px 0px",
      }}
    >
      <p className="text" style={{ margin: "0" }}>
        © 2023 Rebooters, Inc. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
