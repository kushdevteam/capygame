import React, { useState } from 'react';
import { useAuthStore } from '../lib/stores/useWallet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { isValidSolanaAddress, formatSolanaAddress } from '../utils/solanaValidator';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    
    // Login form state
    const [loginWallet, setLoginWallet] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Register form state
    const [registerWallet, setRegisterWallet] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginWallet || !loginPassword) {
            setError('Please fill in all fields');
            return;
        }
        
        if (!isValidSolanaAddress(loginWallet)) {
            setError('Please enter a valid Solana wallet address');
            return;
        }
        
        setLoading(true);
        setError('');
        
        const success = await login(loginWallet, loginPassword);
        if (success) {
            onClose();
            resetForms();
        } else {
            setError('Invalid wallet address or password.');
        }
        
        setLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Trim whitespace from inputs
        const trimmedWallet = registerWallet?.trim();
        const trimmedUsername = registerUsername?.trim();
        const trimmedPassword = registerPassword?.trim();
        
        if (!trimmedWallet || !trimmedUsername || !trimmedPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        
        if (trimmedPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (!isValidSolanaAddress(trimmedWallet)) {
            setError('Please enter a wallet address');
            return;
        }
        
        if (trimmedPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        setError('');
        
        const result = await register(registerWallet, registerUsername, trimmedPassword);
        if (result.success) {
            onClose();
            resetForms();
        } else {
            setError(result.error || 'Registration failed. Please try again.');
        }
        
        setLoading(false);
    };

    const resetForms = () => {
        setLoginWallet('');
        setLoginPassword('');
        setRegisterWallet('');
        setRegisterUsername('');
        setRegisterPassword('');
        setConfirmPassword('');
        setError('');
        setActiveTab('login');
    };
    

    const formatWalletAddress = (address: string) => {
        return address.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-amber-900/30 backdrop-blur-md border-amber-500/30 shadow-2xl" aria-describedby="auth-modal-description">
                <DialogHeader className="text-center pb-6">
                    <DialogTitle className="text-2xl font-bold text-white">Welcome</DialogTitle>
                    <div id="auth-modal-description" className="text-sm text-amber-200 mt-2">
                        Connect with your Solana wallet address, username, and secure password
                    </div>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
                    <TabsList className="grid w-full grid-cols-2 bg-amber-800/30 rounded-lg p-1">
                        <TabsTrigger value="login" className="rounded-md font-medium">Sign In</TabsTrigger>
                        <TabsTrigger value="register" className="rounded-md font-medium">Create Account</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="space-y-6 mt-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="loginWallet" className="text-sm font-medium text-amber-100">
                                    Wallet Address
                                </Label>
                                <Input
                                    id="loginWallet"
                                    placeholder="Enter your wallet address"
                                    value={loginWallet}
                                    onChange={(e) => setLoginWallet(formatWalletAddress(e.target.value))}
                                    className="h-12 font-mono text-sm bg-amber-900/20 border-amber-400/30 text-white placeholder:text-amber-200/60 focus:border-amber-400 focus:ring-amber-400"
                                    maxLength={44}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="loginPassword" className="text-sm font-medium text-amber-100">
                                    Password
                                </Label>
                                <Input
                                    id="loginPassword"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className="h-12 bg-amber-900/20 border-amber-400/30 text-white placeholder:text-amber-200/60 focus:border-amber-400 focus:ring-amber-400"
                                />
                            </div>
                            
                            {error && (
                                <div className="bg-red-900/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </TabsContent>
                    
                    <TabsContent value="register" className="space-y-6 mt-6">
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="registerWallet" className="text-sm font-medium text-amber-100">
                                    Wallet Address
                                </Label>
                                <Input
                                    id="registerWallet"
                                    placeholder="Enter your wallet address"
                                    value={registerWallet}
                                    onChange={(e) => setRegisterWallet(formatWalletAddress(e.target.value))}
                                    className="h-12 font-mono text-sm bg-amber-900/20 border-amber-400/30 text-white placeholder:text-amber-200/60 focus:border-amber-400 focus:ring-amber-400"
                                    maxLength={44}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerUsername" className="text-sm font-medium text-amber-100">
                                    Username
                                </Label>
                                <Input
                                    id="registerUsername"
                                    placeholder="Choose a username"
                                    value={registerUsername}
                                    onChange={(e) => setRegisterUsername(e.target.value)}
                                    className="h-12 bg-amber-900/20 border-amber-400/30 text-white placeholder:text-amber-200/60 focus:border-amber-400 focus:ring-amber-400"
                                    maxLength={20}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="registerPassword" className="text-sm font-medium text-amber-100">
                                    Password
                                </Label>
                                <Input
                                    id="registerPassword"
                                    type="password"
                                    placeholder="Enter a secure password"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    className="h-12 bg-amber-900/20 border-amber-400/30 text-white placeholder:text-amber-200/60 focus:border-amber-400 focus:ring-amber-400"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-amber-100">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-12 bg-amber-900/20 border-amber-400/30 text-white placeholder:text-amber-200/60 focus:border-amber-400 focus:ring-amber-400"
                                />
                            </div>
                            
                            {error && (
                                <div className="bg-red-900/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};