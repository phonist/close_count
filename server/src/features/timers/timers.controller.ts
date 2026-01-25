import { Request, Response, NextFunction } from 'express';
import {
  createTimer,
  listTimersByUser,
  findTimerById,
  deleteTimer,
} from './timers.service';
import type { CreateTimerRequest, TimerListResponse, TimerResponse } from './timers.dtos';
import type { TimerDocument } from '../../models/timer.model';

const toTimerResponse = (timer: TimerDocument): TimerResponse => ({
  _id: timer.id,
  user: timer.user.toString(),
  title: timer.title,
  description: timer.description,
  timer: timer.timer,
  status: timer.status,
  createdAt: timer.createdAt?.toISOString?.() ?? new Date().toISOString(),
  updatedAt: timer.updatedAt?.toISOString?.() ?? new Date().toISOString(),
});

const createTimerHandler = async (
  req: Request,
  res: Response<TimerResponse | { msg: string }>,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const payload = req.body as CreateTimerRequest;
    const newTimer = createTimer({
      title: payload.title,
      description: payload.description,
      timer: payload.timer,
      user: req.user.id,
    });

    const timer = await newTimer.save();
    res.status(201).json(toTimerResponse(timer));
  } catch (err) {
    next(err);
  }
};

const listTimers = async (
  req: Request,
  res: Response<TimerListResponse | { msg: string }>,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const timers = await listTimersByUser(req.user.id);
    res.json(timers.map(toTimerResponse));
  } catch (err) {
    next(err);
  }
};

const getTimer = async (
  req: Request,
  res: Response<TimerResponse | { msg: string }>,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const timer = await findTimerById(req.params.id);

    if (!timer) {
      return res.status(404).json({ msg: 'Timer not found' });
    }

    if (timer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(toTimerResponse(timer));
  } catch (err) {
    next(err);
  }
};

const deleteTimerHandler = async (
  req: Request,
  res: Response<{ msg: string }>,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const timer = await findTimerById(req.params.id);

    if (!timer) {
      return res.status(404).json({ msg: 'Timer not found' });
    }

    if (timer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await deleteTimer(timer);
    res.json({ msg: 'Timer removed' });
  } catch (err) {
    next(err);
  }
};

const activateTimer = async (
  req: Request,
  res: Response<TimerResponse | { msg: string }>,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const timer = await findTimerById(req.params.id);

    if (!timer) {
      return res.status(404).json({ msg: 'Timer not found' });
    }

    if (timer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (timer.status === '1') {
      return res.status(400).json({ msg: 'Timer already activated' });
    }

    timer.status = '1';
    await timer.save();

    return res.json(toTimerResponse(timer));
  } catch (err) {
    next(err);
  }
};

export { createTimerHandler, listTimers, getTimer, deleteTimerHandler, activateTimer };
