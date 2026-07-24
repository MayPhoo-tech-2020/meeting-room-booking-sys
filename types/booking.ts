import type { User } from './user';

export interface Room {
  id: string;
  name: string;
  description?: string | null;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  title?: string;
  userId: string;
  roomId: string;
  startTime: Date | string;
  endTime: Date | string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
  room?: Room;
}
