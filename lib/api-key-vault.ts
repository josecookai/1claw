const STORAGE_KEY = "oneclaw_api_keys_v1";

type KeyName = "anthropic";
type Payload = Record<KeyName, string>;

function enc(input: Uint8Array) {
  return btoa(String.fromCharCode(...input));
}

function dec(input: string) {
  return Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
}

async function deriveKey(passphrase: string, salt: Uint8Array) {
  const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt.buffer as ArrayBuffer, iterations: 100_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function saveApiKeys(passphrase: string, payload: Payload) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    new TextEncoder().encode(JSON.stringify(payload))
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      iv: enc(iv),
      salt: enc(salt),
      data: enc(new Uint8Array(encrypted)),
    })
  );
}

export async function loadApiKeys(passphrase: string): Promise<Payload> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { anthropic: "" };
  const parsed = JSON.parse(raw) as { iv: string; salt: string; data: string };
  const key = await deriveKey(passphrase, dec(parsed.salt));
  const bytes = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: dec(parsed.iv).buffer as ArrayBuffer },
    key,
    dec(parsed.data).buffer as ArrayBuffer
  );
  return JSON.parse(new TextDecoder().decode(bytes)) as Payload;
}

export function hasApiKeyVault() {
  return Boolean(localStorage.getItem(STORAGE_KEY));
}
