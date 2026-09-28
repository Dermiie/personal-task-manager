import type { Request, Response } from 'express';
import { Task } from '../models/task';

export async function getTasks(_req: Request, res: Response) {
  try {
    const tasks = await Task.find().sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch tasks',
    });
  }
}

export async function createTask(req: Request, res: Response) {
  try {
    const task = await Task.create(req.body);

    res.status(201).json(task);
    console.log(task);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create task',
    });
  }
}

export async function editTask(req: Request, res: Response) {
  const { taskId } = req.params;

  if (!taskId) {
    res.status(400).json({
      success: true,
      message: 'Task Id is required',
    });
    return;
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
    returnDocument: 'after', //return the updated documents
    runValidators: true, //ensure schema validation runs
  });

  if (!updatedTask) {
    res.status(404).json({
      success: false,
      message: 'Task not found',
    });
    return;
  }

  try {
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
