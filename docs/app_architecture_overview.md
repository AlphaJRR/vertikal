# VERTIKAL — App Architecture Overview

## LAYERS

1. Data Layer (JSON for now → API later)
2. Feed Engine
3. Show Detail Engine
4. Video Player Core
5. Creator System
6. Onboarding Engine
7. Analytics Layer
8. Moderation Layer (future)

---

# STATE MANAGEMENT

Use React Context OR Zustand for:
- Auth state
- Feed state
- Player state
- Modal management
