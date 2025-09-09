import { create } from 'zustand';

interface User {
    walletAddress: string;
    username: string;
    seedPhrase: string;
}

interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    login: (walletAddress: string, seedPhrase: string) => Promise<boolean>;
    register: (walletAddress: string, username: string, seedPhrase: string) => Promise<{success: boolean; error?: string}>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoggedIn: false,
    
    login: async (walletAddress: string, seedPhrase: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress, seedPhrase })
            });
            
            if (response.ok) {
                const userData = await response.json();
                set({ user: userData.user, isLoggedIn: true });
                localStorage.setItem('user_session', JSON.stringify(userData.user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },
    
    register: async (walletAddress: string, username: string, seedPhrase: string) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress, username, seedPhrase })
            });
            
            if (response.ok) {
                const userData = await response.json();
                set({ user: userData.user, isLoggedIn: true });
                localStorage.setItem('user_session', JSON.stringify(userData.user));
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    },
    
    logout: () => {
        set({ user: null, isLoggedIn: false });
        localStorage.removeItem('user_session');
    },
    
    setUser: (user: User | null) => {
        set({ user, isLoggedIn: !!user });
        if (user) {
            localStorage.setItem('user_session', JSON.stringify(user));
        } else {
            localStorage.removeItem('user_session');
        }
    }
}));

// Initialize from localStorage on app start
if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            useAuthStore.getState().setUser(user);
        } catch (error) {
            localStorage.removeItem('user_session');
        }
    }
}
