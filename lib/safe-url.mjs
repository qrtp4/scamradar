import { lookup as dnsLookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export function validateTarget(value) {
  if (typeof value !== 'string' || value.length > 2048) throw new Error('Invalid URL');
  let u;
  try { u = new URL(value); } catch { throw new Error('Invalid URL'); }
  if (u.protocol !== 'https:' || u.username || u.password || (u.port && u.port !== '443')) throw new Error('HTTPS only');
  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  if (!host.includes('.') || isIP(host) || /\.(?:localhost|local|internal|home\.arpa)$/i.test(host) || host === 'localhost') throw new Error('Unsafe host');
  u.hash = '';
  return u;
}

export function isPublicIPv4(address) {
  if (isIP(address) !== 4) return false;
  const [a,b,c] = address.split('.').map(Number);
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
  if (a === 100 && b >= 64 && b <= 127) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && (b === 0 || b === 168 || (b === 88 && c === 99))) return false;
  if (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) return false;
  if (a === 203 && b === 0 && c === 113) return false;
  return true;
}

export function publicDnsLookup(resolver = dnsLookup) {
  return (hostname, options, callback) => {
    Promise.resolve().then(async () => {
      if (isIP(hostname)) throw new Error('IP literals forbidden');
      const records = await resolver(hostname, {family: 4, all: true});
      if (!Array.isArray(records) || records.length === 0 || records.some(x => !isPublicIPv4(x.address) || x.family !== 4)) throw new Error('Unsafe DNS destination');
      if (options && typeof options === 'object' && options.all) callback(null, records);
      else callback(null, records[0].address, 4);
    }).catch(err => callback(err));
  };
}
