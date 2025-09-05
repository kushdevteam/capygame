export const GAME_CONFIG = {
    // Drawing settings
    DRAWING_TIME: 2.5, // seconds
    SURVIVAL_TIME: 5, // seconds
    INITIAL_INK: 100,
    
    // Drawing mechanics
    BRUSH_SIZE: 8,
    INK_CONSUMPTION_RATE: 0.5, // ink consumed per pixel drawn
    MIN_DRAW_DISTANCE: 5, // minimum distance between draw points
    
    // Capybara settings
    CAPYBARA_SIZE: 40,
    CAPYBARA_COLOR: 0x8B4513, // Brown color
    
    // Bee settings
    BEE_SIZE: 15,
    BEE_COLOR: 0xFFD700, // Gold color
    BEE_DETECTION_RADIUS: 20,
    
    // Barrier settings
    BARRIER_COLOR: 0x654321, // Dark brown
    BARRIER_THICKNESS: 8,
    
    // Physics
    BEE_TURN_SPEED: 2, // radians per second
    WALL_BOUNCE_FORCE: 50,
    
    // Scoring
    SCORE_PER_LEVEL: 100,
    SCORE_PER_SECOND_SURVIVED: 10,
    SCORE_BONUS_MULTIPLIER: 2, // for completing levels with ink remaining
    
    // Screen bounds
    SCREEN_PADDING: 50
};
