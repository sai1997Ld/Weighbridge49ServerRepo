import { useState, useEffect, useRef } from "react";

const ScannerDisplay = ({ setScannedDataArray, isEwayBill }) => {
  const [scannedData, setScannedData] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    let inputBuffer = "";
    let scanTimeout;
    let lastKeyPressTime = Date.now();

    const handleKeyPress = (event) => {
      const key = event.key;
      const currentTime = Date.now();

      // Check if the time between key presses is very short (typical of a scanner)
      if (currentTime - lastKeyPressTime < 100) {
        if (key !== "Enter") {
          inputBuffer += key;
        }
        clearTimeout(scanTimeout);

        scanTimeout = setTimeout(() => {
          if (inputBuffer !== "") {
            const newScannedData = inputBuffer;
            const newScannedDataArray = newScannedData.split("|");
            console.log({ newScannedDataArray });
            setScannedData(newScannedData);
            setScannedDataArray(newScannedDataArray);
            inputBuffer = "";
          }
        }, 200);
      } else {
        // Reset buffer if it's not a rapid key press (likely manual input)
        if (key !== "Enter") {
          inputBuffer = key;
        }
      }

      lastKeyPressTime = currentTime;
    };

    const handleInputChange = (event) => {
      const value = event.target.value;
      console.log({ value, isEwayBill });
      let newScannedDataArray;
      if (isEwayBill) {
        console.log("called if");
        newScannedDataArray = value;
      } else {
        console.log("called else");
        newScannedDataArray = value.split("|");
      }
      setScannedData(value);
      setScannedDataArray(newScannedDataArray);
      event.target.value = ""; // Clear the input after handling the value
    };

    inputRef.current.focus(); // Focus the input on component mount

    window.addEventListener("keypress", handleKeyPress);
    inputRef.current.addEventListener("input", handleInputChange);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      if (inputRef.current) {
        inputRef.current.removeEventListener("input", handleInputChange);
      }
      clearTimeout(scanTimeout);
    };
  }, [setScannedDataArray]);

  return (
    <div>
      {/* <h2>QR Code Scanner</h2> */}
      <input
        ref={inputRef}
        type="text"
        style={{ opacity: 0, position: "absolute" }}
      />
      {/* <p>Scanning...</p> */}
      {/* {scannedData && (
        <div>
          <h2>Scanned Data:</h2>
          <p>{scannedData}</p>
        </div>
      )} */}
    </div>
  );
};

export default ScannerDisplay;
