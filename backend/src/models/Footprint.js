import mongoose from 'mongoose';

const footprintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['transportation', 'energy', 'diet', 'consumption', 'waste', 'operations'],
      required: true,
    },
    activityName: {
      type: String,
      required: true,
      trim: true,
    },
    emissionValue: {
      type: Number, // in kg CO2e
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: 'kg_co2e',
    },
    activityData: {
      quantity: Number,
      unitOfMeasure: String,
      metadata: mongoose.Schema.Types.Mixed,
    },
    loggedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Footprint = mongoose.model('Footprint', footprintSchema);
