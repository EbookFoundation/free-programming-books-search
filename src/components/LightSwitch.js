import React, { useState } from "react";

function LightSwitch() {
  const [lightMode, setLightMode] = useState(false);
  return (
    <img
      alt="Toggle light/dark mode"
      src={
        lightMode
          ? "https://toppng.com/uploads/preview/sun-11545692406nbrflpmao0.png"
          : "https://www.kindpng.com/picc/m/293-2939577_clip-art-drawing-of-moon-and-stars-star.png"
      }
      onClick={() => setLightMode(!lightMode)}
      style={{ width: "100px", height: "100px", display: "block", marginLeft: "auto", marginRight: "auto" }}
    />
  );
}

export default LightSwitch;
