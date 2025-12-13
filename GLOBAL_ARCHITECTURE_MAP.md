# 🗺️ VERTIKAL GLOBAL ARCHITECTURE MAP

**Purpose:** Single source of truth for all AI systems  
**Last Updated:** December 13, 2024  
**Status:** MANDATORY REFERENCE

---

## 📐 ARCHITECTURE OVERVIEW

```
Mobile App (React Native/Expo)
    ↓
API Client (services/api.ts)
    ↓
Backend API (Express.js)
    ↓
Prisma ORM
    ↓
PostgreSQL (Supabase)
```

---

## 🔗 TYPE SYSTEM HIERARCHY

### **Source of Truth: `types/index.ts`**

```
Prisma Schema (prisma/schema.prisma)
    ↓
UserDTO / ProjectDTO (Prisma format)
    ↓
transformUserDTO / transformProjectDTO
    ↓
Creator / Project (Mobile UI format)
```

### **Type Flow:**
1. **Database** → Prisma returns `UserDTO`, `ProjectDTO`
2. **Backend API** → Returns `UserDTO[]`, `ProjectDTO[]`
3. **Frontend API Client** → Transforms via `transformUserDTO`, `transformProjectDTO`
4. **React Query Hooks** → Returns `Creator[]`, `Project[]`
5. **Components** → Consume `Creator`, `Project` types

---

## 🌐 API ENDPOINT MAP

### **Source of Truth: `config/api.config.ts`**

#### **Authentication**
- `POST /api/auth/login` → `{ token, user }`
- `POST /api/auth/register` → `{ token, user }`

#### **Users/Creators**
- `GET /api/users` → `UserDTO[]` (transformed to `Creator[]`)
- `GET /api/users/:id` → `UserDTO` (transformed to `Creator`)

#### **Projects/Shows**
- `GET /api/shows` → `ProjectDTO[]` (transformed to `Project[]`)
- `GET /api/shows/:id` → `ProjectDTO` (transformed to `Project`)

#### **Subscriptions**
- `POST /api/subscriptions` → Create subscription

---

## 🔄 DATA TRANSFORMATION MAP

### **Backend → Frontend**

| Backend Field | Frontend Field | Transformer |
|--------------|----------------|-------------|
| `username` | `name` | `transformUserDTO` |
| `coverImage` | `img` | `transformProjectDTO` |
| `profile.bio` | `bio` | `transformUserDTO` |
| `profile.shows` | `projects` | `transformUserDTO` |
| `coinBalance` | `coins` | `transformUserDTO` |
| `role` | `role` | Direct mapping |
| `isFounding50` | `isFounding50` | Direct mapping |

---

## 🔐 SECURITY STANDARDS

### **Token Storage**
- ✅ **Use:** `expo-secure-store`
- ❌ **Never Use:** `AsyncStorage` for tokens

### **Authentication Flow**
1. User logs in → Backend returns `{ token, user }`
2. Frontend stores token in `SecureStore`
3. All API requests include `Authorization: Bearer {token}`
4. 401 errors → Clear token, redirect to login

---

## 📁 FILE STRUCTURE STANDARDS

### **Types**
- **Location:** `types/index.ts`
- **Contains:** All DTOs, UI types, transformers
- **Rule:** Single source of truth

### **API Client**
- **Location:** `services/api.ts`
- **Contains:** Axios instance, interceptors, apiClient methods
- **Rule:** All API calls go through this file

### **Hooks**
- **Location:** `hooks/use*.ts`
- **Contains:** React Query hooks
- **Rule:** Use `apiClient` from `services/api.ts`

### **Backend Routes**
- **Location:** `backend/src/routes/*.ts`
- **Contains:** Express route handlers
- **Rule:** Return Prisma DTOs, frontend transforms

---

## 🎯 NAMING CONVENTIONS

### **Backend**
- Models: `User`, `Profile`, `Show`, `Comment`
- Fields: `camelCase` (e.g., `coinBalance`, `isFounding50`)
- Endpoints: `/api/{resource}`

### **Frontend**
- Types: `Creator`, `Project` (UI-friendly)
- Fields: `camelCase` (e.g., `name`, `avatar`, `coins`)
- Hooks: `use{Resource}` (e.g., `useCreators`, `useProjects`)

### **Transformers**
- Function: `transform{Source}To{Target}`
- Example: `transformUserDTO`, `transformProjectDTO`

---

## ⚠️ CRITICAL RULES

1. **Never** return empty arrays without reason
2. **Never** use AsyncStorage for tokens
3. **Never** skip error handling
4. **Never** use TODO comments
5. **Never** mismatch types
6. **Always** validate before execution
7. **Always** use transformers from `types/index.ts`
8. **Always** follow naming conventions

---

**This map is MANDATORY. All AI systems must reference this.**

