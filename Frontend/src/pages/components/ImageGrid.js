import React from "react";
import trash from "./delete-icon.png";
import { useHistory } from 'react-router-dom';

const Image = ({ image }) => {

  const history = useHistory();

  const deleteImage = () => {
    console.log("ran")
    fetch("http://localhost:1337/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ thumbnail: image.src }),
    }).then((res) => {
      // window.location.reload();
      // history.go(0);
      console.log(res);
      return res.json();
    }).then((res) => {
      if (res) {
        console.log("Deleted");
      } else {
        console.log("Error");
      }
    });
  };

  return (

    
    <div className="file-item">
      <button className="delete" onClick={deleteImage}></button>
      {image.isPdf ? (
        <div className="pdf-icon">PDF</div>
      ) : (
        <img
          alt={`img - ${image.id}`}
          src={image.src}
          className="file-img"
        />
      )}

      
      <button type="button" className="pdf-label">{image.name}</button>
      
      
    </div>
  );
};

const ImageGrid = ({ images }) => {

  const renderImage = (image) => {
    return <Image image={image} key={`${image.id}-image`} /> ;
  };

  return (
    <section className="file-list">{images.map(renderImage)}</section>
  );
};

export default ImageGrid;