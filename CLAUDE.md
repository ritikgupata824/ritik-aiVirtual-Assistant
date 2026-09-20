# Project Guidelines

## Project
AI Virtual Assistant

## Tech Stack
- Frontend: React.js
- Backend: Node.js
- API: Express.js
- Database: MongoDB
- AI: Gemini API
- Language: JavaScript

## Coding Conventions
- Use clear and readable JavaScript.
- Use React functional components.
- Keep frontend and backend code organized.
- Use meaningful variable and function names.
- Avoid unnecessary changes to existing functionality.
- Do not expose API keys or secrets in source code.
- Store sensitive environment variables in `.env` files.
- Test changes before committing them.

## Git Conventions
Use Conventional Commits.

Examples:
- feat: add new feature
- fix: fix a bug
- docs: update documentation
- chore: update configuration

## Project-Specific Rules
- Settings changes must use the existing `/api/user/update` endpoint and `userDataContext`; do not create a duplicate settings API.
- The Settings form must keep Assistant Name required and trim whitespace before saving.
- Language selection must be limited to exactly `English` and `Hindi`.
- Keep Settings focused on assistant preferences; do not add image uploads, animations, avatars, or unrelated UI unless explicitly requested.
- Run the relevant tests and a production build before committing frontend changes.
