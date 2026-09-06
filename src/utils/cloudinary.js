/**
 * Cloudinary Image Service Integration for MADAN Conqueror Portal
 * Cloud Name: ntnojoha
 * API Key: 264668588968844
 */

export const CLOUDINARY_CONFIG = {
  cloudName: 'ntnojoha',
  apiKey: '264668588968844',
  apiSecret: 'AP2u45ZFke4YCDA2T6d03GoY7TA',
  uploadEndpoint: 'https://api.cloudinary.com/v1_1/ntnojoha/image/upload'
};

/**
 * Generate SHA-1 Hex signature for Cloudinary API
 * Uses standard browser WebCrypto API (window.crypto.subtle)
 */
async function generateSha1Signature(str) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Pure JavaScript SHA-1 implementation fallback
  return sha1PureJs(str);
}

function sha1PureJs(str) {
  const utf8 = unescape(encodeURIComponent(str));
  const words = [];
  for (let i = 0; i < utf8.length; i++) {
    words[i >> 2] |= (utf8.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  const strBitLen = utf8.length * 8;
  words[strBitLen >> 5] |= 0x80 << (24 - (strBitLen % 32));
  words[(((strBitLen + 64) >> 9) << 4) + 15] = strBitLen;

  let H0 = 0x67452301, H1 = 0xefcdab89, H2 = 0x98badcfe, H3 = 0x10325476, H4 = 0xc3d2e1f0;
  const w = new Array(80);

  for (let i = 0; i < words.length; i += 16) {
    let a = H0, b = H1, c = H2, d = H3, e = H4;
    for (let t = 0; t < 80; t++) {
      if (t < 16) {
        w[t] = words[i + t] | 0;
      } else {
        const temp = w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16];
        w[t] = (temp << 1) | (temp >>> 31);
      }
      let f, k;
      if (t < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (t < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (t < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[t]) | 0;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp;
    }
    H0 = (H0 + a) | 0;
    H1 = (H1 + b) | 0;
    H2 = (H2 + c) | 0;
    H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0;
  }
  const toHex = (n) => ((n >>> 0) + 0x100000000).toString(16).slice(1);
  return toHex(H0) + toHex(H1) + toHex(H2) + toHex(H3) + toHex(H4);
}

/**
 * Upload an image (File, Blob, or base64 Data URI) to Cloudinary
 * @param {File|Blob|string} file - The file object or base64 data string
 * @param {Object} options - Upload options (folder, tags, etc.)
 * @returns {Promise<{success: boolean, url: string, secure_url?: string, publicId?: string, error?: string}>}
 */
export async function uploadToCloudinary(file, options = {}) {
  const folder = options.folder || 'madan_clan_logos';
  const timestamp = Math.floor(Date.now() / 1000);

  try {
    // 1. Build sorted parameters string for SHA-1 signing
    const params = {
      folder,
      timestamp
    };

    const sortedKeys = Object.keys(params).sort();
    const stringToSign = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + CLOUDINARY_CONFIG.apiSecret;
    const signature = await generateSha1Signature(stringToSign);

    // 2. Prepare FormData payload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    if (signature) {
      formData.append('signature', signature);
    }

    // 3. Dispatch to Cloudinary REST API
    const response = await fetch(CLOUDINARY_CONFIG.uploadEndpoint, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok && data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        secure_url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes
      };
    } else {
      console.warn('Cloudinary upload error response:', data);
      return {
        success: false,
        error: data.error?.message || 'Cloudinary upload failed',
        // Fallback to file/base64 if string
        url: typeof file === 'string' ? file : ''
      };
    }
  } catch (error) {
    console.error('Cloudinary upload network error:', error);
    return {
      success: false,
      error: error.message || 'Network error during Cloudinary upload',
      url: typeof file === 'string' ? file : ''
    };
  }
}

/**
 * Generate optimized Cloudinary image transformation URL
 */
export function getOptimizedImageUrl(publicIdOrUrl, options = { width: 300, quality: 'auto' }) {
  if (!publicIdOrUrl) return '';
  if (publicIdOrUrl.includes('res.cloudinary.com')) {
    const w = options.width ? `w_${options.width},` : '';
    const q = options.quality ? `q_${options.quality},` : 'q_auto,';
    const f = 'f_auto';
    return publicIdOrUrl.replace('/image/upload/', `/image/upload/${w}${q}${f}/`);
  }
  return publicIdOrUrl;
}
