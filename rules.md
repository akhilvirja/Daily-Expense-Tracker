# Project Core Guidelines & Rules

These are the strict project-level rules for the "Expense and Daily Tracking Application" that must be followed as a Senior Developer.

## 1. Professionalism & Communication
- **Ask Before Acting:** If requirements are ambiguous or not fully understood, ALWAYS ask clarifying questions before writing code. Do not make assumptions or "dumb changes".
- **Deep Debugging:** Debug every error thoroughly. Understand the root cause deeply before proposing or applying a fix.

## 2. Frontend (UI/UX & Architecture)
- **Component Reusability:** Every UI element (Buttons, Inputs, Toasts, Cards, Modals) MUST be created as a reusable common component. Do not write inline complex HTML/JSX for these basic elements repeatedly.
- **CSS Variables & Design System:** Create a robust design system using CSS variables (e.g., `--color-primary`, `--spacing-md`). Apply these variables globally to ensure consistency.
- **Premium Aesthetics:** DO NOT use basic or generic AI-generated color palettes (plain red, blue, green). Utilize modern, premium, rich aesthetics (e.g., curated HSL palettes, glassmorphism, dynamic micro-animations, modern typography like Inter or Roboto).
- **Extensibility:** The frontend architecture should allow easy global changes (e.g., changing the primary color by updating a single CSS variable).

## 3. Backend (API & Architecture)
- **Standardized Responses:** Every API response MUST follow a standard format. Use common utility functions for success, error, and pagination responses. (e.g., `sendSuccess`, `sendError`).
- **Clean Routing with Versioning:** Implement proper API versioning (e.g., `/api/v1/...`). The routing structure must be clean and clearly separated by domains/modules (e.g., `routes/v1/accounts.routes.js`).
- **Utility & Helper Functions:** Do not clutter controllers with complex logic. Abstract reusable logic into helper or utility functions.
- **Production-Grade Structure:** Continue to build on the established modular architecture.

## 4. Skills & Plugins
- Utilize the available plugins (e.g., `modern-web-guidance-plugin`) and skills whenever appropriate. Do not hesitate to use specialized tools if they fit the requirement.
