import React, { useState } from 'react';
import { useAuthStore } from '../lib/stores/useWallet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { generateSeedPhrase, validateSeedPhrase, formatSeedPhrase } from '../utils/seedPhraseGenerator';
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
    const [loginSeedPhrase, setLoginSeedPhrase] = useState('');
    
    // Register form state
    const [registerWallet, setRegisterWallet] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [generatedSeedPhrase, setGeneratedSeedPhrase] = useState('');
    const [confirmSeedPhrase, setConfirmSeedPhrase] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginWallet || !loginSeedPhrase) {
            setError('Please fill in all fields');
            return;
        }
        
        if (!isValidSolanaAddress(loginWallet)) {
            setError('Please enter a valid Solana wallet address');
            return;
        }
        
        if (!validateSeedPhrase(loginSeedPhrase)) {
            setError('Please enter a valid 4-word seed phrase');
            return;
        }
        
        setLoading(true);
        setError('');
        
        const success = await login(loginWallet, formatSeedPhrase(loginSeedPhrase));
        if (success) {
            onClose();
            resetForms();
        } else {
            setError('Invalid wallet address or seed phrase');
        }
        
        setLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!registerWallet || !registerUsername || !generatedSeedPhrase || !confirmSeedPhrase) {
            setError('Please fill in all fields');
            return;
        }
        
        if (!isValidSolanaAddress(registerWallet)) {
            setError('Please enter a valid Solana wallet address');
            return;
        }
        
        if (formatSeedPhrase(generatedSeedPhrase) !== formatSeedPhrase(confirmSeedPhrase)) {
            setError('Seed phrases do not match');
            return;
        }
        
        if (!validateSeedPhrase(generatedSeedPhrase)) {
            setError('Generated seed phrase is invalid');
            return;
        }
        
        setLoading(true);
        setError('');
        
        const success = await register(registerWallet, registerUsername, formatSeedPhrase(generatedSeedPhrase));
        if (success) {
            onClose();
            resetForms();
        } else {
            setError('Registration failed. Wallet address may already be in use.');
        }
        
        setLoading(false);
    };

    const resetForms = () => {
        setLoginWallet('');
        setLoginSeedPhrase('');
        setRegisterWallet('');
        setRegisterUsername('');
        setGeneratedSeedPhrase('');
        setConfirmSeedPhrase('');
        setError('');
        setActiveTab('login');
    };
    
    const generateNewSeedPhrase = () => {
        const newPhrase = generateSeedPhrase();
        setGeneratedSeedPhrase(newPhrase);
        setConfirmSeedPhrase('');
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
                        Connect with your Solana wallet and 4-word seed phrase
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
                                <Label htmlFor="loginSeedPhrase" className="text-sm font-medium text-amber-100">
                                    4-Word Seed Phrase
                                </Label>
                                <Input
                                    id="loginSeedPhrase"
                                    type="password"
                                    placeholder="capybara forest golden harmony"
                                    value={loginSeedPhrase}
                                    onChange={(e) => setLoginSeedPhrase(e.target.value)}
                                    className="h-12 font-mono text-sm bg-amber-900/20 border-amber-400/30 text-white placeholder:text-amber-200/60 focus:border-amber-400 focus:ring-amber-400"
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
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="generatedSeedPhrase" className="text-sm font-medium text-amber-100">
                                        Your 4-Word Seed Phrase
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="generatedSeedPhrase"
                                            value={generatedSeedPhrase}
                                            readOnly
                                            className="h-12 font-mono text-sm bg-amber-900/40 border-amber-400/30 text-amber-100 cursor-default"
                                            placeholder="Click Generate to create your phrase"
                                        />
                                        <Button
                                            type="button"
                                            onClick={generateNewSeedPhrase}
                                            className="h-12 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                    <p className="text-xs text-amber-200/80">
                                        Save this phrase securely - you'll need it to sign in!
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmSeedPhrase" className="text-sm font-medium text-amber-100">
                                        Confirm Seed Phrase
                                    </Label>
                                    <Input
                                        id="confirmSeedPhrase"
                                        placeholder="Type your seed phrase to confirm"
                                        value={confirmSeedPhrase}
                                        onChange={(e) => setConfirmSeedPhrase(e.target.value)}
                                        className="h-12 font-mono text-sm bg-amber-900/20 border-amber-400/30 text-white placeholder:text-amber-200/60 focus:border-amber-400 focus:ring-amber-400"
                                    />
                                </div>
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