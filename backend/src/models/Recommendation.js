import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['transportation', 'energy', 'diet', 'consumption', 'waste', 'operations'],
      required: true,
    },
    potentialReduction: {
      type: Number, // estimated kg CO2e saved
      required: true,
    },
    estimatedSavings: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'challenging'],
      default: 'easy',
    },
    status: {
      type: String,
      enum: ['suggested', 'in_progress', 'completed', 'dismissed'],
      default: 'suggested',
    },
    aiGenerated: {
      type: Boolean,
      default: true,
    },
    sourceAgent: {
      type: String,
      default: 'google-adk-gemini',
    },
  },
  {
    timestamps: true,
  }
);

export const Recommendation = mongoose.model('Recommendation', recommendationSchema);
