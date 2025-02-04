This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, ensure you have [pnpm](https://pnpm.io/) installed. If not, you can install it using npm:

```bash
npm install -g pnpm
```

Then, install the project dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file

This project uses [MUI](https://mui.com/) and [MUI Emotion](https://mui.com/material-ui/react-emotion/) for the UI components and styling.

## Testing

For detailed guidelines on writing and organizing tests, please refer to the [Testing Guide](./TESTING.md).

### Running Tests

- **Playwright Tests**: Run end-to-end tests using Playwright with the following command:

  ```bash
  pnpm test:playwright
  ```

- **Unit Tests**: Run unit tests using Jest with the following command:

  ```bash
  pnpm test:unit
  ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Development Scripts

- **Build**: Compile the project for production:

  ```bash
  pnpm build
  ```

- **Start**: Start the production server:

  ```bash
  pnpm start
  ```

- **Lint**: Run ESLint to check for code quality issues:

  ```bash
  pnpm lint
  ```

- **Format**: Format the code using Prettier:

  ```bash
  pnpm format
  ```

- **Pre-commit**: Run formatting and linting before committing:

  ```bash
  pnpm pre-commit
  ```

- **Build WASM**: Build the WebAssembly module:

  ```bash
  pnpm build:wasm
  ```

By following these instructions, you can effectively develop and test the project using the latest version of Next.js and the provided scripts.
