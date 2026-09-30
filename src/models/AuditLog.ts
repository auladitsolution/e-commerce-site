import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLogDoc extends Document {
  actor: {
    userId?: string;
    email: string;
    name?: string;
    role: string;
  };
  action: string;
  entityType: string;
  entityId?: string;
  beforeSummary?: string;
  afterSummary?: string;
  reason?: string;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDoc>(
  {
    actor: {
      userId: { type: String },
      email: { type: String, required: true },
      name: { type: String },
      role: { type: String, required: true },
    },
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, index: true },
    beforeSummary: { type: String },
    afterSummary: { type: String },
    reason: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog: Model<IAuditLogDoc> =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDoc>("AuditLog", AuditLogSchema);
