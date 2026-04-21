# Getting Started with Your React + TypeScript + Vite App

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

## Install Dependencies

```bash
npm install
# or
yarn
```

## Start the Development Server

```bash
npm run dev
# or
yarn dev
```

This will start the Vite development server with hot module replacement.

## Build for Production

```bash
npm run build
# or
yarn build
```

## Preview the Production Build

```bash
npm run preview
# or
yarn preview
```

## ESLint Configuration

For better code quality, you can expand the ESLint configuration to enable type-aware lint rules:

```ts
// eslint.config.ts
export default tseslint.config({
  // your configuration here
});
```

Make sure you have the relevant ESLint and TypeScript plugins installed.

---

For more information, visit the [Vite documentation](https://vitejs.dev/).
