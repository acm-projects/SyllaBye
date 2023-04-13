import React from "react";
import trash from "./delete-icon.png";

const Image = ({ image }) => {
  return (

    
    <div className="file-item">
      <button className="delete"></button>
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