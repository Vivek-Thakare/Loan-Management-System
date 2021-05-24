import React from "react";
import load from "./load.gif";

export default function Spinner() {
  return (
    <div>
      <img
        src={load}
        alt="Loading.."
        style={{
          width: "70%",
          margin: "auto",
          display: "block",
        }}
      ></img>
    </div>
  );
}
