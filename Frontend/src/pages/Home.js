import React, {useEffect, useState, useCallback} from "react";
import Header from "./components/Header";
import Dropzone from "./components/Dropzone";
import ImageGrid from "./components/ImageGrid";
import cuid from "cuid";

function Home() {

  const [images, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImages((prevState) => [
          ...prevState,
          { id: cuid(), src: e.target.result },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  return (
    <main className="App">
      <Header/>
      
      <Dropzone 
        onDrop={onDrop} 
        accept={"application.pdf"} 
        restrictions={{
          allowedExtensions: [".pdf"]
        }}
      />

      <ImageGrid images={images}/>

    </main>
  );
}

export default Home;