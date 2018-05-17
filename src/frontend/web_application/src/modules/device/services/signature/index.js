import base64 from 'base64-js';
import hash from 'object-hash';
import { getKeypair, sign } from '../ecdsa';
import { buildURL } from '../../../../services/url';

const buildMessage = ({ url, params }) => {
  const message = buildURL(url, params);

  return hash.sha1(message);
};

export const signRequest = (messageParts, priv) => {
  const message = buildMessage(messageParts);

  return base64.fromByteArray(sign(getKeypair(priv), message).toDER());
};
