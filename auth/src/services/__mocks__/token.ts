// auth/src/services/__mocks__/token.ts
const generateTokenPair = jest.fn().mockImplementation(async (user) => {
  // Use real JWT for authentication to work
  const { generateJWT } = jest.requireActual("@trc-ticketing/common");
  const accessToken = generateJWT({
    id: user.id,
    email: user.email,
  });

  return {
    accessToken,
    refreshToken: "mock-refresh-token-123",
    accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
});

const refreshAccessToken = jest.fn().mockResolvedValue({
  accessToken: "new-access-token",
  expiresAt: new Date(Date.now() + 15 * 60 * 1000),
});

const revokeRefreshToken = jest.fn().mockResolvedValue(true);

const getUserSessions = jest.fn().mockResolvedValue([
  {
    id: "session1",
    deviceInfo: "Chrome Browser",
    createdAt: new Date(),
    ipAddress: "127.0.0.1",
  },
]);

const revokeAllUserSessions = jest.fn().mockResolvedValue(undefined);

const checkRefreshRateLimit = jest.fn().mockResolvedValue(true);

export const TokenService = {
  generateTokenPair,
  refreshAccessToken,
  revokeRefreshToken,
  getUserSessions,
  revokeAllUserSessions,
  checkRefreshRateLimit,
};
