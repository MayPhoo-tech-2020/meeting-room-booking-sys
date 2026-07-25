import api, {
  getAuthHeaders,
  getStoredRole,
} from "../lib/api";

import type { User } from "../types/user";

const normalizeUsers = (
  payload: unknown
): User[] => {
  const data =
    (payload as {
      data?: unknown
    } | undefined)?.data;

  const list =
    Array.isArray(data)
      ? data
      : Array.isArray(payload)
        ? payload
        : [];

  return (
    list as Array<Partial<User>>
  ).map((user) => ({
    id:
      user.id
      ??
      "",
    name:
      user.name
      ??
      "",
    email:
      user.email
      ??
      "",
    role:
      (user.role as User["role"])
      ??
      "USER",
    createdAt:
      user.createdAt
      ??
      new Date(),
    updatedAt:
      user.updatedAt
      ??
      new Date(),
    _count:
      user._count,
  }));
};

export const createUser = async (
  user: Omit<
    User,
    "id" |
    "createdAt" |
    "updatedAt"
  >
): Promise<User> => {
  const response =
    await api.post(
      "/api/users",
      user,
      {
        headers:
          getAuthHeaders(
            getStoredRole()
          ),
      }
    );

  return (
    response.data?.data
    ??
    response.data
  ) as User;
};

export const updateUserRole = async (
  id: string,
  role: User["role"]
): Promise<User> => {
  const response =
    await api.patch(
      `/api/users/${id}`,
      {
        role,
      },
      {
        headers:
          getAuthHeaders(
            getStoredRole()
          ),
      }
    );

  return (
    response.data?.data
    ??
    response.data
  ) as User;
};

export const deleteUser = async (
  id: string
): Promise<{ message: string; deletedBookingsCount?: number }> => {
  const response =
    await api.delete(
      `/api/users/${id}`,
      {
        headers:
          getAuthHeaders(
            getStoredRole()
          ),
      }
    );

  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response =
    await api.get(
      "/api/users"
    );

  return normalizeUsers(
    response.data
  );
};