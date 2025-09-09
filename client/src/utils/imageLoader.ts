// Enhanced image loader for Telegram WebView compatibility
export const loadGameImage = (src: string, fallbackColor?: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Set up loading handlers
    img.onload = () => {
      console.log(`Image loaded successfully: ${src}`);
      resolve(img);
    };
    
    img.onerror = (error) => {
      console.warn(`Failed to load image: ${src}`, error);
      
      // Create fallback colored rectangle
      if (fallbackColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = fallbackColor;
          ctx.fillRect(0, 0, 64, 64);
          
          const fallbackImg = new Image();
          fallbackImg.src = canvas.toDataURL();
          fallbackImg.onload = () => resolve(fallbackImg);
        }
      } else {
        reject(error);
      }
    };
    
    // Add cache-busting for Telegram WebView
    const cacheBustingSrc = src.includes('?') 
      ? `${src}&t=${Date.now()}` 
      : `${src}?t=${Date.now()}`;
    
    // Load with delay for Telegram WebView
    setTimeout(() => {
      img.src = (window as any).TelegramWebApp ? cacheBustingSrc : src;
    }, 100);
  });
};

// Load multiple images with fallback colors
export const loadGameImages = async (imageConfig: Array<{name: string, src: string, fallback?: string}>) => {
  const images: Record<string, HTMLImageElement> = {};
  
  const loadPromises = imageConfig.map(async (config) => {
    try {
      const img = await loadGameImage(config.src, config.fallback);
      images[config.name] = img;
    } catch (error) {
      console.error(`Failed to load ${config.name}:`, error);
    }
  });
  
  await Promise.all(loadPromises);
  return images;
};