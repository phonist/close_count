export interface CreateTimerRequest {
  title: string;
  description: string;
  timer: string;
}

export interface TimerResponse {
  _id: string;
  user: string;
  title: string;
  description: string;
  timer: string;
  status: '0' | '1';
  createdAt: string;
  updatedAt: string;
}

export type TimerListResponse = TimerResponse[];
