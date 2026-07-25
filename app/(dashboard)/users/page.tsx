"use client";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";

import { notification } from "antd";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import DashboardLayout from "../../../components/DashboardLayout";
import UserForm from "../../../components/UserForm";
import UserTable from "../../../components/UserTable";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUserRole,
} from "../../../services/userService";

import type { User } from "../../../types/user";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "USER";
};

// ✅ Helper function for user-friendly error messages
const getUserFriendlyErrorMessage = (err: any): string => {
  const errorData = err?.response?.data;
  const errorMessage = errorData?.error || errorData?.message || err?.message || "";
  const status = err?.response?.status;

  // User creation errors
  if (errorMessage.toLowerCase().includes("already exists") || errorMessage.toLowerCase().includes("duplicate")) {
    return "📧 This email is already registered. Please use a different email address.";
  }

  if (errorMessage.toLowerCase().includes("valid email")) {
    return "📧 Please enter a valid email address.";
  }

  // User deletion errors
  if (errorMessage.toLowerCase().includes("not found")) {
    return "🔍 This user has already been deleted or doesn't exist.";
  }

  if (errorMessage.toLowerCase().includes("permission") || errorMessage.toLowerCase().includes("authorized")) {
    return "🔒 You don't have permission to perform this action. Please contact your admin.";
  }

  if (errorMessage.toLowerCase().includes("last admin")) {
    return "⚠️ Cannot delete the last admin user. Please promote another user to admin first.";
  }

  if (errorMessage.toLowerCase().includes("your own")) {
    return "⚠️ You cannot delete your own account.";
  }

  // Role change errors
  if (errorMessage.toLowerCase().includes("role") && errorMessage.toLowerCase().includes("not found")) {
    return "🔍 User not found. Please refresh and try again.";
  }

  if (errorMessage.toLowerCase().includes("required")) {
    return "⚠️ Please fill in all required fields before submitting.";
  }

  // Status code based messages
  if (status === 400) return "⚠️ Please check your input and try again.";
  if (status === 401) return "🔒 Please login to continue.";
  if (status === 403) return "🔒 You don't have permission to do this.";
  if (status === 404) return "🔍 The user you're looking for could not be found.";
  if (status === 409) return "⚠️ This action conflicts with existing data.";
  if (status === 500) return "❌ Something went wrong on our end. Please try again later.";

  // Default fallback
  return "❌ Something went wrong. Please try again or contact support if the issue persists.";
};

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      // ✅ User-friendly error message
      const message = getUserFriendlyErrorMessage(err);
      setError(message);
      notification.error({
        title: "❌ Failed to load users",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);

      if (user.role !== "ADMIN") {
        notification.warning({
          title: "⚠️ Access Denied",
          description: "You don't have permission to access this page.",
        });
        router.push("/dashboard");
        return;
      }
    }

    void loadUsers();
  }, []);

  const handleCreate = async (values: {
    name: string;
    email: string;
    role: string;
  }) => {
    try {
      await createUser({
        name: values.name,
        email: values.email,
        role: values.role as User["role"],
      });

      notification.success({
        title: "✅ User Created",
        description: `User "${values.name}" has been successfully created.`,
      });

      await loadUsers();
    } catch (err) {
      // ✅ User-friendly error message
      const message = getUserFriendlyErrorMessage(err);
      notification.error({
        title: "❌ User Creation Failed",
        description: message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const userToDelete = users.find(u => u.id === id);
      await deleteUser(id);

      notification.success({
        title: "✅ User Deleted",
        description: userToDelete 
          ? `User "${userToDelete.name}" has been successfully deleted.`
          : "User has been successfully deleted.",
      });

      await loadUsers();
    } catch (err) {
      // ✅ User-friendly error message
      const message = getUserFriendlyErrorMessage(err);
      notification.error({
        title: "❌ Delete Failed",
        description: message,
      });
    }
  };

  const handleRoleChange = async (id: string, nextRole: User["role"]) => {
    try {
      const userToUpdate = users.find(u => u.id === id);
      await updateUserRole(id, nextRole);

      notification.success({
        title: "✅ Role Updated",
        description: userToUpdate 
          ? `User "${userToUpdate.name}" role has been changed to ${nextRole}.`
          : `User role has been successfully changed to ${nextRole}.`,
      });

      await loadUsers();
    } catch (err) {
      // ✅ User-friendly error message
      const message = getUserFriendlyErrorMessage(err);
      notification.error({
        title: "❌ Role Update Failed",
        description: message,
      });
    }
  };

  if (!currentUser) {
    return (
      <DashboardLayout title="User Management">
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          🔒 Checking permission...
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Management">
      <Stack spacing={3}>
        {/* Page Header */}
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#2C3E50" }}>
          👥 User Management
        </Typography>
        <Typography variant="body1" sx={{ color: "#5A6C7D", mb: 2 }}>
          Manage users, roles, and permissions
        </Typography>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Create User Form */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#2C3E50" }}>
              ➕ Create New User
            </Typography>
            <UserForm
              loading={loading}
              onCreate={handleCreate}
            />
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#2C3E50" }}>
                📋 All Users
              </Typography>
              <Button
                variant="contained"
                onClick={() => void loadUsers()}
                sx={{
                  backgroundColor: "#1976D2",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#1565C0"
                  }
                }}
              >
                🔄 Refresh
              </Button>
            </Stack>

            <UserTable
              users={users}
              loading={loading}
              currentRole={currentUser.role}
              onDelete={handleDelete}
              onRoleChange={handleRoleChange}
            />
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}