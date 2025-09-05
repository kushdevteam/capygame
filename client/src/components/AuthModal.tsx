import React, { useState } from 'react';
import { useAuthStore } from '../lib/stores/useWallet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    
    // Login form state
    const [loginWallet, setLoginWallet] = useState('');
    const [loginPin, setLoginPin] = useState('');
    
    // Register form state
    const [registerWallet, setRegisterWallet] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPin, setRegisterPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginWallet || !loginPin) {
            setError('Please fill in all fields');
            return;
        }
        
        setLoading(true);
        setError('');
        
        const success = await login(loginWallet, loginPin);
        if (success) {
            onClose();
            resetForms();
        } else {
            setError('Invalid wallet address or PIN');
        }
        
        setLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!registerWallet || !registerUsername || !registerPin) {
            setError('Please fill in all fields');
            return;
        }
        
        if (registerPin !== confirmPin) {
            setError('PINs do not match');
            return;
        }
        
        if (registerPin.length !== 4 || !/^\d+$/.test(registerPin)) {
            setError('PIN must be exactly 4 digits');
            return;
        }
        
        setLoading(true);
        setError('');
        
        const success = await register(registerWallet, registerUsername, registerPin);
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
        setLoginPin('');
        setRegisterWallet('');
        setRegisterUsername('');
        setRegisterPin('');
        setConfirmPin('');
        setError('');
        setActiveTab('login');
    };

    const formatWalletAddress = (address: string) => {
        return address.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur border-0 shadow-2xl" aria-describedby="auth-modal-description">
                <DialogHeader className="text-center pb-6">
                    <DialogTitle className="text-2xl font-bold text-gray-900">Welcome</DialogTitle>
                    <div id="auth-modal-description" className="text-sm text-gray-600 mt-2">
                        Connect with your wallet address and PIN
                    </div>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
                        <TabsTrigger value="login" className="rounded-md font-medium">Sign In</TabsTrigger>
                        <TabsTrigger value="register" className="rounded-md font-medium">Create Account</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="space-y-6 mt-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="loginWallet" className="text-sm font-medium text-gray-700">
                                    Wallet Address
                                </Label>
                                <Input
                                    id="loginWallet"
                                    placeholder="Enter your wallet address"
                                    value={loginWallet}
                                    onChange={(e) => setLoginWallet(formatWalletAddress(e.target.value))}
                                    className="h-12 font-mono text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    maxLength={44}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="loginPin" className="text-sm font-medium text-gray-700">
                                    4-Digit PIN
                                </Label>
                                <Input
                                    id="loginPin"
                                    type="password"
                                    placeholder="••••"
                                    value={loginPin}
                                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    className="h-12 font-mono text-center text-lg tracking-widest border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    maxLength={4}
                                />
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </TabsContent>
                    
                    <TabsContent value="register" className="space-y-6 mt-6">
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="registerWallet" className="text-sm font-medium text-gray-700">
                                    Wallet Address
                                </Label>
                                <Input
                                    id="registerWallet"
                                    placeholder="Enter your wallet address"
                                    value={registerWallet}
                                    onChange={(e) => setRegisterWallet(formatWalletAddress(e.target.value))}
                                    className="h-12 font-mono text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    maxLength={44}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerUsername" className="text-sm font-medium text-gray-700">
                                    Username
                                </Label>
                                <Input
                                    id="registerUsername"
                                    placeholder="Choose a username"
                                    value={registerUsername}
                                    onChange={(e) => setRegisterUsername(e.target.value)}
                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    maxLength={20}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="registerPin" className="text-sm font-medium text-gray-700">
                                        4-Digit PIN
                                    </Label>
                                    <Input
                                        id="registerPin"
                                        type="password"
                                        placeholder="••••"
                                        value={registerPin}
                                        onChange={(e) => setRegisterPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        className="h-12 font-mono text-center text-lg tracking-widest border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        maxLength={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPin" className="text-sm font-medium text-gray-700">
                                        Confirm PIN
                                    </Label>
                                    <Input
                                        id="confirmPin"
                                        type="password"
                                        placeholder="••••"
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        className="h-12 font-mono text-center text-lg tracking-widest border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        maxLength={4}
                                    />
                                </div>
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
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