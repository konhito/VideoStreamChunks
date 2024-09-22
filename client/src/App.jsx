import { useEffect, useState } from "react";

function App() {
  const [chunkInfo, setChunkInfo] = useState(null);

  useEffect(() => {
    const fetchChunkInfo = () => {
      fetch("http://localhost:3050/last-chunk")
        .then((res) => res.json())
        .then((data) => setChunkInfo(data))
        .catch((err) => console.error(err));
    };

    const interval = setInterval(fetchChunkInfo, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 style={{ marginLeft: 300, marginBottom: 100 }}>
        Video streaming in chunks
      </h1>

      <video
        style={{ height: 500, width: 900, marginLeft: 100 }}
        controls
        src="http://localhost:3050/video"
      ></video>

      <div style={{ marginLeft: 300 }}>
        <h2>Chunk Info:</h2>
        {chunkInfo ? (
          <p>
            Streaming chunk from {chunkInfo.start} to {chunkInfo.end}
          </p>
        ) : (
          <p>No chunk information yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
