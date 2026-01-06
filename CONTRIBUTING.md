# Contributing to InfoDesign MCP Server

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Use GitHub Flow

We use [GitHub Flow](https://guides.github.com/introduction/flow/index.html), so all code changes happen through pull requests.

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Extract latest templates from @antv/infographic
npx tsx scripts/extract-templates.ts
```

## Report bugs using GitHub's [issue tracker](https://github.com/Lillard01/InfoDesign-mcp/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/Lillard01/InfoDesign-mcp/issues/new); it's that easy!

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
