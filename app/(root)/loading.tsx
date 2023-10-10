"use client"

import { useState, CSSProperties } from "react";
import PacmanLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#7878a3",
};

export default function Loading() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#7878a3");
  // You can add any UI inside Loading, including a Skeleton.
  return       <PacmanLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
}