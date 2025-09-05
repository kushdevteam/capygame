export interface LevelConfig {
    id: number;
    name: string;
    capybaraPosition: { x: number; y: number };
    beeSpawns: Array<{
        x: number;
        y: number;
        delay: number; // seconds before spawning
        speed: number;
    }>;
    timeLimit: number; // seconds for survival phase
    inkLimit: number; // percentage of ink available
}

export const levels: LevelConfig[] = [
    {
        id: 1,
        name: "First Contact",
        capybaraPosition: { x: 400, y: 300 },
        beeSpawns: [
            { x: 100, y: 100, delay: 0, speed: 50 },
            { x: 700, y: 100, delay: 1, speed: 50 }
        ],
        timeLimit: 5,
        inkLimit: 100
    },
    {
        id: 2,
        name: "Buzzing Trouble",
        capybaraPosition: { x: 400, y: 350 },
        beeSpawns: [
            { x: 50, y: 150, delay: 0, speed: 60 },
            { x: 750, y: 150, delay: 0.5, speed: 60 },
            { x: 400, y: 50, delay: 1.5, speed: 55 }
        ],
        timeLimit: 5,
        inkLimit: 90
    },
    {
        id: 3,
        name: "Swarm Alert",
        capybaraPosition: { x: 300, y: 300 },
        beeSpawns: [
            { x: 100, y: 100, delay: 0, speed: 65 },
            { x: 700, y: 100, delay: 0, speed: 65 },
            { x: 100, y: 500, delay: 1, speed: 65 },
            { x: 700, y: 500, delay: 1, speed: 65 }
        ],
        timeLimit: 5,
        inkLimit: 85
    },
    {
        id: 4,
        name: "Corner Trap",
        capybaraPosition: { x: 150, y: 150 },
        beeSpawns: [
            { x: 400, y: 100, delay: 0, speed: 70 },
            { x: 500, y: 200, delay: 0.5, speed: 70 },
            { x: 400, y: 300, delay: 1, speed: 70 },
            { x: 300, y: 200, delay: 1.5, speed: 70 }
        ],
        timeLimit: 5,
        inkLimit: 80
    },
    {
        id: 5,
        name: "Cross Fire",
        capybaraPosition: { x: 400, y: 300 },
        beeSpawns: [
            { x: 0, y: 300, delay: 0, speed: 75 },
            { x: 800, y: 300, delay: 0, speed: 75 },
            { x: 400, y: 0, delay: 1, speed: 75 },
            { x: 400, y: 600, delay: 1, speed: 75 }
        ],
        timeLimit: 5,
        inkLimit: 75
    },
    {
        id: 6,
        name: "Diagonal Danger",
        capybaraPosition: { x: 400, y: 300 },
        beeSpawns: [
            { x: 100, y: 100, delay: 0, speed: 80 },
            { x: 700, y: 100, delay: 0.3, speed: 80 },
            { x: 700, y: 500, delay: 0.6, speed: 80 },
            { x: 100, y: 500, delay: 0.9, speed: 80 },
            { x: 400, y: 50, delay: 1.5, speed: 75 }
        ],
        timeLimit: 5,
        inkLimit: 70
    },
    {
        id: 7,
        name: "Speed Demons",
        capybaraPosition: { x: 300, y: 400 },
        beeSpawns: [
            { x: 50, y: 50, delay: 0, speed: 90 },
            { x: 750, y: 50, delay: 0.2, speed: 90 },
            { x: 750, y: 550, delay: 0.4, speed: 90 },
            { x: 50, y: 550, delay: 0.6, speed: 90 },
            { x: 400, y: 100, delay: 1, speed: 85 },
            { x: 400, y: 500, delay: 1.2, speed: 85 }
        ],
        timeLimit: 5,
        inkLimit: 65
    },
    {
        id: 8,
        name: "Maze Runner",
        capybaraPosition: { x: 200, y: 450 },
        beeSpawns: [
            { x: 600, y: 100, delay: 0, speed: 70 },
            { x: 600, y: 200, delay: 0.3, speed: 70 },
            { x: 600, y: 300, delay: 0.6, speed: 70 },
            { x: 600, y: 400, delay: 0.9, speed: 70 },
            { x: 600, y: 500, delay: 1.2, speed: 70 },
            { x: 100, y: 200, delay: 1.5, speed: 75 }
        ],
        timeLimit: 5,
        inkLimit: 60
    },
    {
        id: 9,
        name: "Spiral Attack",
        capybaraPosition: { x: 400, y: 300 },
        beeSpawns: [
            { x: 200, y: 150, delay: 0, speed: 85 },
            { x: 600, y: 150, delay: 0.2, speed: 85 },
            { x: 600, y: 450, delay: 0.4, speed: 85 },
            { x: 200, y: 450, delay: 0.6, speed: 85 },
            { x: 300, y: 100, delay: 0.8, speed: 85 },
            { x: 500, y: 100, delay: 1, speed: 85 },
            { x: 500, y: 500, delay: 1.2, speed: 85 },
            { x: 300, y: 500, delay: 1.4, speed: 85 }
        ],
        timeLimit: 5,
        inkLimit: 55
    },
    {
        id: 10,
        name: "Chaos Theory",
        capybaraPosition: { x: 350, y: 350 },
        beeSpawns: [
            { x: 100, y: 100, delay: 0, speed: 95 },
            { x: 700, y: 100, delay: 0.1, speed: 95 },
            { x: 700, y: 500, delay: 0.2, speed: 95 },
            { x: 100, y: 500, delay: 0.3, speed: 95 },
            { x: 400, y: 50, delay: 0.5, speed: 90 },
            { x: 750, y: 300, delay: 0.7, speed: 90 },
            { x: 400, y: 550, delay: 0.9, speed: 90 },
            { x: 50, y: 300, delay: 1.1, speed: 90 },
            { x: 250, y: 200, delay: 1.3, speed: 85 },
            { x: 550, y: 400, delay: 1.5, speed: 85 }
        ],
        timeLimit: 5,
        inkLimit: 50
    },
    {
        id: 11,
        name: "The Gauntlet",
        capybaraPosition: { x: 400, y: 500 },
        beeSpawns: [
            { x: 50, y: 50, delay: 0, speed: 100 },
            { x: 150, y: 50, delay: 0.1, speed: 100 },
            { x: 250, y: 50, delay: 0.2, speed: 100 },
            { x: 350, y: 50, delay: 0.3, speed: 100 },
            { x: 450, y: 50, delay: 0.4, speed: 100 },
            { x: 550, y: 50, delay: 0.5, speed: 100 },
            { x: 650, y: 50, delay: 0.6, speed: 100 },
            { x: 750, y: 50, delay: 0.7, speed: 100 },
            { x: 100, y: 150, delay: 1, speed: 95 },
            { x: 700, y: 150, delay: 1.2, speed: 95 },
            { x: 200, y: 250, delay: 1.5, speed: 90 },
            { x: 600, y: 250, delay: 1.7, speed: 90 }
        ],
        timeLimit: 5,
        inkLimit: 45
    },
    {
        id: 12,
        name: "Final Swarm",
        capybaraPosition: { x: 400, y: 300 },
        beeSpawns: [
            // Outer ring
            { x: 50, y: 50, delay: 0, speed: 110 },
            { x: 400, y: 25, delay: 0.1, speed: 110 },
            { x: 750, y: 50, delay: 0.2, speed: 110 },
            { x: 775, y: 300, delay: 0.3, speed: 110 },
            { x: 750, y: 550, delay: 0.4, speed: 110 },
            { x: 400, y: 575, delay: 0.5, speed: 110 },
            { x: 50, y: 550, delay: 0.6, speed: 110 },
            { x: 25, y: 300, delay: 0.7, speed: 110 },
            // Middle ring
            { x: 150, y: 150, delay: 0.8, speed: 105 },
            { x: 650, y: 150, delay: 0.9, speed: 105 },
            { x: 650, y: 450, delay: 1, speed: 105 },
            { x: 150, y: 450, delay: 1.1, speed: 105 },
            // Inner ring
            { x: 250, y: 200, delay: 1.5, speed: 100 },
            { x: 550, y: 200, delay: 1.6, speed: 100 },
            { x: 550, y: 400, delay: 1.7, speed: 100 },
            { x: 250, y: 400, delay: 1.8, speed: 100 }
        ],
        timeLimit: 5,
        inkLimit: 40
    }
];

export const getLevel = (levelId: number): LevelConfig | null => {
    return levels.find(level => level.id === levelId) || null;
};

export const getNextLevel = (currentLevel: number): LevelConfig | null => {
    return getLevel(currentLevel + 1);
};

export const getTotalLevels = (): number => {
    return levels.length;
};
