# Save the Capybara Game

## Overview

Save the Capybara is a browser-based tower defense game built with Phaser 3 and React. Players draw protective barriers to shield a capybara from incoming bees across 12 handcrafted levels. The game features a drawing phase where players have limited time and ink to create barriers, followed by a survival phase where they must protect the capybara for 5 seconds. The application integrates Solana wallet connectivity for future reward distribution, allowing players to link their wallet addresses with their game scores.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Game Engine**: Phaser 3 with TypeScript for core game mechanics, physics, and rendering
- **UI Framework**: React with TypeScript for user interface components and state management
- **Styling**: TailwindCSS with custom design system using CSS variables and Radix UI components
- **State Management**: Zustand stores for game state, audio controls, and wallet connectivity
- **Build Tool**: Vite with custom configuration supporting GLSL shaders and large asset files

### Game Structure
- **Scene Management**: Three main Phaser scenes (MenuScene, GameScene, GameOverScene) with React overlay components
- **Level System**: JSON-based level configuration with customizable capybara positions, bee spawn patterns, and ink limits
- **Drawing Mechanics**: Real-time barrier drawing with ink consumption tracking and collision detection
- **Physics**: Arcade physics system for bee movement, collision detection, and barrier interactions

### Backend Architecture
- **Server Framework**: Express.js with TypeScript serving both API endpoints and static assets
- **Development Setup**: Vite middleware integration for hot module replacement and development serving
- **API Design**: RESTful endpoints for score submission and leaderboard functionality
- **Storage**: In-memory storage implementation with interface for future database integration

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL with migration support
- **Schema**: User table structure defined with Zod validation schemas
- **Current State**: Database configuration present but not actively used in game logic

### Authentication & User Management
- **Wallet Integration**: Solana wallet adapter supporting Phantom, Solflare, and Backpack wallets
- **Session Management**: LocalStorage-based persistence for wallet addresses and game progress
- **Connection Handling**: React context providers managing wallet state and connectivity

## External Dependencies

### Blockchain Integration
- **Solana Wallet Adapter**: Complete wallet connectivity suite with React components and hooks
- **Network Configuration**: Mainnet connection for production wallet linking (no actual transactions)
- **Supported Wallets**: Phantom, Solflare, and Backpack wallet adapters

### Database & Storage
- **Database**: PostgreSQL configured through Neon serverless driver
- **ORM**: Drizzle with TypeScript support and automatic schema validation
- **Migration System**: Drizzle Kit for database schema management and version control

### UI & Styling
- **Component Library**: Extensive Radix UI component collection for accessible UI elements
- **Styling System**: TailwindCSS with custom theme configuration and dark mode support
- **Icons**: Lucide React for consistent iconography throughout the application

### Game & Media
- **3D Graphics**: React Three Fiber and Drei for potential 3D elements and post-processing
- **Asset Handling**: Vite configuration supporting GLTF, GLB, and audio file formats
- **Audio Support**: MP3, OGG, and WAV format support with muted-by-default audio controls

### Development Tools
- **Build System**: Vite with custom plugins for runtime error handling and GLSL shader support
- **Type Safety**: TypeScript configuration with strict mode and comprehensive type checking
- **Query Management**: TanStack React Query for API state management and caching
- **Development Server**: Express middleware integration with Vite for seamless development experience