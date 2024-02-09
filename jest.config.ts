import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!./jest.config.ts",
    "!./src/app.ts",
    "!./src/server.ts",
  ],
};

export default config;
