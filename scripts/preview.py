"""Loopback-only preview of an explicit public asset allowlist."""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1] / "dist"
ASSETS = {
    "/": ("index.html", "text/html; charset=utf-8"),
    "/index.html": ("index.html", "text/html; charset=utf-8"),
    "/style.css": ("style.css", "text/css; charset=utf-8"),
    "/brand.png": ("brand.png", "image/png"),
}
for page in ("concepts", "architecture", "security", "standards", "quickstart"):
    ASSETS[f"/{page}/"] = (f"{page}/index.html", "text/html; charset=utf-8")


class PreviewHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.respond(send_body=True)

    def do_HEAD(self):
        self.respond(send_body=False)

    def respond(self, send_body):
        try:
            asset = ASSETS.get(urlsplit(self.path).path)
        except ValueError:
            asset = None
        if asset is None:
            self.send_error(404)
            return
        name, content_type = asset
        try:
            data = (ROOT / name).read_bytes()
        except OSError:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Security-Policy", "default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")
        self.end_headers()
        if send_body:
            self.wfile.write(data)


if __name__ == "__main__":
    if not (ROOT / "index.html").is_file():
        raise SystemExit("Build the website first with npm run build.")
    port = int(sys.argv[1]) if len(sys.argv) == 2 else 4173
    with ThreadingHTTPServer(("127.0.0.1", port), PreviewHandler) as server:
        print(f"Website preview: http://127.0.0.1:{port}", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
