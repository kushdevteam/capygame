import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  isPlaying?: boolean;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isPlaying = true }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Create a simple looping background track using Web Audio API
    const createAmbientLoop = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filterNode = audioContext.createBiquadFilter();

        // Create warm, ambient tones
        oscillator1.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator2.frequency.setValueAtTime(330, audioContext.currentTime); // E4
        
        oscillator1.type = 'sine';
        oscillator2.type = 'triangle';
        
        // Low-pass filter for warmth
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
        filterNode.Q.setValueAtTime(1, audioContext.currentTime);
        
        // Very low volume for ambient background
        gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
        
        // Connect the audio graph
        oscillator1.connect(filterNode);
        oscillator2.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Add subtle frequency modulation for organic feel
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
        lfoGain.gain.setValueAtTime(2, audioContext.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator1.frequency);
        
        if (isPlaying && !isMuted) {
          oscillator1.start();
          oscillator2.start();
          lfo.start();
        }
        
        setIsLoaded(true);
        
        return () => {
          try {
            oscillator1.stop();
            oscillator2.stop();
            lfo.stop();
            audioContext.close();
          } catch (e) {
            // Oscillators already stopped
          }
        };
      } catch (error) {
        console.log('Web Audio API not supported, using fallback');
        setIsLoaded(true);
      }
    };

    const cleanup = createAmbientLoop();
    
    return cleanup;
  }, [isPlaying, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!isLoaded) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleMute}
        className="p-2 bg-amber-900/30 backdrop-blur-sm border border-amber-500/30 rounded-lg hover:bg-amber-900/50 transition-colors"
        title={isMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-amber-200" />
        ) : (
          <Volume2 className="h-5 w-5 text-amber-200" />
        )}
      </button>
      <audio ref={audioRef} loop style={{ display: 'none' }} />
    </div>
  );
};