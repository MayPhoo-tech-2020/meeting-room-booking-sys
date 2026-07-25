"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  alpha,
  Card,
  CardContent,
  Chip,
  Divider
} from "@mui/material";

import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonIcon from "@mui/icons-material/Person";

import UserSelector from "../components/UserSelector";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
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
              mb: 3
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#1976D2",
                boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)"
              }}
            >
              <MeetingRoomIcon sx={{ fontSize: 44, color: "#FFFFFF" }} />
            </Avatar>
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#1976D2",
              mb: 1,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }
            }}
          >
            Meeting Room Booking
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#5A6C7D",
              mb: 3,
              fontWeight: 400,
              fontSize: { xs: "1rem", sm: "1.1rem" }
            }}
          >
            Book your meeting rooms quickly and easily
          </Typography>

          {/* Features Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 4,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: alpha("#1976D2", 0.05),
                px: 2,
                py: 1,
                borderRadius: 2,
                border: "1px solid",
                borderColor: alpha("#1976D2", 0.1)
              }}
            >
              <EventNoteIcon sx={{ color: "#1976D2", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#2C3E50" }}>
                Easy Booking
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: alpha("#1976D2", 0.05),
                px: 2,
                py: 1,
                borderRadius: 2,
                border: "1px solid",
                borderColor: alpha("#1976D2", 0.1)
              }}
            >
              <PeopleIcon sx={{ color: "#1976D2", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#2C3E50" }}>
                Team Collaboration
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: alpha("#1976D2", 0.05),
                px: 2,
                py: 1,
                borderRadius: 2,
                border: "1px solid",
                borderColor: alpha("#1976D2", 0.1)
              }}
            >
              <CalendarTodayIcon sx={{ color: "#1976D2", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#2C3E50" }}>
                Real-time Availability
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Divider sx={{ mb: 4 }} />

          {/* Role Permissions Cards */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 4,
              justifyContent: "center",
              alignItems: "stretch"
            }}
          >
            {/* Admin Card */}
            <Card
              sx={{
                flex: 1,
                borderRadius: 3,
                border: "2px solid",
                borderColor: "#FDE8E8",
                backgroundColor: "#FFF5F5",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(231, 76, 60, 0.15)"
                }
              }}
            >
              <CardContent sx={{ textAlign: "left", p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <AdminPanelSettingsIcon sx={{ color: "#E74C3C", fontSize: 24 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#E74C3C" }}>
                    Admin
                  </Typography>
                  <Chip
                    label="Full Access"
                    size="small"
                    sx={{
                      bgcolor: "#E74C3C",
                      color: "#FFFFFF",
                      fontSize: 9,
                      fontWeight: 600,
                      height: 20,
                      "& .MuiChip-label": { px: 1 }
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "#5A6C7D", ml: 4 }}>
                  Manage users, roles, and all bookings.
                </Typography>
              </CardContent>
            </Card>

            {/* Owner Card */}
            <Card
              sx={{
                flex: 1,
                borderRadius: 3,
                border: "2px solid",
                borderColor: "#FFF3E0",
                backgroundColor: "#FFFBF5",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(255, 152, 0, 0.15)"
                }
              }}
            >
              <CardContent sx={{ textAlign: "left", p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <LeaderboardIcon sx={{ color: "#F39C12", fontSize: 24 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#F39C12" }}>
                    Owner
                  </Typography>
                  <Chip
                    label="Manager"
                    size="small"
                    sx={{
                      bgcolor: "#F39C12",
                      color: "#FFFFFF",
                      fontSize: 9,
                      fontWeight: 600,
                      height: 20,
                      "& .MuiChip-label": { px: 1 }
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "#5A6C7D", ml: 4 }}>
                  Manage all bookings and view summaries.
                </Typography>
              </CardContent>
            </Card>

            {/* User Card */}
            <Card
              sx={{
                flex: 1,
                borderRadius: 3,
                border: "2px solid",
                borderColor: "#E3F2FD",
                backgroundColor: "#F5F9FF",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(25, 118, 210, 0.15)"
                }
              }}
            >
              <CardContent sx={{ textAlign: "left", p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <PersonIcon sx={{ color: "#3498DB", fontSize: 24 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#3498DB" }}>
                    User
                  </Typography>
                  <Chip
                    label="Basic"
                    size="small"
                    sx={{
                      bgcolor: "#3498DB",
                      color: "#FFFFFF",
                      fontSize: 9,
                      fontWeight: 600,
                      height: 20,
                      "& .MuiChip-label": { px: 1 }
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "#5A6C7D", ml: 4 }}>
                  Create bookings and manage own bookings.
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Divider */}
          <Divider sx={{ mb: 4 }} />

          {/* User Selector */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#5A6C7D",
                mb: 2,
                fontWeight: 500
              }}
            >
              Select your account to continue
            </Typography>
            <UserSelector />
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 4,
              color: "#95A5A6"
            }}
          >
            © {new Date().getFullYear()} Meeting Room Booking System
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}