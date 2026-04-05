export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  injectGlobals: true,
  transform: {
    "^.+\\.m?tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "./tsconfig.test.json",
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["node_modules/(?!(uuid|zustand|react-router)/)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
