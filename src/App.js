import React, { useState, useEffect } from "react";
import "./App.css";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setGif(null);
  }, [video]);

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS(
      "writeFile",
      "test.mp4",
      await fetchFile(video)
    );

    const a = 5;
    const b = 0;
    // Run the FFMpeg command
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      `${a}`,
      "-ss",
      `${b}`,
      "-f",
      "gif",
      "out.gif"
    );

    // Read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGif(url);
  };

  return ready ? (
    <div className="App nes-container is-rounded is-dark">
      {video && (
        <video
          // autoPlay
          controls
          loop
          muted
          width="250"
          src={URL.createObjectURL(video)}></video>
      )}

      <label className="nes-btn">
        <span>Select your file</span>
        <input
          type="file"
          accept="video/*"
          onChange={(e) =>
            setVideo(e.target.files?.item(0))
          }
        />
      </label>

      <h3>Result</h3>

      <button
        className="nes-btn is-primary"
        onClick={convertToGif}>
        Convert
      </button>

      {gif && <img src={gif} width="250" alt="" />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
