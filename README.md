# semlint

A linting tool that verifies consistency between function/method naming and their implementations

## Overview

semlint analyzes functions and methods in your codebase and evaluates them from the following perspectives:

1. **Naming-Implementation Consistency** - Whether function/method names appropriately represent their internal implementation
2. **Comment-Implementation Consistency** - Whether function/method comments (descriptions) align with the implementation
3. **Naming-Comment Consistency** - Whether function/method names match their comments (descriptions)

By leveraging semantic analysis with the Claude Code SDK, semlint evaluates code based on understanding its meaning.

## Installation

```bash
# npm
npm install -g semlint

# yarn
yarn global add semlint

# pnpm
pnpm add -g semlint
```

## Usage

```bash
# Analyze a single file
semlint src/example.ts
```

## Output Examples

### Success Case (all matches)
```
Analyzing: example.ts
✓ calculateSum       👍 match
✓ getUserName        👍 match
✓ formatDate         👍 match

Summary: 3 functions analyzed (3 match, 0 unclear, 0 mismatch)
```

### Issue Detection Example
```
Analyzing: calculator.ts
✓ add                👍 match
? getAverage         🤔 unclear    - Function name suggests average but might also calculate median
✗ multiply           ❌ mismatch  - Function name is "multiply" but implementation is "addition"

Summary: 3 functions analyzed (1 match, 1 unclear, 1 mismatch)
```

## Evaluation Levels

- **👍 match**: Naming and implementation are consistent
- **🤔 unclear**: Judgment is ambiguous, review recommended
- **❌ mismatch**: Clear inconsistency, correction recommended

## Supported Languages

- TypeScript/JavaScript
- Python

## Examples

The `examples/` directory contains sample code. These samples include cases where function names don't match their implementations (e.g., a `multiply` function that actually performs addition), allowing you to see how semlint works.

```bash
# Try with sample file
semlint examples/calculator.ts
```

## License

MIT