import type { Request, Response } from 'express';
import { Task } from '../../models/task';
import { AuthRequest } from '../../middleware/auth.middleware';
import mongoose from 'mongoose';

export async function getTasks(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  const query = req.query;

  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 8, 1), 50);
  const skip = (page - 1) * pageSize;

  const tab =
    query.tab === 'Important' || query.tab === 'Urgent' ? query.tab : 'all';

  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const filter: Record<string, unknown> = {
      userId,
    };

    if (tab === 'Important') {
      filter.tags = 'Important';
    }

    if (tab === 'Urgent') {
      filter.tags = 'Urgent';
    }

    if (query.completed !== undefined) {
      filter.completed = query.completed === 'true';
    }

    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Task.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalTasks / pageSize);

    console.log('Authenticated user ID:', req.user.userId);

    // const userId = new mongoose.Types.ObjectId(req.user.id);

    console.log('Mongo user ID:', userId);

    return res.status(200).json({
      success: true,
      tasks,
      pagination: {
        page,
        pageSize,
        totalTasks,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch tasks',
    });
  }
}

export async function createTask(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  if (!req.user?.userId || !mongoose.isValidObjectId(req.user.userId)) {
    return res.status(401).json({ message: 'Invalid token payload' });
  }

  const userId = new mongoose.Types.ObjectId(req.user.userId);
  try {
    const task = await Task.create({ ...req.body, userId });

    res.status(201).json({ success: true, task });
    console.log(task);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create task',
    });
  }
}

export async function editTask(req: AuthRequest, res: Response) {
  if (!req.user?.userId) {
    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  const { taskId } = req.params;

  if (!mongoose.isValidObjectId(taskId)) {
    res.status(400).json({
      success: false,
      message: 'Provide a valid task Id',
    });
    return;
  }

  // Only allow these fields to be changed
  const { title, description, tags, completed } = req.body;
  const updates = Object.fromEntries(
    Object.entries({ title, description, tags, completed }).filter(
      ([, value]) => value !== undefined,
    ),
  );

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid fields to update',
    });
  }

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.userId },
      updates,
      {
        returnDocument: 'after', //return the updated documents
        runValidators: true, //ensure schema validation runs
      },
    );

    if (!updatedTask) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      updatedTask,
    });
    console.log(updatedTask);
  } catch (error: any) {
    console.error(error);
    res.status(501).json({
      error: error.message,
    });
  }
}

export async function deleteTask(req: AuthRequest, res: Response) {
  if (!req.user?.userId) {
    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  const { taskId } = req.params;

  if (!mongoose.isValidObjectId(taskId)) {
    return res.status(400).json({
      success: false,
      message: 'Provide a valid task Id',
    });
  }

  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      userId: req.user.userId,
    });
    console.log(deletedTask);
    res.status(200).json({
      success: true,
      message: 'Task successfully deleted',
    });
  } catch (error: any) {
    console.error(error);
    res.status(501).json({
      error: error.message,
    });
  }
}
