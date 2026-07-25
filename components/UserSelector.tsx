"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UserOutlined, 
  MailOutlined, 
  LoginOutlined,
  SafetyOutlined,
  CrownOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { getUsers } from "../services/userService";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "USER";
};

export default function UserSelector() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

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
    const user = users.find((item) => item.id === selectedUser);
    if (!user) return;

    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("selected-role", user.role);
    router.push("/dashboard");
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <SafetyOutlined style={{ color: "#E74C3C" }} />;
      case "OWNER":
        return <CrownOutlined style={{ color: "#F39C12" }} />;
      case "USER":
        return <TeamOutlined style={{ color: "#3498DB" }} />;
      default:
        return <UserOutlined />;
    }
  };

  const selectedUserData = users.find(u => u.id === selectedUser);

  return (
    <div className="max-w-xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-200">
            MB
          </div>
          <h1 className="text-2xl font-bold mt-3 text-gray-800">
            Meeting Room Booking
          </h1>
          <p className="text-gray-500 mt-1">
            Select a user to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-5 flex items-center gap-2">
            <span className="text-red-500">❌</span>
            {error}
          </div>
        )}

        {/* Role Permissions Cards */}
        <div className="mb-6">
          <h2 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
            <span className="text-blue-600">🎯</span>
            Role Permissions
          </h2>
          
          <div className="grid grid-cols-1 gap-2">
            {/* Admin */}
            <div className="border border-red-200 bg-red-50 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 font-semibold text-red-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                Admin
                <span className="text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded-full ml-auto">
                  Full Access
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-5">
                Manage users, roles, and all bookings.
              </p>
            </div>

            {/* Owner */}
            <div className="border border-orange-200 bg-orange-50 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 font-semibold text-orange-700">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                Owner
                <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full ml-auto">
                  Manager
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-5">
                Manage all bookings and view summaries.
              </p>
            </div>

            {/* User */}
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 font-semibold text-blue-700">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                User
                <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full ml-auto">
                  Basic
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-5">
                Create bookings and manage own bookings.
              </p>
            </div>
          </div>
        </div>

        {/* Login Dropdown */}
        <label className="block font-semibold mb-2 text-gray-700">
          Login as
        </label>

        <div className="relative w-full">
          <button
            type="button"
            disabled={loading}
            onClick={() => setOpen(!open)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-left flex justify-between items-center hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <span className="flex items-center gap-2">
              <UserOutlined className="text-gray-400" />
              {selectedUserData ? (
                <>
                  <span className="font-medium text-gray-700">
                    {selectedUserData.name}
                  </span>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: getRoleBgColor(selectedUserData.role),
                      color: getRoleColor(selectedUserData.role)
                    }}
                  >
                    {selectedUserData.role}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Select User</span>
              )}
            </span>
            <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
              ⌄
            </span>
          </button>

          {open && (
            <div className="absolute z-50 top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No users available
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user.id);
                      setOpen(false);
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        {user.name}
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: getRoleBgColor(user.role),
                            color: getRoleColor(user.role)
                          }}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MailOutlined style={{ fontSize: 12 }} />
                        {user.email}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Login Button */}
        <button
          disabled={!selectedUser || loading}
          onClick={handleLogin}
          className="w-full mt-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-200 hover:shadow-lg"
        >
          {loading ? (
            <>
              <span className="animate-spin">⟳</span>
              Loading...
            </>
          ) : (
            <>
              <LoginOutlined />
              Login
            </>
          )}
        </button>
      </div>
    </div>
  );
}