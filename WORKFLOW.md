\# AI-Assisted Workflow Drill



\## Feature

The selected feature was a focused Assistant Settings form for the AI Virtual Assistant. The form allows the user to update the assistant name and choose between English and Hindi.



\## Round 1 — Vague Prompt



Round 1 was completed on the `workflow-vague` branch using the single vague prompt:



> Create a simple settings form for this project.



The AI inspected the project and created a Settings page, but the implementation showed clear scope creep. It added unrelated functionality such as image upload handling, FormData image logic, animations, and additional visual behavior that was not required for the feature. This was an AI mistake caught during review because the requested feature was only a small assistant-preferences form.



The initial production build also failed because the frontend dependencies were not installed and Vite was unavailable. After reviewing the result, the branch was committed as `8119be3` (`feat: add settings form`) and pushed.



\## Round 2 — Precise Prompt



Round 2 was completed on a fresh `workflow-precise` branch and fresh AI session. The prompt required the AI to inspect the existing user context, update API, project conventions, and Settings-related files before implementation. It specified required Assistant Name validation, exactly English/Hindi language options, existing API/context reuse, loading and error states, prevention of repeated submissions, accessibility, edge cases, and a verification step.



The resulting implementation was more focused. It added `Settings.jsx`, a `/settings` route, Settings navigation, backend language support, and focused validation tests. The implementation reused the existing `/api/user/update` endpoint and `userDataContext` instead of creating a duplicate API.



\## Verification



The Round 2 frontend production build passed successfully with `npm run build`. Focused tests were added with Vitest and passed with `2/2 tests`. Linting was also checked; the remaining lint errors were in pre-existing project files rather than the new Settings component.



\## Review Effort and Quality



Round 1 required more manual review because the vague prompt allowed unnecessary functionality and made the intended scope unclear. Round 2 reduced review effort because the prompt explicitly defined constraints and expected behavior.



Accessibility was considered through semantic labels connected to inputs, keyboard-accessible controls, visible status messages, and a disabled submit button while saving.



Important edge cases covered include whitespace-only names, missing user data, API failures, and repeated submit clicks. The precise workflow produced a smaller and more predictable feature that better matched the project's existing architecture.

