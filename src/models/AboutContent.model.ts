import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITimelineEntry {
  year: string;
  title: string;
  description: string;
}

interface ICoreValue {
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
}

interface IGoal {
  title: string;
  description: string;
}

export interface IAboutContent {
  founderName: string;
  founderBio: string;
  founderImage?: string;
  mission: string;
  vision: string;
  goals: IGoal[];
  values: ICoreValue[];
  timeline: ITimelineEntry[];
  updatedAt: Date;
}

export interface IAboutContentDocument extends IAboutContent, Document {}

const aboutContentSchema = new Schema<IAboutContentDocument>(
  {
    founderName: { type: String, required: true },
    founderBio: { type: String, required: true },
    founderImage: { type: String },
    mission: { type: String, required: true },
    vision: { type: String, required: true },
    goals: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        _id: false,
      },
    ],
    values: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        _id: false,
      },
    ],
    timeline: [
      {
        year: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

export const AboutContent: Model<IAboutContentDocument> =
  mongoose.model<IAboutContentDocument>('AboutContent', aboutContentSchema);
