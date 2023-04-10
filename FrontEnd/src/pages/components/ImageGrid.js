import React from "react";
import './ImageGrid.css'

const Image = ({ image }) => {
  return (
    <div className="file-item">
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
    return <Image image={image} key={`${image.id}-image`} />;
  };

  return (
    <section className="file-list">{images.map(renderImage)}</section>
  );
};

export default ImageGrid;