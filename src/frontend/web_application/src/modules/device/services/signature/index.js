import base64 from 'base64-js';
import hash from 'object-hash';
import { getKeypair, sign } from '../ecdsa';

const buildMessage = url => hash.sha1(url);

export const signRequest = (messageParts, priv) => {
  const message = buildMessage(messageParts);

  return base64.fromByteArray(sign(getKeypair(priv), message).toDER());
};
