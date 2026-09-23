import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from '../scripts/check-external.mjs';

test('blocks non-HTTPS, credentials, ports and unapproved hosts before fetching', async () => {
  for (const url of ['http://127.0.0.1:4173', 'https://evil.example/', 'https://github.com.evil.example/', 'https://user:secret@github.com/', 'https://github.com:8443/']) {
    await assert.rejects(check(url, () => { assert.fail('Must not fetch'); }), /Unapproved/);
  }
});
test('validates redirected destinations before following', async () => {
  let calls = 0;
  await assert.rejects(check('https://github.com/vollmachtio', async () => {
    calls++;
    return new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/' } });
  }), /Unapproved/);
  assert.equal(calls, 1);
});
test('fails on non-success responses and redirect loops', async () => {
  await assert.rejects(check('https://github.com/', async () => new Response(null, { status: 404 })), /HTTP 404/);
  await assert.rejects(check('https://github.com/', async () => new Response(null, { status: 302 })), /without destination/);
  let calls = 0;
  await assert.rejects(check('https://github.com/', async () => {
    calls++;
    return new Response(null, { status: 302, headers: { location: '/' } });
  }), /Too many/);
  assert.equal(calls, 5);
});
test('accepts successful permitted destinations with bounded request options', async () => {
  await check('https://www.w3.org/TR/webauthn-3/', async (url, options) => {
    assert.equal(url.hostname, 'www.w3.org');
    assert.equal(options.redirect, 'manual');
    assert.ok(options.signal);
    return new Response(null, { status: 200 });
  });
});
