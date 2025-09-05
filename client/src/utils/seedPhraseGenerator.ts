// Word list for generating 4-word seed phrases
const WORD_LIST = [
    // Animals
    'capybara', 'dolphin', 'elephant', 'falcon', 'giraffe', 'hamster', 'iguana', 'jaguar',
    'kangaroo', 'lemur', 'mongoose', 'narwhal', 'octopus', 'penguin', 'quokka', 'rabbit',
    'seahorse', 'turtle', 'unicorn', 'vulture', 'walrus', 'xerus', 'yak', 'zebra',
    
    // Nature
    'aurora', 'breeze', 'crystal', 'dewdrop', 'ember', 'forest', 'galaxy', 'horizon',
    'island', 'jungle', 'lagoon', 'meadow', 'nebula', 'ocean', 'peak', 'quartz',
    'river', 'storm', 'thunder', 'valley', 'wave', 'zephyr',
    
    // Objects
    'anchor', 'beacon', 'compass', 'diamond', 'engine', 'feather', 'guardian', 'harbor',
    'ivory', 'jewel', 'key', 'lantern', 'mirror', 'needle', 'orb', 'prism',
    'quest', 'relic', 'shield', 'torch', 'unity', 'vessel', 'wand', 'zenith',
    
    // Colors & Elements
    'amber', 'bronze', 'copper', 'emerald', 'flame', 'gold', 'iron', 'jade',
    'lunar', 'marble', 'onyx', 'pearl', 'ruby', 'silver', 'topaz', 'violet'
];

export const generateSeedPhrase = (): string => {
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).join(' ');
};

export const validateSeedPhrase = (phrase: string): boolean => {
    const words = phrase.trim().toLowerCase().split(' ');
    return words.length === 4 && words.every(word => WORD_LIST.includes(word));
};

export const formatSeedPhrase = (phrase: string): string => {
    return phrase.toLowerCase().trim().replace(/\s+/g, ' ');
};