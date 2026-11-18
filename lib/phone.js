export function normalize(raw) {
  if (!raw) return null;
  let d = String(raw).replace(/[^\d]/g, '');
  if (d.startsWith('0092')) d = d.slice(4);
  else if (d.startsWith('92')) d = d.slice(2);
  else if (d.startsWith('0')) d = d.slice(1);
  if (!/^3\d{9}$/.test(d)) return null;
  return { e164: '+92' + d, bare: '92' + d, local: '0' + d, msisdn: d };
}
