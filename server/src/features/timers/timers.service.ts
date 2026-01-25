import Timer, { TimerDocument } from '../../models/timer.model';

const createTimer = ({
  title,
  description,
  timer,
  user,
}: {
  title: string;
  description: string;
  timer: string;
  user: string;
}) => new Timer({ title, description, timer, user });

const listTimersByUser = (userId: string) =>
  Timer.find({ user: userId }).sort({ createdAt: -1 });

const findTimerById = (id: string) => Timer.findById(id);

const deleteTimer = (timer: TimerDocument) => timer.deleteOne();

export { createTimer, listTimersByUser, findTimerById, deleteTimer };
