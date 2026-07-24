import type { User } from './user';

export interface Booking {
  id: string;
  title?: string;
  userId: string;
  startTime: Date | string;
  endTime: Date | string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
}
