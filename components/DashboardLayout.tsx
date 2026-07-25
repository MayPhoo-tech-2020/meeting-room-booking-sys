"use client";

import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Avatar,
  Paper,
  Divider,
  CircularProgress
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const drawerWidth = 260;

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon />,
    showFor: "ALL" as const
  },
  {
    label: "User Management",
    href: "/users",
    icon: <AdminPanelSettingsIcon />,
    showFor: "ADMIN" as const
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: <EventNoteIcon />,
    showFor: "ALL" as const
  }
];

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

type CurrentUser = {
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "USER";
};

export default function DashboardLayout({
  children,
  title = "Meeting Room Booking"
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("currentUser");
    if (data) {
      setUser(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("selected-role");
    router.push("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "#E74C3C";
      case "OWNER":
        return "#2ECC71";
      case "USER":
        return "#3498DB";
      default:
        return "#95A5A6";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "#FDE8E8";
      case "OWNER":
        return "#E8F8F0";
      case "USER":
        return "#E8F4FD";
      default:
        return "#F0F0F0";
    }
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.showFor === "ALL") return true;
    if (item.showFor === "ADMIN" && user?.role === "ADMIN") return true;
    return false;
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F5F7FA" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#FFFFFF",
            borderRight: "1px solid #E8EDF2",
            display: "flex",
            flexDirection: "column",
            boxShadow: "2px 0 12px rgba(0,0,0,0.05)"
          }
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: "1px solid #E8EDF2",
            bgcolor: "#FFFFFF"
          }}
        >
          <MeetingRoomIcon sx={{ color: "#1976D2", fontSize: 32 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1976D2",
              fontSize: 18,
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, overflow: "auto", mt: 2 }}>
          <List sx={{ px: 1.5 }}>
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              return (
                <ListItemButton
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    py: 1.2,
                    backgroundColor: isActive
                      ? "#E3F2FD"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isActive ? "#E3F2FD" : "#F5F8FA"
                    },
                    "& .MuiListItemIcon-root": {
                      color: isActive ? "#1976D2" : "#5A6C7D",
                      minWidth: 40
                    },
                    "& .MuiListItemText-primary": {
                      color: isActive ? "#1976D2" : "#2C3E50",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: 14
                    }
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {isActive && (
                    <Box
                      sx={{
                        width: 4,
                        height: 28,
                        bgcolor: "#1976D2",
                        borderRadius: 2
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* User Profile Section */}
        {user && (
          <Box sx={{ p: 2, borderTop: "1px solid #E8EDF2", bgcolor: "#FAFBFC" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "#FFFFFF",
                borderRadius: 2,
                border: "1px solid #E8EDF2"
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: getRoleColor(user.role),
                    width: 44,
                    height: 44,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#FFFFFF"
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: "#2C3E50",
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-block",
                      bgcolor: getRoleBadgeColor(user.role),
                      color: getRoleColor(user.role),
                      fontSize: 10,
                      fontWeight: 600,
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 1,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      mt: 0.5
                    }}
                  >
                    {user.role}
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{
                  color: "#5A6C7D",
                  borderColor: "#E8EDF2",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#E74C3C",
                    color: "#E74C3C",
                    backgroundColor: "#FDE8E8"
                  }
                }}
              >
                Logout
              </Button>
            </Paper>
          </Box>
        )}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: "auto",
          bgcolor: "#F5F7FA",
          minHeight: "100vh"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}