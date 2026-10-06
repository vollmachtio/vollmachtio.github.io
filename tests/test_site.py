"""Structural regressions and negative tests for the local preview server."""

from collections import Counter
from html.parser import HTMLParser
from http.client import HTTPConnection
from http.server import ThreadingHTTPServer
from pathlib import Path
import sys
from threading import Thread
import unittest

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "dist"
sys.path.insert(0, str(REPO / "scripts"))
from preview import ASSETS, PreviewHandler


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.elements = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))


class SiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "index.html").read_text()
        cls.elements = Document(cls.html).elements

    def test_accessibility_landmarks(self):
        counts = Counter(tag for tag, _ in self.elements)
        self.assertEqual(counts["main"], 1)
        self.assertEqual(counts["h1"], 1)
        self.assertIn(("html", {"lang": "en"}), self.elements)
        for tag, attrs in self.elements:
            if tag == "img":
                self.assertIn("alt", attrs)

    def test_generated_asset_inventory(self):
        generated = {str(path.relative_to(ROOT)) for path in ROOT.rglob("*") if path.is_file()}
        self.assertEqual(generated, {filename for filename, _ in ASSETS.values()})

    def test_all_pages_have_landmarks_and_no_active_content(self):
        for filename, content_type in set(ASSETS.values()):
            if not content_type.startswith("text/html"):
                continue
            with self.subTest(filename=filename):
                elements = Document((ROOT / filename).read_text()).elements
                counts = Counter(tag for tag, _ in elements)
                self.assertEqual(counts["main"], 1)
                self.assertEqual(counts["h1"], 1)
                ids = [attrs["id"] for _, attrs in elements if "id" in attrs]
                self.assertEqual(len(ids), len(set(ids)))
                for tag, attrs in elements:
                    self.assertNotIn(tag, {"script", "iframe", "form", "object", "embed"})
                    self.assertFalse(any(key.startswith("on") for key in attrs))
                self.assertTrue(any(tag == "html" and attrs.get("lang") == "en" for tag, attrs in elements))

    def test_local_links_and_unique_ids(self):
        ids = [attrs["id"] for _, attrs in self.elements if "id" in attrs]
        self.assertEqual(len(ids), len(set(ids)))
        for tag, attrs in self.elements:
            href = attrs.get("href", "")
            if href.startswith("#") and href != "#":
                self.assertIn(href[1:], ids)
            if tag == "a" and not href.startswith("#"):
                self.assertTrue(href in ASSETS or href in {"https://github.com/vollmachtio", "https://github.com/vollmachtio/vollmacht"})

    def test_no_active_or_third_party_content(self):
        forbidden = {"script", "iframe", "form", "object", "embed", "base"}
        for tag, attrs in self.elements:
            self.assertNotIn(tag, forbidden)
            if tag == "input":
                self.assertEqual(attrs.get("id"), "pause-stars")
                self.assertEqual(attrs.get("type"), "checkbox")
                self.assertNotIn("name", attrs)
                self.assertNotIn("form", attrs)
            self.assertFalse(any(key.startswith("on") for key in attrs))
            for key in ("src", "href"):
                if key in attrs and tag in {"img", "link"}:
                    route = "/" + attrs[key].lstrip("/")
                    self.assertIn(route, ASSETS)
                    self.assertTrue((ROOT / ASSETS[route][0]).is_file())
        css = (ROOT / "style.css").read_text().lower()
        self.assertNotIn("@import", css)
        self.assertNotIn("url(", css)

    def test_illustrative_and_security_disclosures(self):
        for phrase in ("Illustrative workflow", "No purchase or approval is performed", "Illustrative integrations in the target design", "User verification is not proof of humanity", "sole control for production-critical operations", "Your policy defines when fresh approval is required"):
            self.assertIn(phrase, self.html)

    def test_vision_roles_and_adoption_boundaries(self):
        for route in ("index.html", "architecture/index.html"):
            html = (ROOT / route).read_text()
            for phrase in ("01 / Human", "02 / Agent", "03 / Verifying service", "Target architecture", "Available today"):
                self.assertIn(phrase, html)
        architecture = (ROOT / "architecture/index.html").read_text()
        for phrase in ("Native service integration", "Vollmacht gateway", "not claims of support", "cannot simply be spent twice", "Payment approval alone"):
            self.assertIn(phrase, architecture)


class PreviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), PreviewHandler)
        cls.thread = Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def request(self, path, method="GET"):
        connection = HTTPConnection(*self.server.server_address, timeout=3)
        try:
            connection.request(method, path)
            response = connection.getresponse()
            return response.status, dict(response.getheaders()), response.read()
        finally:
            connection.close()

    def test_only_site_assets_are_served(self):
        for route, (filename, content_type) in ASSETS.items():
            with self.subTest(route=route):
                status, headers, body = self.request(route)
                self.assertEqual(status, 200)
                self.assertEqual(body, (ROOT / filename).read_bytes())
                self.assertEqual(headers["Content-Type"], content_type)
                self.assertEqual(headers["X-Content-Type-Options"], "nosniff")
                self.assertIn("default-src 'none'", headers["Content-Security-Policy"])

    def test_private_files_and_traversal_are_not_served(self):
        for path in ("/.git/config", "/README.md", "/scripts/preview.py", "/../index.html", "/%2e%2e/index.html", "/brand.png/", "/missing", "/.github/workflows/check.yml"):
            with self.subTest(path=path):
                self.assertEqual(self.request(path)[0], 404)

    def test_head_and_query(self):
        status, headers, body = self.request("/index.html?preview=1", "HEAD")
        self.assertEqual(status, 200)
        self.assertEqual(body, b"")
        self.assertEqual(int(headers["Content-Length"]), (ROOT / "index.html").stat().st_size)

    def test_post_is_rejected(self):
        self.assertEqual(self.request("/", "POST")[0], 501)


if __name__ == "__main__":
    unittest.main()
