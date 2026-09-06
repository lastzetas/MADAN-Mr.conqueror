// Cryptographic Salt & Secure Hash for Super Admin & Match Ops Admin
const PASSWORD_SALT = 'madan_conqueror_esports_2026_salt';

export const SUPER_ADMIN_USERNAME = 'lastzetas';
export const SUPER_ADMIN_EMAIL = 'lastzetas@gmail.com';
export const SUPER_ADMIN_HASH = '00db580ce2193b15e1a5b739396182477dfac069abc15a85cd394da90415545e'; // Hackler@21

export const ADMIN_USERNAME = 'admin';
export const ADMIN_EMAIL = 'admin@madan.in';
export const ADMIN_HASH = 'ce028ff1dd39e85c4a6334d2a88bca9de49938790b38cced55a619c1ea6fc3bd'; // Admin@2026

const JWT_SECRET_SALT = 'madan_jwt_secret_key_9fc8e5d1_2026';
const TOKEN_STORAGE_KEY = 'madan_auth_jwt';

// Helper: Convert ArrayBuffer to Hex String
const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Helper: Base64Url encode/decode
const base64UrlEncode = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
};

// Cryptographic Password Hasher using Web Crypto API (SHA-256)
export const hashPassword = async (password, salt = PASSWORD_SALT) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
};

// Create Signed JWT (JSON Web Token)
export const createSignedJwt = async (payload) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadWithClaims = {
    ...payload,
    iss: 'madan-conqueror-portal',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours validity
  };
  const payloadEncoded = base64UrlEncode(JSON.stringify(payloadWithClaims));

  // Sign with secret
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const signatureHash = await hashPassword(signatureInput, JWT_SECRET_SALT);
  const signatureEncoded = base64UrlEncode(signatureHash);

  return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
};

// Verify and Decode JWT Token
export const verifyJwtToken = async (token) => {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

    // Verify signature
    const signatureInput = `${headerEncoded}.${payloadEncoded}`;
    const expectedSignatureHash = await hashPassword(signatureInput, JWT_SECRET_SALT);
    const expectedSignatureEncoded = base64UrlEncode(expectedSignatureHash);

    if (signatureEncoded !== expectedSignatureEncoded) {
      console.warn('JWT Verification Failed: Invalid Token Signature');
      return null;
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(payloadEncoded));

    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn('JWT Verification Failed: Token Expired');
      return null;
    }

    return payload;
  } catch (err) {
    console.error('JWT Token Verification Error:', err);
    return null;
  }
};

// Main Authenticate function with Secured Password Hashing & JWT Generation
export const authenticateUser = async (usernameOrEmail, password) => {
  const cleanInput = (usernameOrEmail || '').trim().toLowerCase();

  // Hash input password securely with salt
  const inputHash = await hashPassword(password);

  // 1. Super Admin Check (Accepts username 'lastzetas' or email 'lastzetas@gmail.com')
  if ((cleanInput === SUPER_ADMIN_USERNAME || cleanInput === SUPER_ADMIN_EMAIL) && inputHash === SUPER_ADMIN_HASH) {
    const userPayload = {
      sub: SUPER_ADMIN_USERNAME,
      username: 'lastzetas',
      email: SUPER_ADMIN_EMAIL,
      name: 'Last Zetas',
      role: 'SUPER_ADMIN',
      badge: 'Super Admin Level 10',
      permissions: ['ALL_ACCESS', 'ADMIN_MANAGE', 'TOURNAMENT_MANAGE', 'PAYOUT_DISPATCH', 'BROADCAST_ROOMS', 'AUDIT_LOGS']
    };

    const token = await createSignedJwt(userPayload);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }

    return {
      success: true,
      token,
      user: userPayload
    };
  }

  // 2. Match Ops Admin Check (Accepts username 'admin' or email 'admin@madan.in')
  if ((cleanInput === ADMIN_USERNAME || cleanInput === ADMIN_EMAIL || cleanInput === 'admin@madan.gg') && inputHash === ADMIN_HASH) {
    const userPayload = {
      sub: ADMIN_USERNAME,
      username: 'admin',
      email: ADMIN_EMAIL,
      name: 'Match Ops Lead',
      role: 'ADMIN',
      badge: 'Match Operations Admin',
      permissions: ['TOURNAMENT_MANAGE', 'ROSTER_WHITELIST', 'ROOM_DISPATCH']
    };

    const token = await createSignedJwt(userPayload);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }

    return {
      success: true,
      token,
      user: userPayload
    };
  }

  return {
    success: false,
    message: 'Invalid username/email or password. Please check your credentials.'
  };
};

// Get active session from stored JWT
export const getActiveSession = async () => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;

    const payload = await verifyJwtToken(token);
    if (!payload) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    }

    return {
      token,
      user: payload
    };
  } catch (err) {
    console.error('Session retrieval error:', err);
    return null;
  }
};

// Logout User
export const logoutUser = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (e) {
    console.error('Error logging out:', e);
  }
};
