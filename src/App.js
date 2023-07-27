import React, { useState } from "react";
import { useLoader } from "@react-three/fiber";
import { USDZLoader } from "three/examples/jsm/loaders/USDZLoader";

function App() {
  const [usdz, setUsdz] = useState(null);

  useLoader(USDZLoader, "./test.usdz", (loaded) => {
    console.log(loaded, "loaded");
    setUsdz(loaded.scene);
  });

  return <primitive object={usdz} />;
}

export default App;
