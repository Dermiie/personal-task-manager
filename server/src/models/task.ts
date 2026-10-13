import mongoose, { Schema, model } from 'mongoose';

export interface ITask {
  id: string;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  tags: 'Urgent' | 'Important';
  completed: boolean;
}

const taskSchema = new Schema<ITask>(
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
      trim: true,
    },

    tags: {
      type: String,
      enum: ['Urgent', 'Important'],
      required: true,
      // default: 'Important',
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const { _id, __v, ...rest } = ret;

        return {
          ...rest,
          id: _id.toString(),
        };
      },
    },
  },
);

export const Task = model<ITask>('Task', taskSchema);
