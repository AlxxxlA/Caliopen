import base64 from 'base64-js';
import hash from 'object-hash';
import { getKeypair, sign } from '../ecdsa';
import { getConfig } from '../storage';
import { buildURL } from '../../../../services/url';

const buildMessage = ({ url, params }) => {
  const message = buildURL(url, params);

  return hash.sha1(message);
};

export const signRequest = (messageParts, priv) => {
  const message = buildMessage(messageParts);

  return base64.fromByteArray(sign(getKeypair(priv), message).toDER());
};

export const getSignatureHeaders = (req, device) => {
  const { id, priv } = device || getConfig();
  const signature = signRequest(req, priv);

  return {
    'X-Caliopen-Device-ID': id,
    'X-Caliopen-Device-Signature': signature,
  };
};
