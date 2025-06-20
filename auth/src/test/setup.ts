import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

// Mock Redis completely for tests
jest.mock("@trc-ticketing/common", () => {
  const originalModule = jest.requireActual("@trc-ticketing/common");

  // Create a mock redis client that doesn't try to connect
  const mockRedisClient = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(true),
    setJSON: jest.fn().mockResolvedValue(true),
    getJSON: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(true),
    ping: jest.fn().mockResolvedValue("PONG"),
  };

  return {
    ...originalModule,
    redisClient: mockRedisClient,
    RedisConnection: {
      getInstance: jest.fn().mockResolvedValue(mockRedisClient),
      disconnect: jest.fn().mockResolvedValue(undefined),
      isConnected: jest.fn().mockReturnValue(true),
    },
  };
});

// Also mock the Redis module directly
jest.mock("redis", () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue("OK"),
    setex: jest.fn().mockResolvedValue("OK"),
    del: jest.fn().mockResolvedValue(1),
    ping: jest.fn().mockResolvedValue("PONG"),
    isReady: true,
    on: jest.fn(),
  })),
}));

declare global {
  var getAuthCookie: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.getAuthCookie = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  if (!cookie) {
    throw new Error("Failed to get cookie from response");
  }
  return cookie;
};
