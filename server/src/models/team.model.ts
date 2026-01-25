import { Schema, model, Document } from 'mongoose';

export interface TeamDocument extends Document {
  title: string;
  description: string;
  status: string;
}

const TeamSchema = new Schema<TeamDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: '0',
  },
});

export default model<TeamDocument>('team', TeamSchema);
