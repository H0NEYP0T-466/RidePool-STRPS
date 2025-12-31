# Contributing Guidelines

Thanks for considering a contribution to **RidePool-STRPS**! This guide outlines how to propose changes and keep the project healthy.

## 🧭 How to Contribute
1. Fork the repository and clone your fork.
2. Create a feature branch: `git checkout -b feature/your-change`.
3. Install dependencies:
   - Frontend: `npm install`
   - Backend: `python -m venv venv && source venv/bin/activate && pip install -r backend/requirements.txt`
4. Make your changes with clear, focused commits.
5. Run quality checks (see below).
6. Push your branch and open a Pull Request (PR) describing the change and linking any related issues.

## 🧹 Code Style & Linting
- JavaScript/TypeScript: follow ESLint rules. Run `npm run lint`.
- Prefer TypeScript types for new code and keep imports organized.
- Keep changes small and purposeful; avoid unrelated refactors.

## 🧪 Testing
- Frontend build sanity check: `npm run build`.
- Backend: add or run relevant tests if introduced; ensure FastAPI routes behave as expected.
- For bug fixes, include a short repro or steps in the PR description.

## 📚 Documentation Updates
- Update README sections or inline docs when behavior or setup changes.
- Keep changelog notes inside the PR description.

## 🐞 Reporting Bugs
When filing a bug, include:
- Summary of the issue
- Steps to reproduce (with expected vs. actual behavior)
- Environment details (OS, browser/runtime versions)
- Logs or screenshots if available

## 💡 Feature Requests
- Explain the problem the feature solves.
- Share proposed behavior and possible alternatives.
- Call out scope and potential impact.

## ✅ Pull Request Checklist
- [ ] Lint/build checks pass (`npm run lint`, `npm run build`).
- [ ] Tests added/updated (when applicable).
- [ ] Documentation updated (README/docs) if behavior or setup changed.
- [ ] PR links related issues and includes a clear summary.

## 📬 Communication
- Use GitHub Issues for bugs and enhancements.
- For security-related reports, follow [SECURITY.md](./SECURITY.md).
