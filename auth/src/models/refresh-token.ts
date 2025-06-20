import mongoose from "mongoose";

interface RefreshTokenAttrs {
  token: string;
  userId: string;
  expiresAt: Date;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface RefreshTokenDoc extends mongoose.Document {
  token: string;
  userId: string;
  expiresAt: Date;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RefreshTokenModel extends mongoose.Model<RefreshTokenDoc> {
  build(attrs: RefreshTokenAttrs): RefreshTokenDoc;
}

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    deviceInfo: {
      type: String,
      default: "Unknown Device",
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.token;
      },
    },
  }
);

// Index for efficient cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for finding user's active sessions
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

refreshTokenSchema.statics.build = (attrs: RefreshTokenAttrs) => {
  return new RefreshToken(attrs);
};

// Instance method to check if token is valid
refreshTokenSchema.methods.isValid = function () {
  return !this.isRevoked && this.expiresAt > new Date();
};

// Instance method to revoke token
refreshTokenSchema.methods.revoke = function () {
  this.isRevoked = true;
  return this.save();
};

const RefreshToken = mongoose.model<RefreshTokenDoc, RefreshTokenModel>(
  "RefreshToken",
  refreshTokenSchema
);

export { RefreshToken };
