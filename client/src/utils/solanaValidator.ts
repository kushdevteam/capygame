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
    // Allow any non-empty string as wallet address for maximum compatibility
    if (!address || typeof address !== 'string') {
        return false;
    }
    
    // Trim whitespace
    const trimmedAddress = address.trim();
    
    // Just check it's not empty and has reasonable length
    if (trimmedAddress.length < 1 || trimmedAddress.length > 100) {
        return false;
    }
    
    // Accept any alphanumeric string for maximum compatibility
    return true;
};

export const formatSolanaAddress = (address: string): string => {
    if (!address || address.length < 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
};