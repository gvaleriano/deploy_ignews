module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], // ignorar essas pastas ao rodar testes
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts"
  ], // indicar arquivo de setup
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest" // transformar os arquivos com extensão ".js, .jsx, .ts, .tsx" para formato jest
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*.spec.tsx",
    "!src/**/_app.tsx",
    "!src/**/_document.tsx"
  ],
  coverageReports: ["lcov", "json"]
};