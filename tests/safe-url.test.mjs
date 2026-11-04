import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTarget, isPublicIPv4, publicDnsLookup } from '../lib/safe-url.mjs';

test('accepts canonical HTTPS hostname', () => assert.equal(validateTarget('https://example.org/path#fragment').href, 'https://example.org/path'));
for (const input of ['http://example.org', 'https://localhost/', 'https://127.0.0.1/', 'https://[::1]/', 'https://user:pass@example.com/', 'https://example.org:8443/', 'https://service.internal/', 'https://example.org@127.0.0.1/', 'https://example.org:22/']) {
  test('rejects unsafe target '+input, () => assert.throws(() => validateTarget(input)));
}
for (const ip of ['127.0.0.1', '10.1.2.3', '169.254.169.254', '172.16.0.1', '192.168.1.1', '0.0.0.0', '100.64.0.1', '198.18.0.1', '192.0.2.1', '203.0.113.5', '224.0.0.1', '255.255.255.255', '::1']) {
  test('rejects private/reserved IP '+ip, () => assert.equal(isPublicIPv4(ip), false));
}
test('accepts public IPv4', () => assert.equal(isPublicIPv4('8.8.8.8'), true));
test('rejects DNS rebinding to metadata address', async () => {
  const lookup = publicDnsLookup(async () => [{address:'169.254.169.254', family:4}]);
  const err = await new Promise(resolve => lookup('example.org', {}, e => resolve(e)));
  assert.match(err.message, /Unsafe DNS/);
});
test('returns verified public address', async () => {
  const lookup = publicDnsLookup(async () => [{address:'8.8.8.8',family:4}]);
  const value = await new Promise((resolve,reject) => lookup('example.org', {}, (e, ip, family) => e?reject(e):resolve([ip,family])));
  assert.deepEqual(value, ['8.8.8.8',4]);
});
