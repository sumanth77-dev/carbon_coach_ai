import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    accountType: {
      type: String,
      enum: ['individual', 'family', 'business'],
      default: 'individual',
    },
    profileDetails: {
      householdMembers: {
        type: Number,
        default: 1,
      },
      businessIndustry: {
        type: String,
        default: '',
      },
      location: {
        country: String,
        city: String,
        postalCode: String,
      },
    },
    baselineCarbonTarget: {
      type: Number, // in kg CO2e / month
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
