import express from "express";
import { createReadStream, statSync } from "fs";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let lastChunkRange = null;

const port = 3050;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/video", (req, res) => {
  const filePath = `${__dirname}/public/first.mp4`;
  const stat = statSync(filePath);
  const fileSize = stat.size;

  // Extracting the range from the request header
  const range = req.headers.range;

  if (!range) {
    return res.status(416).send("Requires Range header");
  }

  const chunkSize = 10 ** 6; // 1MB chunk size
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, fileSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  lastChunkRange = { start, end };

  res.writeHead(206, headers);

  const fileStream = createReadStream(filePath, { start, end });
  fileStream.pipe(res);
});
app.get("/last-chunk", (req, res) => {
  res.json(lastChunkRange);
});

app.listen(port, () => {
  console.log("Server is running on port 3030");
});
