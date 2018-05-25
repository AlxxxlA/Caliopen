import base64 from 'base64-js';
import { sha1 } from 'object-hash';
import { getKeypair, sign } from '../ecdsa';
import { getConfig } from '../storage';
import { buildURL } from '../../../../services/url';
import { readAsArrayBuffer } from '../../../file/services';

const buildMessage = async ({ url, params, data }) => {
  // TODO : TextEncoder does not exist in IE/Safari
  const encoder = new TextEncoder();
  const builtURL = encoder.encode(buildURL(url, params));

  let message = builtURL.buffer;

  if (data instanceof Blob) {
    message = new Uint8Array([
      ...builtURL,
      ...await readAsArrayBuffer(data),
    ]).buffer;
  }

  if (data === Object(data)) {
    message = new Uint8Array([
      ...builtURL,
      ...encoder.encode(JSON.stringify(data)),
    ]).buffer;
  }

  return sha1(message);
};

export const signRequest = async (req, privateKey) => {
  const message = await buildMessage(req);

  return base64.fromByteArray(sign(getKeypair(privateKey), message).toDER());
};

export const getSignatureHeaders = async (req, device) => {
  const { id, priv } = device || getConfig();
  const signature = await signRequest(req, priv);

  return {
    'X-Caliopen-Device-ID': id,
    'X-Caliopen-Device-Signature': signature,
  };
};
