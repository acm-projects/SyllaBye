import React from "react";
import trash from "./delete-icon.png";

const Image = ({ image, onDelete }) => {

  async function deleteImage() {
    const res = await fetch("http://localhost:1337/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ thumbnail: image.src }),
    })

    if(res){
      onDelete(image.id);
    }
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


function ImageGrid({ images, onDelete }) {

  const renderImage = (image) => {
    return <Image image={image} key={`${image.id}-image`} onDelete={onDelete}/> ;
  };

  return (
    <section className="file-list">{images.map(renderImage)}</section>
  );
};

export default ImageGrid;