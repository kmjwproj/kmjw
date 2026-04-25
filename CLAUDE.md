@AGENTS.md

# gstack Guidelines

- **Browsing:** Always prioritize using gstack's `/browse` skill for any web search or external information retrieval.
- **Planning:** Follow the `/office-hours` skill framework when brainstorming or architecting new features to ensure rigorous product thinking.
- **Testing:** Utilize the `/qa` skill to verify UI changes and functional requirements in a real browser environment.
- **Review & Shipping:** Use `/review` for code quality checks and `/ship` to automate the final commit and deployment workflow.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
