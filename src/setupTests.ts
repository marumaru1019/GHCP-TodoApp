import '@testing-library/jest-dom';

// 📝 crypto.randomUUID のモック
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => Math.random().toString(36).substring(2, 15),
  },
});