"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  alpha,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Menu,
  MenuItem,
  Checkbox
} from "@mui/material";

import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useRouter } from "next/navigation";
import { getUsers } from "../services/userService";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "USER";
};

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    void loadUsers();
  }, []);

  const handleLogin = () => {
    if (!selectedUser) return;

    localStorage.setItem("currentUser", JSON.stringify(selectedUser));
    localStorage.setItem("selected-role", selectedUser.role);
    router.push("/dashboard");
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setAnchorEl(null);
  };

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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Full Access";
      case "OWNER":
        return "Manager";
      case "USER":
        return "Basic";
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
        py: { xs: 2, sm: 4, md: 6 }
      }}
    >
      <Container 
        maxWidth={isMobile ? "xs" : "sm"}
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 }
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2.5, sm: 3.5, md: 4.5 },
            borderRadius: { xs: 3, sm: 4 },
            backgroundColor: "#FFFFFF",
            boxShadow: "0 20px 60px rgba(25, 118, 210, 0.15)",
            textAlign: "center"
          }}
        >
          {/* Logo/Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: { xs: 1.5, sm: 2 }
            }}
          >
            <Avatar
              sx={{
                width: { xs: 56, sm: 72, md: 80 },
                height: { xs: 56, sm: 72, md: 80 },
                bgcolor: "#1976D2",
                boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
                background: "linear-gradient(135deg, #1976D2, #1565C0)"
              }}
            >
              <MeetingRoomIcon sx={{ 
                fontSize: { xs: 28, sm: 36, md: 42 }, 
                color: "#FFFFFF" 
              }} />
            </Avatar>
          </Box>

          {/* Title */}
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 700,
              color: "#1976D2",
              mb: { xs: 0.5, sm: 1 },
              fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2rem" },
              letterSpacing: "-0.5px"
            }}
          >
            Meeting Room Booking
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#5A6C7D",
              mb: { xs: 2, sm: 2.5, md: 3 },
              fontWeight: 400,
              fontSize: { xs: "0.875rem", sm: "1rem" }
            }}
          >
            Book your meeting rooms quickly and easily
          </Typography>

          {/* Features - Compact & Attractive */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 1.5 },
              justifyContent: "center",
              alignItems: "center",
              mb: { xs: 2.5, sm: 3 },
              flexWrap: "wrap"
            }}
          >
            {[
              { icon: <EventNoteIcon />, label: "Easy Booking" },
              { icon: <PeopleIcon />, label: "Collaboration" },
              { icon: <CalendarTodayIcon />, label: "Availability" }
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  bgcolor: alpha("#1976D2", 0.05),
                  px: { xs: 1.5, sm: 2.5 },
                  py: { xs: 0.6, sm: 0.8 },
                  borderRadius: 2.5,
                  border: "1px solid",
                  borderColor: alpha("#1976D2", 0.08),
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "center", sm: "flex-start" },
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: alpha("#1976D2", 0.1),
                    transform: "translateY(-2px)"
                  }
                }}
              >
                {React.cloneElement(item.icon, { 
                  sx: { color: "#1976D2", fontSize: { xs: 16, sm: 18 } } 
                })}
                <Typography variant="caption" sx={{ 
                  color: "#2C3E50", 
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.75rem" }
                }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: { xs: 2.5, sm: 3 } }} />

          {/* User Selection - Clean & Attractive */}
          <Box sx={{ mt: { xs: 1, sm: 2 }, width: "100%" }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#5A6C7D",
                mb: { xs: 1.5, sm: 2 },
                fontWeight: 500,
                fontSize: { xs: "0.8rem", sm: "0.875rem" }
              }}
            >
              Select your account to continue
            </Typography>

            {/* Error */}
            {error && (
              <Box sx={{ 
                bgcolor: "#FDE8E8", 
                border: "1px solid #FECACA", 
                color: "#DC2626", 
                p: 2, 
                borderRadius: 2, 
                mb: 2,
                fontSize: "0.875rem"
              }}>
                ❌ {error}
              </Box>
            )}

            {/* Loading State */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress sx={{ color: "#1976D2" }} />
              </Box>
            ) : (
              <>
                {/* Dropdown Button */}
                <Box sx={{ position: "relative", width: "100%" }}>
                  <Box
                    onClick={handleClick}
                    sx={{
                      width: "100%",
                      p: { xs: 1.5, sm: 2 },
                      border: "2px solid",
                      borderColor: selectedUser ? "#1976D2" : "#E5E7EB",
                      borderRadius: 3,
                      backgroundColor: selectedUser ? "#F5F9FF" : "#FFFFFF",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#1976D2",
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)"
                      }
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {selectedUser ? (
                        <>
                          <Avatar
                            sx={{
                              width: { xs: 32, sm: 36 },
                              height: { xs: 32, sm: 36 },
                              bgcolor: getRoleColor(selectedUser.role),
                              fontSize: { xs: 12, sm: 14 },
                              fontWeight: 600
                            }}
                          >
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ textAlign: "left" }}>
                            <Typography sx={{ 
                              fontWeight: 600, 
                              color: "#1F2937",
                              fontSize: { xs: "0.875rem", sm: "1rem" }
                            }}>
                              {selectedUser.name}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  bgcolor: getRoleColor(selectedUser.role),
                                  display: "inline-block"
                                }}
                              />
                              <Typography sx={{ 
                                fontSize: { xs: "0.65rem", sm: "0.7rem" },
                                color: "#6B7280"
                              }}>
                                {selectedUser.role} • {getRoleLabel(selectedUser.role)}
                              </Typography>
                            </Box>
                          </Box>
                        </>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            sx={{
                              width: { xs: 32, sm: 36 },
                              height: { xs: 32, sm: 36 },
                              bgcolor: "#E5E7EB",
                              color: "#6B7280"
                            }}
                          >
                            <PeopleIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                          </Avatar>
                          <Typography sx={{ 
                            color: "#6B7280",
                            fontSize: { xs: "0.875rem", sm: "1rem" }
                          }}>
                            Select a user
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        color: "#6B7280",
                        transition: "transform 0.2s",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)"
                      }} 
                    />
                  </Box>

                  {/* Dropdown Menu */}
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    sx={{
                      "& .MuiPaper-root": {
                        mt: 1,
                        borderRadius: 3,
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                        maxHeight: 300,
                        width: "100%",
                        minWidth: { xs: "auto", sm: 400 },
                        overflow: "auto"
                      }
                    }}
                  >
                    {users.length === 0 ? (
                      <MenuItem disabled sx={{ justifyContent: "center", py: 3 }}>
                        <Typography sx={{ color: "#6B7280" }}>
                          No users available
                        </Typography>
                      </MenuItem>
                    ) : (
                      users.map((user) => (
                        <MenuItem
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          selected={selectedUser?.id === user.id}
                          sx={{
                            py: 1.5,
                            px: 2,
                            gap: 1.5,
                            "&:hover": {
                              bgcolor: "#EFF6FF"
                            },
                            "&.Mui-selected": {
                              bgcolor: "#E3F2FD",
                              "&:hover": {
                                bgcolor: "#E3F2FD"
                              }
                            }
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: getRoleColor(user.role),
                              fontSize: 13,
                              fontWeight: 600
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography sx={{ fontWeight: 600, color: "#1F2937" }}>
                                {user.name}
                              </Typography>
                              <Box
                                sx={{
                                  fontSize: "0.6rem",
                                  px: 1.2,
                                  py: 0.3,
                                  borderRadius: 1.5,
                                  fontWeight: 600,
                                  bgcolor: getRoleBgColor(user.role),
                                  color: getRoleColor(user.role)
                                }}
                              >
                                {user.role}
                              </Box>
                            </Box>
                            <Typography sx={{ fontSize: "0.75rem", color: "#6B7280" }}>
                              {user.email}
                            </Typography>
                          </Box>
                          {selectedUser?.id === user.id && (
                            <CheckCircleIcon sx={{ color: "#1976D2", fontSize: 18 }} />
                          )}
                        </MenuItem>
                      ))
                    )}
                  </Menu>
                </Box>

                {/* Login Button */}
                <Box
                  onClick={handleLogin}
                  sx={{
                    width: "100%",
                    mt: 2.5,
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    backgroundColor: selectedUser ? "#1976D2" : "#E5E7EB",
                    color: selectedUser ? "#FFFFFF" : "#9CA3AF",
                    fontWeight: 600,
                    textAlign: "center",
                    cursor: selectedUser ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: selectedUser ? "#1565C0" : "#E5E7EB",
                      boxShadow: selectedUser ? "0 4px 16px rgba(25, 118, 210, 0.3)" : "none",
                      transform: selectedUser ? "translateY(-2px)" : "none"
                    },
                    fontSize: { xs: "0.875rem", sm: "1rem" }
                  }}
                >
                  {selectedUser ? "Continue to Dashboard" : "Select a user to continue"}
                </Box>
              </>
            )}
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: { xs: 2.5, sm: 3 },
              color: "#B0B8C4",
              fontSize: { xs: "0.65rem", sm: "0.75rem" }
            }}
          >
            © {new Date().getFullYear()} Meeting Room Booking System
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}