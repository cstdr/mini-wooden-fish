---
name: "uipro"
description: "Generates UI components using uipro-cli. Invoke when user wants to generate UI components, add UI features, or create component code with uipro."
---

# uipro - UI Component Generator

This skill uses `uipro` CLI to generate UI components for the project.

## When to Use

Invoke this skill when:
- User asks to generate UI components
- User wants to add UI features with AI assistance
- User asks to create component code using uipro
- User wants to use `uipro init` or other uipro commands

## Usage

### Initialize for Trae AI
```bash
uipro init --ai trae
```

### Generate Components
Use the interactive mode or specify parameters:
```bash
uipro generate [component-name]
```

### Common Commands
- `uipro init --ai trae` - Initialize for Trae
- `uipro generate <name>` - Generate a new component
- `uipro list` - List available components
- `uipro help` - Show help

## Workflow

1. First, run `uipro init --ai trae` in the project directory
2. Then use `uipro generate <component-name>` to create components
3. Review and integrate the generated code into the project

## Notes

- Ensure `uipro-cli` is installed globally: `npm install -g uipro-cli`
- The CLI must be initialized in each project before use
- Generated components may need customization for specific project needs
