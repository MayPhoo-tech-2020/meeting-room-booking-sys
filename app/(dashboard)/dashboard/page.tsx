"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Divider
} from "@mui/material";

import DashboardLayout from "../../../components/DashboardLayout";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PeopleIcon from "@mui/icons-material/People";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "USER";
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <DashboardLayout>
        <Typography>Please login first</Typography>
      </DashboardLayout>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "#E74C3C";
      case "OWNER":
        return "#F39C12";
      case "USER":
        return "#3498DB";
      default:
        return "#95A5A6";
    }
  };

  const getRoleBgColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "#FDE8E8";
      case "OWNER":
        return "#FFFBF5";
      case "USER":
        return "#E8F4FD";
      default:
        return "#F0F0F0";
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid #E8EDF2",
          mb: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: getRoleColor(user.role),
                fontSize: 24,
                fontWeight: 600
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#2C3E50",
                  fontSize: "1.5rem"
                }}
              >
                Welcome, {user.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 14, color: "#5A6C7D" }} />
                  <Typography sx={{ fontSize: "0.875rem", color: "#5A6C7D" }}>
                    {user.email}
                  </Typography>
                </Box>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    bgcolor: getRoleBgColor(user.role),
                    color: getRoleColor(user.role),
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Role Based Content */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        {/* ADMIN */}
        {user.role === "ADMIN" && (
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #E8EDF2",
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(25, 118, 210, 0.12)"
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <AdminPanelSettingsIcon sx={{ color: "#E74C3C", fontSize: 28 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#2C3E50" }}
                  >
                    Admin Management
                  </Typography>
                  <Chip
                    label="Full Access"
                    size="small"
                    sx={{
                      bgcolor: "#E74C3C",
                      color: "#FFFFFF",
                      fontSize: "0.6rem",
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PeopleIcon sx={{ fontSize: 16, color: "#1976D2" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#5A6C7D" }}>
                      Create, delete, and manage users
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BookmarkIcon sx={{ fontSize: 16, color: "#1976D2" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#5A6C7D" }}>
                      View and manage all bookings
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AdminPanelSettingsIcon sx={{ fontSize: 16, color: "#1976D2" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#5A6C7D" }}>
                      Change user roles
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => router.push("/users")}
                  sx={{
                    mt: 3,
                    bgcolor: "#1976D2",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#1565C0"
                    }
                  }}
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* OWNER */}
        {user.role === "OWNER" && (
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #E8EDF2",
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(25, 118, 210, 0.12)"
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <LeaderboardIcon sx={{ color: "#F39C12", fontSize: 28 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#2C3E50" }}
                  >
                    Owner Dashboard
                  </Typography>
                  <Chip
                    label="Manager"
                    size="small"
                    sx={{
                      bgcolor: "#F39C12",
                      color: "#FFFFFF",
                      fontSize: "0.6rem",
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BookmarkIcon sx={{ fontSize: 16, color: "#1976D2" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#5A6C7D" }}>
                      View all bookings
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 16, color: "#1976D2" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#5A6C7D" }}>
                      Delete any booking
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LeaderboardIcon sx={{ fontSize: 16, color: "#1976D2" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#5A6C7D" }}>
                      View booking summaries
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => router.push("/bookings")}
                  sx={{
                    mt: 3,
                    bgcolor: "#1976D2",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#1565C0"
                    }
                  }}
                >
                  View Bookings
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* USER */}
        {user.role === "USER" && (
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #E8EDF2",
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(25, 118, 210, 0.12)"
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <PersonOutlineOutlinedIcon sx={{ color: "#3498DB", fontSize: 28 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#2C3E50" }}
                  >
                    User Dashboard
                  </Typography>
                  <Chip
                    label="Basic"
                    size="small"
                    sx={{
                      bgcolor: "#3498DB",
                      color: "#FFFFFF",
                      fontSize: "0.6rem",
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BookmarkIcon sx={{ fontSize: 16, color: "#1976D2" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#5A6C7D" }}>
                      Create new bookings
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 16, color: "#1976D2" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#5A6C7D" }}>
                      Delete your own bookings only
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => router.push("/bookings")}
                  sx={{
                    mt: 3,
                    bgcolor: "#1976D2",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#1565C0"
                    }
                  }}
                >
                  Create Booking
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}