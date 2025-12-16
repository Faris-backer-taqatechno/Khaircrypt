'use server';

import { encryptDataUtil, decryptDataUtil } from './utils/encryption';

export async function encryptAction(data: string, salt: string, secretKey: string) {
    try {
        const encrypted = encryptDataUtil(data, salt, secretKey);
        return { success: true, data: encrypted };
    } catch (error: any) {
        return { success: false, error: error.message || 'Encryption failed' };
    }
}

export async function decryptAction(base64Data: string, salt: string, secretKey: string) {
    try {
        const decrypted = decryptDataUtil(base64Data, salt, secretKey);
        return { success: true, data: decrypted };
    } catch (error: any) {
        return { success: false, error: error.message || 'Decryption failed' };
    }
}
