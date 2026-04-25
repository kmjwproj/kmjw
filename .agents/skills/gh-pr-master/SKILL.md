---
name: gh-pr-master
description: Automatically creates Pull Requests using gh CLI by analyzing project templates and recent commit logs.
---

# GH PR Master

This skill automates the tedious process of writing PR descriptions by organizing work history based on commit logs and project templates.

## Recommended Workflow

1.  **Template and Commit Analysis**:
    - Check for the existence of and read the `.github/pull_request_template.md` file.
    - Retrieve recent commit messages and detailed descriptions using `git log -n {N}` (default: 6).
    - Identify the current branch name (`git branch --show-current`).

2.  **Body Generation (KOREAN ONLY)**:
    - **CRITICAL**: The generated PR title and body MUST be written in **Korean**, regardless of the language used in commit messages.
    - Summarize and map commit history into the template's sections (e.g., Work Details, Detailed Tasks, Related Issues).
    - Automatically fill in completion checkboxes `[x]` for "Completed Tasks".
    - If commit messages contain issue numbers like `#123`, include them in the body as `Closes #123`.

3.  **PR Creation Execution**:
    - Construct and execute the `gh pr create` command.
    - Set the base branch to `dev` (or the project's standard base branch).
    - Generate a title based on the most recent commit or the overall feature scope (in Korean).

## Core Instructions

- **Output Language**: Always generate the final PR title and description in **Korean**.
- **Surgical Summary**: Do not just copy-paste commit messages. Group similar tasks and summarize them for readability in Korean.
- **Template First**: Strictly adhere to the project's defined template format. If no template exists, propose a standard Korean format.
- **Smart Mapping**: Use prefixes like `feat:`, `fix:`, `refactor:` to categorize items in the "Work Details" section.
- **Verification**: Before executing the command, show the generated PR title and body summary to the user for confirmation.

## Tools Used

- `git`: For log and branch information.
- `gh`: For PR creation and issue management.
- `read_file`: To read the template file.
