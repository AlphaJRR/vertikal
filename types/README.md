# Types Directory

This directory contains TypeScript type definitions for the VERTIKAL mobile app.

## Files

- `index.ts` - Main types file with backend-aligned types and transformers

## Usage

```typescript
import { Creator, Project, UserDTO, ProjectDTO, transformUser, transformProject } from './types';
```

## Structure

- **Backend API Response Types** - UserProfile, ShowData
- **DTO Types** - UserDTO, ProjectDTO (Prisma format)
- **Mobile UI Types** - Creator, Project (UI-friendly)
- **Transformers** - Functions to convert backend → mobile format
