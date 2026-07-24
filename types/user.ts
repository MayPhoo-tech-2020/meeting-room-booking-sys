export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OWNER' | 'USER';
  createdAt: Date | string;
  updatedAt: Date | string;
}
