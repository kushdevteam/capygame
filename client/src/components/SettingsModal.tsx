import React from 'react';
import { X, Volume2, VolumeX, Monitor, Zap } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [soundEnabled, setSoundEnabled] = React.useState(true);
    const [musicEnabled, setMusicEnabled] = React.useState(true);
    const [particlesEnabled, setParticlesEnabled] = React.useState(true);
    const [highQuality, setHighQuality] = React.useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-600 w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-slate-600">
                    <h2 className="text-2xl font-bold text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Audio Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Volume2 className="w-5 h-5" />
                            Audio
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-300">Sound Effects</span>
                                <button
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        soundEnabled ? 'bg-blue-600' : 'bg-slate-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            soundEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-slate-300">Background Music</span>
                                <button
                                    onClick={() => setMusicEnabled(!musicEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        musicEnabled ? 'bg-blue-600' : 'bg-slate-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            musicEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Graphics Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Monitor className="w-5 h-5" />
                            Graphics
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-300">Particle Effects</span>
                                <button
                                    onClick={() => setParticlesEnabled(!particlesEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        particlesEnabled ? 'bg-blue-600' : 'bg-slate-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            particlesEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-slate-300">High Quality Graphics</span>
                                <button
                                    onClick={() => setHighQuality(!highQuality)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        highQuality ? 'bg-blue-600' : 'bg-slate-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            highQuality ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Game Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Gameplay
                        </h3>
                        
                        <div className="text-sm text-slate-400">
                            Additional gameplay settings will be available in future updates.
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-600 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}