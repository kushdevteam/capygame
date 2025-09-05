import { PublicKey } from '@solana/web3.js';

export const validateSolanaWallet = (address: string): boolean => {
    try {
        // Check if it's a valid base58 Solana public key
        new PublicKey(address);
        return true;
    } catch (error) {
        return false;
    }
};

export const isValidSolanaAddress = (address: string): boolean => {
    // Basic format checks
    if (!address || typeof address !== 'string') {
        return false;
    }
    
    // Solana addresses are 32-44 characters long
    if (address.length < 32 || address.length > 44) {
        return false;
    }
    
    // Check if it contains only valid base58 characters
    const base58Regex = /^[A-HJ-NP-Z1-9]+$/;
    if (!base58Regex.test(address)) {
        return false;
    }
    
    // Use Solana's PublicKey validation
    return validateSolanaWallet(address);
};

export const formatSolanaAddress = (address: string): string => {
    if (!address || address.length < 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
};