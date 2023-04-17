import React from "react";
import trash from "./delete-icon.png";
// import { useHistory } from 'react-router';

const Image = ({ image, onDelete }) => {

  // const history = useHistory();

  async function deleteImage() {
    console.log("ran")
    const res = await fetch("http://localhost:1337/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ thumbnail: image.src }),
    })

    console.log(res);
    if(res){
      onDelete();
      // return img.filter((img) => img.src !== image.src);
      // img = img.filter((img) => img.src !== image.src);
      // console.log(img);
      // ImageGrid({images: img});
      
      // window.location.reload();
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