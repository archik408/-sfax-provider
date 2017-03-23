'use strict';

const crypto = require('crypto');

const CLEAR_ENCODING = 'utf8';
const CIPHER_ENCODING = 'base64'; // hex, base64
const AES_ENC_ALG = 'AES-256-CBC';

/**
 * Sfax AES cryptography service based on node.js crypto
 */
class SfaxCrypto {

    /**
     * Generate sfax security token
     *
     * @param username
     * @param apiKey
     * @param key
     * @param initVector
     * @returns {String}
     */
    static generateToken(username, apiKey, key, initVector) {
        const genDT = (new Date()).toJSON();
        const dataInput = `Username=${username}&ApiKey=${apiKey}&GenDT=${genDT}`;
        const cipher = this.encrypt(dataInput, key, initVector, AES_ENC_ALG);
        return cipher.join('');
    }

    /**
     * Encrypt via specific algorithm
     *
     * @param msg
     * @param key
     * @param initVector
     * @param algorithm
     * @param padding
     * @returns {Array}
     */
    static encrypt(msg, key, initVector, algorithm, padding) {
        const cipher = crypto.createCipheriv(algorithm, key, initVector);
        const cipherChunks = [];

        if (padding) {
            cipher.setAutoPadding(false);
            //TODO set padding
        }

        cipherChunks.push(cipher.update(msg, CLEAR_ENCODING, CIPHER_ENCODING));
        cipherChunks.push(cipher.final(CIPHER_ENCODING));

        return cipherChunks;
    }

    /**
     * Decrypt via specific algorithm
     *
     * @param cipherMsg
     * @param key
     * @param initVector
     * @param algorithm
     * @param padding
     * @returns {Array}
     */
    static decrypt(cipherMsg, key, initVector, algorithm, padding) {
        const decipher = crypto.createDecipheriv(algorithm, key, initVector);
        const plainChunks = [];

        if (padding) {
            decipher.setAutoPadding(false);
            //TODO set padding
        }

        for (let i = 0; i < cipherMsg.length; i++) {
            plainChunks.push(decipher.update(cipherMsg[i], CIPHER_ENCODING, CLEAR_ENCODING));
        }
        plainChunks.push(decipher.final(CLEAR_ENCODING));

        return plainChunks;
    }

}

module.exports = SfaxCrypto;
