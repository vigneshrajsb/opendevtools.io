"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode, CheckCircle2, XCircle, AlertCircle, Shield } from "lucide-react";

const ALGORITHMS = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

const HASH_ALGORITHMS: Record<Algorithm, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
  RS256: "SHA-256",
  RS384: "SHA-384",
  RS512: "SHA-512",
};

const EXAMPLE_DATA: Record<Algorithm, { jwt: string; secret: string }> = {
  HS256: {
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    secret: "your-256-bit-secret",
  },
  HS384: {
    jwt: "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.PHKzGEVgQ4w0pcyaMafMtW9VTvEF5QKjZ-aZP-oJfYAU3lZ4niQULPXee94tTaaE",
    secret: "your-384-bit-secret-which-is-longer",
  },
  HS512: {
    jwt: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.t5yFspCzSOEcl7YRsaaBbdvcq4bWp5mzawOwwX_WFT3Ypz2OJYhryoTCkLrnAvorZPqraQxVZx_WmPOJ6Rme7Q",
    secret: "your-512-bit-secret-which-is-even-longer-than-before",
  },
  RS256: {
    jwt: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.mRQc5vs8jY3X1P5IooLPZ-838OdogXeVrvaX4SoNR7a4M_sGbwkCOVNEYlEfVdE-CeGcQWsgf6-1rUlDFY6KrmAkf9yNQBDEFH76q8EQR48Nm1mjdJuaDZqKolwLR38kw6uEVOLTdgmNfkxFxRWXoR2Q8UaPH86c0zU0bprlofIZvf4gGT8m3tSVNzQUoHhCbYs31vKBCWhi5EQ6BRL1JKsdrgeXKTGQI3wjgASDaYOn4dMsLgXn0kkytjpK5W54T5xYRSgjoO97DsTALWKGf6dAAssmlmksKR3RKS9nPE4f5eKk4eIWLhv_aG_i6BClCgA82urGJMIlmKdmhL8vZw",
    secret: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz2WjgV0qeEJmNmnpjuia
A7N2qVjBteGWFyhVZg9UuUXAhuq5h8ADTBp8xegi8Sa0iv2NCahTfaD5KUVQq/2k
EyiImlKeagJFIdzN+hR+TmlT+dNtnQ37vZwHa9cThYMBkdMdkLoa9TYwPtr2SPEZ
zgxXJNkpDSRPLXwiGBCFCbl19IfDyxAE8ENNOlWya8oUFsPs4yumpixAgLUbTSRP
XSWu3t3SUtWdituwYV8uTyydebLEamWiyOeApTBlIAHEPLhjVgk6w6/K2hCBiWoV
wm2u0ZTKtrhIUvol2hKIP2Wokf+h9PhbOxH4UOR4AZWWrWLGQfOikjEHQCMt03AB
QQIDAQAB
-----END PUBLIC KEY-----`,
  },
  RS384: {
    jwt: "eyJhbGciOiJSUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.m_1RXn8W7tUqNPpWgFvh3l_taquMy14tpxyr3bbM9E7HuPdD_JTvBelw4s32a1WYB0mgctBlrxD1HN7XHroDvEZxgKLYGHOanAM1-fQBC_sZECKkv_FmCfPwIY7_ObrxiIqALFEhz_oifvREUnvI1yK8_Jym0YpU0GafmYWwixmkJK0vbuX0AZw-Qqcba0apWhzILPoQbf3A89R-uFQDEGVX_QKYyD_BCmIuErdlVmlL1jtddkECQtcSkXTjqAMA98Kn8-muLOqIZxLESwis9zM7SA0JRfZ32S-K8zgbDzQgQYU-3396Z9BcfJN-eIEuazVDr4YCYiISUczF8ziCFg",
    secret: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1+0fzwiwMaliWEwDTPH6
BLyTlAgLfIr75gEkY4iovBMsM4XYTq0uOPkPxWr0M9LNoVzNLUx9WtaUuxMcuuRG
R9Il4ONYItXVP8MeZhEwsSxdi3XLzx9mig/pjmsxsX6EarFQZzNp23i3jg/FhQYN
lKBNKxfZkHNGF/hV9qv/BJBZlBDSJyLfCO29lanSLyxMvg0LQfpe6rue+CL3aTSs
sNjGoMlnzLMr5rUG5rUteCmykpxT8iRZ0PILqesYf1aqDFyFGz0+Kcer1bLLHWin
VGsC7SBgDfdYAKSaEj1shbGixYX/FxJlNdjKtmJc+pZ2Lsm6bo5yCU6cx73fH5VC
AQIDAQAB
-----END PUBLIC KEY-----`,
  },
  RS512: {
    jwt: "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SC2wvQrguRZ3gj-yCwF1YlKA7khG4n7w9ANbvLpdoHllhFpH9dnu6Z652n7GWB2s3P3ifR8XCzmwbwLsKZQMckzrMd89KMhMIXl18h7fkV3vHdditC5N9lZbWUvhd4ka0E5VWhREKCNzxYrflBbc0kwQBF_S1PkAKUJIkNiwq3DRZv3YVssljOJn-lkEQ2SZYG70goZG4nb1vDyb8h4GASdbelYyQWHibAC_d4tvvFe-JhnAenEbIy8teYTu1T2xu-P3WBsTXnHL5gnHdqVlvRb0eG1Dk8fwCNdrpzmFp6y2ckPcX3L2sKRhbXF-mEjbTnL9cGj0_OW0KauZ2giT5w",
    secret: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApNVtyest3IyBF1RS2xbL
4HsuZN8i2IPyHwSzfS3LBrwV5oZDt6uiyol3R1OmB6D4WHxR/1f6lsgMOZqbU5Py
PAiIyE+g/ElkFzankw5ozhawz0UBgF+JQFgEfPDQQ+rI8yft5tNI2qGKka3XFyIn
k9rqNjT9gtM2e2G4ZGz50DK00k78wK18ewGXyYB7rbf4PFZfgjMFDccPxFHjcW2X
tAeKDXXUSWFlrowW+g5bsqh0GzXdI3rfdKAZH78JAi1hYIwpLSrSPDuL3qmN2gQ6
ZG7i/5wjCFaeLyJPmkFERDrIEShE/bcTfBa7pN/ojV+8TJSg6TTMFw5AcUQKCucC
jwIDAQAB
-----END PUBLIC KEY-----`,
  },
};

function base64UrlToBase64(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return base64 + "==".slice(0, (4 - (base64.length % 4)) % 4);
}

function base64UrlDecode(str: string): string {
  return atob(base64UrlToBase64(str));
}

function binaryStringToArrayBuffer(binary: string): ArrayBuffer {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function base64UrlToArrayBuffer(str: string): ArrayBuffer {
  return binaryStringToArrayBuffer(atob(base64UrlToBase64(str)));
}

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format: must have 3 parts separated by dots");
  }

  const [headerB64, payloadB64, signature] = parts;

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;

  try {
    header = JSON.parse(base64UrlDecode(headerB64));
  } catch {
    throw new Error("Invalid JWT header: not valid Base64URL or JSON");
  }

  try {
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch {
    throw new Error("Invalid JWT payload: not valid Base64URL or JSON");
  }

  return { header, payload, signature };
}

function isSecureContext(): boolean {
  return typeof crypto !== "undefined" && crypto.subtle !== undefined;
}

async function verifyHmacSignature(
  token: string,
  secret: string,
  algorithm: Algorithm
): Promise<boolean> {
  if (!isSecureContext()) {
    throw new Error("Signature verification requires a secure context (HTTPS)");
  }

  const [headerB64, payloadB64, signatureB64] = token.trim().split(".");
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const keyData = new TextEncoder().encode(secret);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: HASH_ALGORITHMS[algorithm] },
    false,
    ["verify"]
  );

  const signature = base64UrlToArrayBuffer(signatureB64);
  return crypto.subtle.verify("HMAC", key, signature, data);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s/g, "");
  return binaryStringToArrayBuffer(atob(base64));
}

async function verifyRsaSignature(
  token: string,
  publicKeyPem: string,
  algorithm: Algorithm
): Promise<boolean> {
  if (!isSecureContext()) {
    throw new Error("Signature verification requires a secure context (HTTPS)");
  }

  const [headerB64, payloadB64, signatureB64] = token.trim().split(".");
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

  const keyData = pemToArrayBuffer(publicKeyPem);
  const key = await crypto.subtle.importKey(
    "spki",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: HASH_ALGORITHMS[algorithm] },
    false,
    ["verify"]
  );

  const signature = base64UrlToArrayBuffer(signatureB64);
  return crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, data);
}

type VerificationStatus = "idle" | "verifying" | "valid" | "invalid" | "error";

interface StatusDisplay {
  icon: React.ReactNode;
  text: string;
  color: string;
}

const STATUS_CONFIG: Record<Exclude<VerificationStatus, "error">, StatusDisplay> = {
  idle: { icon: null, text: "Not Verified", color: "text-muted-foreground" },
  verifying: { icon: null, text: "Verifying...", color: "text-muted-foreground" },
  valid: { icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, text: "Signature Valid", color: "text-green-500" },
  invalid: { icon: <XCircle className="h-4 w-4 text-red-500" />, text: "Signature Invalid", color: "text-red-500" },
};

function getStatusDisplay(status: VerificationStatus, errorMessage: string): StatusDisplay {
  if (status === "error") {
    return {
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      text: errorMessage || "Verification Error",
      color: "text-yellow-500",
    };
  }
  return STATUS_CONFIG[status];
}

export default function JwtDebuggerPage() {
  const { input, setInput, settings, setSetting, clear } = useToolState("/jwt-debugger");

  const algorithm = (settings.algorithm as Algorithm) || "HS256";
  const secretKey = (settings.secretKey as string) || "";

  const setAlgorithm = (value: Algorithm) => setSetting("algorithm", value);
  const setSecretKey = (value: string) => setSetting("secretKey", value);

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");
  const [verificationError, setVerificationError] = useState<string>("");

  const { header, payload, error } = useMemo(() => {
    if (!input.trim()) {
      return { header: null, payload: null, error: null };
    }
    try {
      const decoded = decodeJwt(input);
      return {
        header: decoded.header,
        payload: decoded.payload,
        error: null,
      };
    } catch (e) {
      return {
        header: null,
        payload: null,
        error: e instanceof Error ? e.message : "Failed to decode JWT",
      };
    }
  }, [input]);

  const headerJson = header ? JSON.stringify(header, null, 2) : "";
  const payloadJson = payload ? JSON.stringify(payload, null, 2) : "";

  const handleClear = () => {
    clear();
    setVerificationStatus("idle");
    setVerificationError("");
  };

  const handleVerify = useCallback(async () => {
    if (!input.trim() || !secretKey.trim()) return;

    setVerificationStatus("verifying");
    setVerificationError("");

    try {
      const isValid = algorithm.startsWith("HS")
        ? await verifyHmacSignature(input, secretKey, algorithm)
        : await verifyRsaSignature(input, secretKey, algorithm);

      setVerificationStatus(isValid ? "valid" : "invalid");
    } catch (e) {
      setVerificationStatus("error");
      setVerificationError(e instanceof Error ? e.message : "Verification failed");
    }
  }, [input, secretKey, algorithm]);

  const handleExample = () => {
    const example = EXAMPLE_DATA[algorithm];
    setInput(example.jwt);
    setSecretKey(example.secret);
  };

  const shouldVerify = Boolean(input.trim() && secretKey.trim());

  useEffect(() => {
    if (!shouldVerify) return;

    const timer = setTimeout(handleVerify, 300);
    return () => clearTimeout(timer);
  }, [shouldVerify, handleVerify]);

  const displayStatus = shouldVerify ? verificationStatus : "idle";
  const currentStatus = getStatusDisplay(displayStatus, verificationError);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">JWT Debugger</h1>
        <p className="text-sm text-muted-foreground">
          Decode and verify JSON Web Tokens
        </p>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-example"
                variant="outline"
                onClick={handleExample}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Example
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load sample JWT</TooltipContent>
          </Tooltip>

          <ClearButton onClick={handleClear} />

          <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
            <SelectTrigger className="w-[120px]" data-testid="select-algorithm">
              <SelectValue placeholder="Algorithm" />
            </SelectTrigger>
            <SelectContent>
              {ALGORITHMS.map((alg) => (
                <SelectItem key={alg} value={alg}>
                  {alg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-auto">
            <CopyButton text={headerJson} showLabel />
            <CopyButton text={payloadJson} showLabel />
          </div>
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-4 min-h-0">
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <label className="text-sm font-medium">JWT Token</label>
            <Textarea
              data-testid="tool-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JWT token here..."
              className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
                error ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/30">
            {currentStatus.icon}
            <span className={`text-sm font-medium ${currentStatus.color}`}>
              {currentStatus.text}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-0">
          <div className="flex flex-col gap-2 min-h-0">
            <label className="text-sm font-medium">Decoded Header</label>
            <Textarea
              data-testid="output-header"
              value={headerJson}
              readOnly
              placeholder="Header will appear here..."
              className="h-24 resize-none font-mono text-sm overflow-auto bg-muted/50"
            />
          </div>

          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <label className="text-sm font-medium">Decoded Payload</label>
            <Textarea
              data-testid="output-payload"
              value={payloadJson}
              readOnly
              placeholder="Payload will appear here..."
              className="h-0 flex-1 resize-none font-mono text-sm overflow-auto bg-muted/50"
            />
          </div>

          <div className="flex flex-col gap-2 p-3 rounded-md border bg-muted/30">
            <label className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Signature Verification (Optional)
            </label>
            <Textarea
              data-testid="input-secret"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder={algorithm.startsWith("HS") ? "Enter secret key..." : "Paste PEM public key..."}
              className="h-20 resize-none font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
