export const tools = [
  { name: "JSON to YAML", path: "/json-to-yaml" },
  { name: "YAML to JSON", path: "/yaml-to-json" },
  { name: "JSON Format", path: "/json-format" },
  { name: "CSV to JSON", path: "/csv-to-json" },
  { name: "JSON to CSV", path: "/json-to-csv" },
  { name: "URL Encode/Decode", path: "/url-encode-decode" },
  { name: "Text Diff Checker", path: "/text-diff" },
  { name: "Lorem Ipsum Generator", path: "/lorem-ipsum" },
  { name: "Markdown Preview", path: "/markdown-preview" },
  { name: "JavaScript Sandbox", path: "/js-sandbox" },
  { name: "Escape/Unescape Newlines", path: "/escape-newlines" },
  { name: "Base64 Encode/Decode", path: "/base64-encode-decode" },
  { name: "JWT Debugger", path: "/jwt-debugger" },
] as const;

export const testData = {
  validJson: `{
  "name": "Test User",
  "age": 25,
  "active": true
}`,

  invalidJson: `{
  "name": "Test User",
  "age": 25
  missing: comma
}`,

  validYaml: `name: Test User
age: 25
active: true`,

  invalidYaml: `name: Test User
  age: [25
  broken`,

  validCsv: `name,age,city
John,30,New York
Jane,25,Los Angeles`,

  validJsonArray: `[
  {"name": "John", "age": 30},
  {"name": "Jane", "age": 25}
]`,

  urlToEncode: "Hello World! How are you?",
  encodedUrl: "Hello%20World!%20How%20are%20you%3F",

  markdownSample: `# Hello World

This is a **bold** text and *italic* text.

- Item 1
- Item 2`,

  jsSample: `console.log("Hello from sandbox!");
const sum = (a, b) => a + b;
console.log(sum(2, 3));`,

  diffOriginal: `Line 1
Line 2
Line 3`,

  diffModified: `Line 1
Line 2 Modified
Line 3
Line 4`,

  textToEscape: `Hello World!
This is a multi-line string.
It has three distinct lines.`,

  escapedText: `Hello World!\\nThis is a multi-line string.\\nIt has three distinct lines.`,

  base64TextToEncode: "Hello World! This is a test.",
  base64EncodedText: "SGVsbG8gV29ybGQhIFRoaXMgaXMgYSB0ZXN0Lg==",

  jwtValid:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  jwtSecret: "your-256-bit-secret",
  jwtInvalid: "not.a.valid.jwt",
  jwtDecodedHeader: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
  jwtDecodedPayload:
    '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',

  jwtHS256:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.drDhO00ywU1JZtnkHkIkI0Dni1d3HZ1mtPTf3PLfyeY",
  jwtHS256Secret: "your-256-bit-secret",

  jwtHS384:
    "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.PHKzGEVgQ4w0pcyaMafMtW9VTvEF5QKjZ-aZP-oJfYAU3lZ4niQULPXee94tTaaE",
  jwtHS384Secret: "your-384-bit-secret-which-is-longer",

  jwtHS512:
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.t5yFspCzSOEcl7YRsaaBbdvcq4bWp5mzawOwwX_WFT3Ypz2OJYhryoTCkLrnAvorZPqraQxVZx_WmPOJ6Rme7Q",
  jwtHS512Secret: "your-512-bit-secret-which-is-even-longer-than-before",

  jwtRS256:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.mRQc5vs8jY3X1P5IooLPZ-838OdogXeVrvaX4SoNR7a4M_sGbwkCOVNEYlEfVdE-CeGcQWsgf6-1rUlDFY6KrmAkf9yNQBDEFH76q8EQR48Nm1mjdJuaDZqKolwLR38kw6uEVOLTdgmNfkxFxRWXoR2Q8UaPH86c0zU0bprlofIZvf4gGT8m3tSVNzQUoHhCbYs31vKBCWhi5EQ6BRL1JKsdrgeXKTGQI3wjgASDaYOn4dMsLgXn0kkytjpK5W54T5xYRSgjoO97DsTALWKGf6dAAssmlmksKR3RKS9nPE4f5eKk4eIWLhv_aG_i6BClCgA82urGJMIlmKdmhL8vZw",
  jwtRS256PublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz2WjgV0qeEJmNmnpjuia
A7N2qVjBteGWFyhVZg9UuUXAhuq5h8ADTBp8xegi8Sa0iv2NCahTfaD5KUVQq/2k
EyiImlKeagJFIdzN+hR+TmlT+dNtnQ37vZwHa9cThYMBkdMdkLoa9TYwPtr2SPEZ
zgxXJNkpDSRPLXwiGBCFCbl19IfDyxAE8ENNOlWya8oUFsPs4yumpixAgLUbTSRP
XSWu3t3SUtWdituwYV8uTyydebLEamWiyOeApTBlIAHEPLhjVgk6w6/K2hCBiWoV
wm2u0ZTKtrhIUvol2hKIP2Wokf+h9PhbOxH4UOR4AZWWrWLGQfOikjEHQCMt03AB
QQIDAQAB
-----END PUBLIC KEY-----`,

  jwtRS384:
    "eyJhbGciOiJSUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.m_1RXn8W7tUqNPpWgFvh3l_taquMy14tpxyr3bbM9E7HuPdD_JTvBelw4s32a1WYB0mgctBlrxD1HN7XHroDvEZxgKLYGHOanAM1-fQBC_sZECKkv_FmCfPwIY7_ObrxiIqALFEhz_oifvREUnvI1yK8_Jym0YpU0GafmYWwixmkJK0vbuX0AZw-Qqcba0apWhzILPoQbf3A89R-uFQDEGVX_QKYyD_BCmIuErdlVmlL1jtddkECQtcSkXTjqAMA98Kn8-muLOqIZxLESwis9zM7SA0JRfZ32S-K8zgbDzQgQYU-3396Z9BcfJN-eIEuazVDr4YCYiISUczF8ziCFg",
  jwtRS384PublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1+0fzwiwMaliWEwDTPH6
BLyTlAgLfIr75gEkY4iovBMsM4XYTq0uOPkPxWr0M9LNoVzNLUx9WtaUuxMcuuRG
R9Il4ONYItXVP8MeZhEwsSxdi3XLzx9mig/pjmsxsX6EarFQZzNp23i3jg/FhQYN
lKBNKxfZkHNGF/hV9qv/BJBZlBDSJyLfCO29lanSLyxMvg0LQfpe6rue+CL3aTSs
sNjGoMlnzLMr5rUG5rUteCmykpxT8iRZ0PILqesYf1aqDFyFGz0+Kcer1bLLHWin
VGsC7SBgDfdYAKSaEj1shbGixYX/FxJlNdjKtmJc+pZ2Lsm6bo5yCU6cx73fH5VC
AQIDAQAB
-----END PUBLIC KEY-----`,

  jwtRS512:
    "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SC2wvQrguRZ3gj-yCwF1YlKA7khG4n7w9ANbvLpdoHllhFpH9dnu6Z652n7GWB2s3P3ifR8XCzmwbwLsKZQMckzrMd89KMhMIXl18h7fkV3vHdditC5N9lZbWUvhd4ka0E5VWhREKCNzxYrflBbc0kwQBF_S1PkAKUJIkNiwq3DRZv3YVssljOJn-lkEQ2SZYG70goZG4nb1vDyb8h4GASdbelYyQWHibAC_d4tvvFe-JhnAenEbIy8teYTu1T2xu-P3WBsTXnHL5gnHdqVlvRb0eG1Dk8fwCNdrpzmFp6y2ckPcX3L2sKRhbXF-mEjbTnL9cGj0_OW0KauZ2giT5w",
  jwtRS512PublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApNVtyest3IyBF1RS2xbL
4HsuZN8i2IPyHwSzfS3LBrwV5oZDt6uiyol3R1OmB6D4WHxR/1f6lsgMOZqbU5Py
PAiIyE+g/ElkFzankw5ozhawz0UBgF+JQFgEfPDQQ+rI8yft5tNI2qGKka3XFyIn
k9rqNjT9gtM2e2G4ZGz50DK00k78wK18ewGXyYB7rbf4PFZfgjMFDccPxFHjcW2X
tAeKDXXUSWFlrowW+g5bsqh0GzXdI3rfdKAZH78JAi1hYIwpLSrSPDuL3qmN2gQ6
ZG7i/5wjCFaeLyJPmkFERDrIEShE/bcTfBa7pN/ojV+8TJSg6TTMFw5AcUQKCucC
jwIDAQAB
-----END PUBLIC KEY-----`,

  jwtMalformedBase64:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.INVALID!@#$BASE64.signature",
};
