"use client";

import {
  Alert,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";

import { notification } from "antd";

import { useEffect, useState } from "react";

import BookingForm from "../../../components/BookingForm";
import BookingTable from "../../../components/BookingTable";
import DashboardLayout from "../../../components/DashboardLayout";

import {
  createBooking,
  deleteBooking,
  getBookings,
} from "../../../services/bookingService";

import type { Booking } from "../../../types/booking";

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

  if (errorMessage.toLowerCase().includes("overlap") || errorMessage.toLowerCase().includes("conflict")) {
    return "📅 Oops! You already have a booking at this time. Please choose a different time slot.";
  }

  if (errorMessage.toLowerCase().includes("startTime must be before endTime") || 
      errorMessage.toLowerCase().includes("before end time")) {
    return "⏰ The start time must be before the end time. Please adjust your booking times.";
  }

  if (errorMessage.toLowerCase().includes("not found")) {
    return "🔍 The booking you're looking for could not be found.";
  }

  if (errorMessage.toLowerCase().includes("permission") || errorMessage.toLowerCase().includes("authorized")) {
    return "🔒 You don't have permission to perform this action. Please contact your admin.";
  }

  if (errorMessage.toLowerCase().includes("required")) {
    return "⚠️ Please fill in all required fields before submitting.";
  }

  if (status === 400) return "⚠️ Please check your input and try again.";
  if (status === 401) return "🔒 Please login to continue.";
  if (status === 403) return "🔒 You don't have permission to do this.";
  if (status === 404) return "🔍 The item you're looking for could not be found.";
  if (status === 409) return "📅 This booking conflicts with another booking. Please choose a different time.";
  if (status === 500) return "❌ Something went wrong on our end. Please try again later.";

  return "❌ Something went wrong. Please try again or contact support if the issue persists.";
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      setError(message);

      notification.error({
        title: "❌ Failed to load bookings",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    void loadBookings();
  }, []);

  const handleCreate = async (values: {
    userId: string;
    startTime: string;
    endTime: string;
  }) => {
    try {
      if (!user) {
        notification.warning({
          title: "⚠️ Not Logged In",
          description: "Please login to create a booking.",
        });
        return;
      }

      await createBooking({
        userId: user.id,
        startTime: values.startTime,
        endTime: values.endTime,
      });

      notification.success({
        title: "✅ Booking Created",
        description: "Your booking has been successfully created.",
      });

      await loadBookings();
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);

      notification.error({
        title: "❌ Booking Creation Failed",
        description: message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBooking(id);

      notification.success({
        title: "✅ Booking Deleted",
        description: "The booking has been successfully removed.",
      });

      await loadBookings();
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);

      notification.error({
        title: "❌ Delete Failed",
        description: message,
      });
    }
  };

  if (!user) {
    return (
      <DashboardLayout title="Bookings">
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          🔒 Please login to access bookings.
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Bookings">
      <Stack spacing={3}>
        {/* Page Header */}
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#2C3E50" }}>
          Bookings Management
        </Typography>
        <Typography variant="body1" sx={{ color: "#5A6C7D", mb: 2 }}>
          Create and manage meeting room bookings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Create Booking Form */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#2C3E50" }}>
              📅 Create New Booking
            </Typography>
            <BookingForm
              loading={loading}
              onCreate={handleCreate}
            />
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#2C3E50" }}>
              📋 All Bookings
            </Typography>

            <BookingTable
              bookings={bookings}
              loading={loading}
              currentRole={user.role}
              currentUserId={user.id}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}