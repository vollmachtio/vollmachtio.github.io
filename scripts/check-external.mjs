import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const hosts = new Set(['github.com', 'datatracker.ietf.org', 'www.rfc-editor.org', 'www.w3.org', 'x401.proof.com']);
async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  }));
  return nested.flat();
}
function permitted(url) {
  return url.protocol === 'https:' && hosts.has(url.hostname) && !url.username && !url.password && !url.port;
}
export async function check(original, fetcher = fetch) {
  let url = new URL(original);
  for (let hop = 0; hop < 5; hop++) {
    if (!permitted(url)) throw new Error('Unapproved external destination: ' + url.href);
    const response = await fetcher(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    await response.body?.cancel();
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) throw new Error('Redirect without destination');
      url = new URL(location, url);
      continue;
    }
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return;
  }
  throw new Error('Too many redirects');
}
export async function main() {
const links = new Set();
for (const path of await htmlFiles(root)) {
  const html = await readFile(path, 'utf8');
  for (const match of html.matchAll(/href="(https?:[^"]+)"/g)) {
    links.add(match[1].replaceAll('&amp;', '&'));
  }
}
if (links.size === 0) throw new Error('No external links found; build the website first.');
let failed = false;
for (const link of links) {
  try { await check(link); console.log('OK ' + link); }
  catch (error) { failed = true; console.error('FAIL ' + link + ': ' + error.message); }
}
if (failed) process.exitCode = 1;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
