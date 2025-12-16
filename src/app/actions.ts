'use server';

import { encrypt, decrypt } from './utils/encryption';

type ActionResponse = {
    success: boolean;
    data?: string;
    error?: string;
};

export async function encryptAction(text: string, companyId: string, secretKey: string): Promise<ActionResponse> {
    try {
        const encrypted = encrypt(text, companyId, secretKey);
        return { success: true, data: encrypted };
    } catch (error: any) {
        console.error('Encryption Failed:', error);
        return { success: false, error: 'Encryption failed. Check your inputs.' };
    }
}

export async function decryptAction(encryptedText: string, companyId: string, secretKey: string): Promise<ActionResponse> {
    try {
        const decrypted = decrypt(encryptedText, companyId, secretKey);
        return { success: true, data: decrypted };
    } catch (error: any) {
        console.error('Decryption Failed:', error);
        return { success: false, error: 'Decryption failed. Invalid Key, Salt, or Payload.' };
    }
}
