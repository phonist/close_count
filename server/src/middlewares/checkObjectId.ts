import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const checkObjectId = (idToCheck: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck])) {
    return res.status(400).json({ msg: 'Invalid ID' });
  }
  return next();
};

export default checkObjectId;
