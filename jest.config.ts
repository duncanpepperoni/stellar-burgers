export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(css|module\\.css)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|svg|gif|woff|woff2)$':
      '<rootDir>/src/__mocks__/fileMock.ts',

    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',

    // алиасы с @, как в коде
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',

    '^slices/(.*)$': '<rootDir>/src/services/slices/$1',
    '^selectors/(.*)$': '<rootDir>/src/services/selectors/$1'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    '**/*.test.ts',
    '**/*.test.tsx'
  ]
};
