import { Schema, model } from 'mongoose';

export interface ITask {
  title: string;
  description: string;
  priority: 'Urgent' | 'Important';
  completed: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ['Urgent', 'Important'],
      default: 'Important',
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Task = model<ITask>('Task', taskSchema);
