import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { USDZLoader } from "three-usdz-loader";

const App = () => {
  const fileInputRef = useRef();
  const [loadedModel, setLoadedModel] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState();

  useEffect(() => {
    setLoader();
  }, []);

  useEffect(() => {
    const onWindowResize = () => {
      if (loadedModel && loadedModel.camera) {
        loadedModel.camera.aspect = window.innerWidth / window.innerHeight;
        loadedModel.camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (loadedModel) {
        loadedModel.dispose();
      }
    };
  }, [loadedModel]);

  const loadFiles = async (file) => {
    if (loadedModel) {
      loadedModel.dispose();
    }

    // Create a new USDZ loader

    try {
      const loaders = new USDZLoader("/wasm");
      console.log(loaders, "lodrt");

      // Load the USDZ file
      const group = new THREE.Group();
      const scene = new THREE.Scene();
      // Add the group to the scene
      scene.add(group);
      console.log("IN NOW", file);
      const model = await loaders.loadFile(file, scene.children.Group);
      console.log("first", model);
      console.log(model, "MODEL");
      setLoadedModel(model);
      setError(null);
    } catch (e) {
      // alert(e);
      setError("Error loading USDZ model");
      console.error("Error loading USDZ model", e);
    }
  };

  const onChange = () => {
    if (fileInputRef.current.files != null) {
      loadFiles(fileInputRef.current.files[0]);
    }
  };

  const onClickDragZone = () => {
    fileInputRef.current.click();
  };

  const dragover = (event) => {
    event.preventDefault();
  };

  // const drop = (event) => {
  //   event.preventDefault();
  //   if (event.dataTransfer == null) {
  //     console.error("Files are null");
  //     return;
  //   }
  //   loadFile(event.dataTransfer.files[0]);
  // };

  return (
    <>
      <Canvas style={{ width: "100%", height: "100%" }}>
        <OrbitControls />

        <ambientLight intensity={1} />
        {loadedModel && <primitive object={loadedModel.scene} dispose={null} />}
      </Canvas>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => onChange()}
      />
      {error && (
        <div>
          <div>{error}</div>
        </div>
      )}
      {!loadedModel && (
        <div>
          <div
            style={{
              cursor: "pointer",
              padding: "10px",
              background: "#f0f0f0",
            }}
            onClick={onClickDragZone}
          >
            Drag and drop a USDZ file or click here to select one.
          </div>
        </div>
      )}
    </>
  );
};

export default App;
