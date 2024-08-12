import React, { useEffect, useRef } from "react";

const CameraLiveVideo = ({
  imageRef,
  capturedImage,
  setCapturedImage,
  wsUrl,
}) => {
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = (event) => {
      const base64Image = event.data;
      imageRef.current.src = `data:image/jpeg;base64,${base64Image}`;
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      wsRef.current.close();
    };
  }, [imageRef, wsUrl]);

  const capturePhoto = async () => {
    const canvas = document.createElement("canvas");
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const base64Image = canvas.toDataURL("image/jpeg");
    const blob = await fetch(base64Image).then((res) => res.blob());

    setCapturedImage(base64Image);

    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");
    console.log({ base64Image, blob, formData });

    // Optional: Post formData to your server if needed.
  };

  return (
    <div className="w-100">
      <img
        ref={imageRef}
        alt="Live Stream"
        className="rounded"
        style={{ width: "auto", height: "150px" }}
      />
      <div className="overlay">
        {capturedImage && (
          <div>
            <img
              src={capturedImage}
              alt="Captured"
              className="rounded"
              style={{ width: "170px", height: "auto", margin: "10px 0px" }}
            />
          </div>
        )}
        <button
          onClick={capturePhoto}
          className="btn btn-sm btn-outline-primary my-2"
        >
          Capture Photo
        </button>
      </div>
    </div>
  );
};

export default CameraLiveVideo;
