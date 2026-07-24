import type { User } from "./user";

export interface Booking {
  id: string;

  userId: string;

  startTime: Date | string;

  endTime: Date | string;

  user?: User;

  createdAt?: Date | string;

  updatedAt?: Date | string;
}