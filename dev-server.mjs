// Winziger statischer Server zum Ansehen der Seite.
//
// Er beantwortet Adressen so, wie Netlify sie beantwortet -- sonst könnte man
// die Seite hier nicht anklicken, denn im HTML stehen nur endungslose
// Adressen:
//   /tasarim   -> tasarim.html
//   /de/       -> de/index.html
//   /de        -> 301 auf /de/
//   unbekannt  -> 404.html mit Status 404
//
// Und MIT HTTP-Range-Unterstützung: python3 -m http.server kann das nicht,
// dort lässt sich das Buchvideo auf der Startseite nicht durchscrubben.
//
// Was er NICHT kann: _redirects und _headers. Wer die prüfen will, nimmt
// "npx netlify dev".
//
//   node dev-server.mjs              public/ auf Port 8732
//   node dev-server.mjs public 3000  eigener Ordner, eigener Port
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

// Ausgeliefert wird, was Netlify ausliefert: der Ordner public/.
const ROOT = process.argv[2] || join(process.cwd(), "public");
const PORT = Number(process.argv[3] || 8732);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webm": "video/webm",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const statOf = (path) => {
  try {
    return statSync(path);
  } catch {
    return null;
  }
};

/* Aus der Adresse die Datei bestimmen -- in derselben Reihenfolge wie
   Netlify: erst die Datei selbst, dann mit .html, dann als Ordner. */
function resolve(urlPath) {
  const path = join(ROOT, normalize(urlPath));
  if (urlPath.endsWith("/")) {
    const index = statOf(join(path, "index.html"));
    return index?.isFile() ? { file: join(path, "index.html"), stat: index } : null;
  }
  const direct = statOf(path);
  if (direct?.isFile()) return { file: path, stat: direct };
  const asPage = statOf(path + ".html");
  if (asPage?.isFile()) return { file: path + ".html", stat: asPage };
  // Ein Ordner ohne Schrägstrich: Netlify leitet dorthin um.
  if (direct?.isDirectory()) return { redirect: urlPath + "/" };
  return null;
}

function send(res, file, stat, range, status = 200) {
  const type = TYPES[extname(file).toLowerCase()] || "application/octet-stream";
  const m = range && /bytes=(\d*)-(\d*)/.exec(range);
  if (m) {
    const start = m[1] ? parseInt(m[1], 10) : 0;
    const end = m[2] ? parseInt(m[2], 10) : stat.size - 1;
    res.writeHead(206, {
      "Content-Type": type,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
    });
    createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(status, { "Content-Type": type, "Content-Length": stat.size, "Accept-Ranges": "bytes" });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const found = resolve(urlPath);

  if (found?.redirect) {
    res.writeHead(301, { Location: found.redirect }).end();
    return;
  }
  if (found) {
    send(res, found.file, found.stat, req.headers.range);
    return;
  }
  // Unbekannte Adresse: die eigene Fehlerseite, mit dem Status, der dazugehört.
  const notFound = join(ROOT, "404.html");
  const stat = statOf(notFound);
  if (stat?.isFile()) {
    send(res, notFound, stat, null, 404);
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("404 " + urlPath);
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
