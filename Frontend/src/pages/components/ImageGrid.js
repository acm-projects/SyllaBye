import React from "react";
import "./ImageGrid.css";

const Image = ({ image }) => {
  return (
    <div className="file-item">
      <img
        alt={`img - ${image.id}`}
        src={image.src}
        className="file-img"
      />
    </div>
  );
};

const ImageGrid = ({ images }) => {

  const renderImage = (image, index) => {
    return <Image image={image} key={`${image.id}-image`} />;
  };

  return (
    <section className="file-list">{images.map(renderImage)}</section>
  );
};

export default ImageGrid;