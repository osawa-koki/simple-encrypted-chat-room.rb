import { encrypt, decrypt } from '../src/RC4';

const generateRandomString = (length: number): string => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

describe('RC4', () => {
  it('should encrypt and decrypt message with the same key', () => {
    for (let i = 0; i < 100; i++) {
      const message = generateRandomString(20);
      const key = generateRandomString(10);
      const encryptedMessage = encrypt(message, key);
      const decryptedMessage = decrypt(encryptedMessage, key);

      expect(decryptedMessage).toEqual(message);
    }
  });

  it('should not decrypt message with a different key', () => {
    for (let i = 0; i < 100; i++) {
      const message = generateRandomString(20);
      const key = generateRandomString(10);
      const encryptedMessage = encrypt(message, key);
      const differentKey = generateRandomString(10);
      if (differentKey === key) {
        continue;
      }
      const decryptedMessage = decrypt(encryptedMessage, differentKey);

      expect(decryptedMessage).not.toEqual(message);
    }
  });
});
