import React, { useState, useRef, useEffect } from "react";

function ImageCropper({ imageSrc, onSave, onClose, user_id }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cropBox] = useState({ width: 200, height: 200, x: 50, y: 50 });
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  // Începe mutarea imaginii
  const startDragging = (e) => {
    e.preventDefault();
    dragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  // Muta imaginea
  const dragImage = (e) => {
    if (!dragging.current) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    console.log("Deltax",deltaX);
    console.log("Deltay",deltaY);
    console.log("Clientx",e.clientX);
    console.log("Clienty",e.clientY);
    console.log("startx:",startPos.current.x);
    console.log("starty:",startPos.current.y);

    setPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));

    console.log("Positionx",position.x);
    console.log("Positiony",position.y);


    startPos.current = { x: e.clientX, y: e.clientY };
    console.log("Startpos2",startPos.current);
  };

  // Oprește mutarea imaginii
  const stopDragging = () => {
    dragging.current = false;
  };

  // Salvează imaginea decupată
  const cropImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    // Setăm dimensiunile canvas-ului conform cropBox-ului
    canvas.width = cropBox.width;
    canvas.height = cropBox.height;

    // Calculăm poziția imaginii care va fi decupată
    // Dacă imaginea nu este mutată, poziția ar trebui să fie (0, 0), altfel luăm poziția curentă
    const offsetX = position.x;
    const offsetY = position.y;

    // Calculăm corect poziția de decupare ținând cont de scalare și offset
    const cropX = (cropBox.x - offsetX) / scale; // Calculăm offset-ul corect pentru X
    const cropY = (cropBox.y - offsetY) / scale; // Calculăm offset-ul corect pentru Y
    const cropWidth = cropBox.width /// scale; // Scalăm lățimea decupajului
    const cropHeight = cropBox.height /// scale; // Scalăm înălțimea decupajului

    // Desenăm imaginea pe canvas la dimensiunea cropBox-ului
    ctx.drawImage(
      img,
      cropX, // Poziția X a imaginii de decupat (corectă)
      cropY, // Poziția Y a imaginii de decupat (corectă)
      cropWidth, // Lățimea imaginii de decupat
      cropHeight, // Înălțimea imaginii de decupat
      0, // Poziția X pe canvas
      0, // Poziția Y pe canvas
      cropBox.width, // Lățimea pe canvas
      cropBox.height // Înălțimea pe canvas
    );

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("profile_picture", blob);

      try {
        const response = await fetch(`http://localhost:5000/profile-picture/addPicture/${user_id}`, {
          method: "PATCH",
          body: formData,
          credentials: "include",
        });

        const data = await response.json();
        if (data.imageUrl) {
          onSave(data.imageUrl); // Salvează URL-ul imaginii din S3
        }
      } catch (error) {
        console.error("Eroare la încărcarea imaginii:", error);
      }
    }, "image/webp");
  };

  return (
    <div className="cropper-overlay">
      <div className="cropper-container">
        {/* Containerul pentru imagine */}
        <div
          className="cropper-frame"
          onMouseDown={startDragging}
          onMouseMove={dragImage}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="To crop"
            className="croppable-image"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: "grab",
            }}
          />
          <div
            className="cropper-box"
            style={{
              position: "absolute",
              top: cropBox.y,
              left: cropBox.x,
              width: cropBox.width,
              height: cropBox.height,
              border: "2px dashed red",
              pointerEvents: "none", // Evită interacțiunea cu box-ul
            }}
          />
        </div>

        {/* Slider pentru scalare */}
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
        />

        <button onClick={cropImage}>Salvează</button>
        <button onClick={onClose}>Anulează</button>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default ImageCropper;


