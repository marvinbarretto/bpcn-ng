# BpcnNg

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.




# Commit & Versioning Workflow

This project uses **Conventional Commits** and **standard-version** to automate versioning and changelog generation. Optionally, **Husky** is used for commit hooks to enforce rules locally.

## ✅ Commit Style

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Examples:

- `feat: add footer component`
- `fix(home): correct nav focus state`
- `chore: update dependencies`
- `docs: add README section on versioning`

Types include: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`.

### 🔺 Triggering Version Bumps

By default, `standard-version` analyzes commit messages and bumps semver accordingly:

- `fix:` → Patch
- `feat:` → Minor
- `BREAKING CHANGE:` (in body or footer) → Major

To trigger a **major** version bump, include `BREAKING CHANGE:` in the commit body or footer:

```
feat: overhaul API surface

BREAKING CHANGE: removed deprecated endpoints
```

> 🔒 The format isn't strictly enforced by default — you can opt in using Husky + commitlint.

## 🛠 Scripts

### Bump version + update changelog (manual)

```
npm run release
```

This will:

- Analyze commits since the last release
- Bump version in `package.json`
- Generate/append to `CHANGELOG.md`
- Commit the release as `chore(release): x.y.z`
- Create a Git tag `vX.Y.Z`

### Push release (manual)

After running `npm run release`, push the tag and release commit:

```
git push && git push --tags
```

### Auto-release via CI (optional)

If you're using GitHub Actions or Railway builds, you can set up CI to:

- Run `npm run release` after merging to `master`
- Push the tag and changelog

> This gives you full control — manual local bumps or automated CI releases.


## 📄 Files created
- `CHANGELOG.md`: auto-managed by `standard-version`


## Standard Version
```bash
npm run release -- --release-as 1.0.0
```
or
```bash
npm run release -- --release-as major
```


## Git Aliases
```bash
alias release="npm run release"
alias gs="git status"
alias gcm="git commit -m"
alias gp="git pull"
alias gpt="git push && git push --tags"
```

## Workflow
- work locally on a feature branch
  - `gs` (Check status)
  - `gp` (Pull)
  
- commit with a proper prefix: (feat:, fix:, chore:, docs:, etc.)
  - `gcm` (Add commit message)
  - `release` (Add `--release-as` flag to override the version bump if necessary)
  - `gpt` (Push with tags)

```bash
git push && git push --tags (gpt)
```


## Docker commands:

### Check and remove containers
```bash
docker ps -q | xargs docker stop
docker ps -q | xargs docker rm
```

### Remove all containers
```bash
docker container prune
```

### Run on port 4040 locally
```bash
docker build -t bpcn .
docker run -p 4040:4000 bpcn
```
