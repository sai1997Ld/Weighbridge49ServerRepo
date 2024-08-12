import { useEffect, useRef, useState } from "react";
import "./LiveVideo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faImage } from "@fortawesome/free-solid-svg-icons";


const CaptureFrame = ({
  imageRef,
  capturedImage,
  setCapturedImage,
  wsUrl,
  label,
}) => {
  const wsRef = useRef(null);
  const containerRef = useRef(null);
  const imageContainerRef = useRef(null); // Ref for the image container
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false); // State for image full-screen mode

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
  
    // Set the canvas dimensions to match the original image dimensions
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
    // Increase the image quality when converting to data URL
    const base64Image = canvas.toDataURL("image/jpeg", 0.9); // 0.9 is 90% quality
    const blob = await fetch(base64Image).then((res) => res.blob());
  
    setCapturedImage(base64Image);
  
    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");
    console.log({ base64Image, blob, formData });
  
    // Optional: Post formData to your server if needed.
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleImageFullScreen = () => {
    if (!document.fullscreenElement) {
      imageContainerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        containerRef.current.classList.add("fullscreen");
      } else {
        containerRef.current.classList.remove("fullscreen");
      }
    };

    const handleImageFullScreenChange = ()=> {
      setIsImageFullScreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        imageContainerRef.current.classList.add("fullscreen");
      } else {
        imageContainerRef.current.classList.remove("fullscreen");
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("fullscreenchange", handleImageFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("fullscreenchange", handleImageFullScreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="">
      <div className="video-content-cam">
        <div className="video-header-cam">
          <span>{label}</span>
        </div>
        <img
          ref={imageRef}
          alt="Live Stream"
          className="rounded img-fluid"
        />
        <button onClick={toggleFullScreen} className="full-screen-button">
          {isFullScreen ? (
            "Exit Full Screen"
          ) : (
            <FontAwesomeIcon icon={faExpand} />
          )}
        </button>
        <div className="overlay-cam">
          <button
            onClick={capturePhoto}
            className="btn btn-sm btn-outline-primary fw-bold mb-2"
          >
            <FontAwesomeIcon icon={faImage} />
          </button>
        </div>
      </div>
      {capturedImage && (
        <div ref={imageContainerRef} className="captured-image">
          <img
            src={capturedImage}
            alt="Captured"
            className="rounded"
            style={{ width: "170px", height: "auto", margin: "10px 0px" }}
          />
          <button onClick={toggleImageFullScreen} className="full-screen-button">
            {isImageFullScreen ? (
              "Exit Full Screen"
            ) : (
              <FontAwesomeIcon icon={faExpand} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CaptureFrame;
