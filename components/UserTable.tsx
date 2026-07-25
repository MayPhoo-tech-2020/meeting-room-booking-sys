"use client";

import { Button, Select, Table, Tag, Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import type { User } from "../types/user";

const { confirm } = Modal;

interface UserTableProps {
  users: User[];
  loading?: boolean;
  currentRole: string;
  onDelete: (id: string) => Promise<void> | void;
  onRoleChange: (id: string, role: User["role"]) => Promise<void> | void;
}

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "OWNER", label: "Owner" },
  { value: "USER", label: "User" }
];

export default function UserTable({
  users,
  loading = false,
  currentRole,
  onDelete,
  onRoleChange
}: UserTableProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
        return "#E74C3C";
      case "OWNER":
        return "#F39C12";
      case "USER":
        return "#3498DB";
      default:
        return "#8C8C8C";
    }
  };

  const getRoleBgColor = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
        return "#FFF5F5";
      case "OWNER":
        return "#FFFBF5";
      case "USER":
        return "#F5F9FF";
      default:
        return "#F5F5F5";
    }
  };

  const handleDelete = (id: string, userName: string) => {
    // Prevent double clicks
    if (deletingId === id) return;

    confirm({
      title: "Delete User",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete user "${userName}"? This will also delete all their bookings.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setDeletingId(id);
        try {
          await onDelete(id);
        } finally {
          setDeletingId(null);
        }
      },
      onCancel: () => {
        // Do nothing
      }
    });
  };

  const handleRoleChange = async (id: string, role: User["role"]) => {
    if (changingRoleId === id) return;
    setChangingRoleId(id);
    try {
      await onRoleChange(id, role);
    } finally {
      setChangingRoleId(null);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
      render: (value: string) => (
        <span className="font-semibold text-gray-800">{value}</span>
      )
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (value: string) => <span className="text-gray-600">{value}</span>
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 140,
      render: (role: User["role"]) => (
        <Tag
          color={getRoleColor(role)}
          style={{
            backgroundColor: getRoleBgColor(role),
            border: `1px solid ${getRoleColor(role)}`,
            color: getRoleColor(role),
            fontWeight: 600,
            borderRadius: "4px",
            padding: "2px 12px",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          {role}
        </Tag>
      )
    },
    {
      title: "Bookings",
      dataIndex: ["_count", "bookings"],
      key: "bookings",
      width: 100,
      align: "center",
      render: (count: number) => (
        <span className="font-semibold text-gray-700">
          {count ?? 0}
        </span>
      )
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (value: string) =>
        isMounted ? new Date(value).toLocaleDateString() : "-"
    },
    ...(currentRole === "ADMIN"
      ? [
          {
            title: "Actions",
            key: "actions",
            width: 260,
            render: (_: unknown, record: User) => (
              <div className="flex gap-2 items-center">
                <Select
                  value={record.role}
                  options={roleOptions}
                  style={{
                    width: 120,
                    borderRadius: "6px"
                  }}
                  onChange={(value) =>
                    handleRoleChange(record.id, value as User["role"])
                  }
                  disabled={changingRoleId === record.id}
                  loading={changingRoleId === record.id}
                />
                <Button
                  danger
                  loading={deletingId === record.id}
                  disabled={deletingId === record.id}
                  onClick={() => handleDelete(record.id, record.name)}
                  style={{
                    borderRadius: "6px",
                    fontWeight: 500,
                    fontSize: "13px",
                    border: "1px solid #FF4D4F",
                    color: "#FF4D4F",
                    backgroundColor: "transparent",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FF4D4F";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#FF4D4F";
                  }}
                >
                  {deletingId === record.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            )
          }
        ]
      : [])
  ];

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px"
          }}
        >
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          style: {
            marginTop: "16px"
          }
        }}
        bordered={false}
        className="custom-user-table"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          overflow: "hidden"
        }}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "user-row-even" : "user-row-odd"
        }
      />

      {/* Styles */}
      <style jsx>{`
        :global(.custom-user-table .ant-table) {
          border-radius: 8px;
          overflow: hidden;
        }
        :global(.custom-user-table .ant-table-thead > tr > th) {
          background: #F0F4F8 !important;
          color: #2C3E50 !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border-bottom: 2px solid #E8EDF2 !important;
        }
        :global(.custom-user-table .user-row-even) {
          background: #FFFFFF !important;
        }
        :global(.custom-user-table .user-row-odd) {
          background: #FAFBFC !important;
        }
        :global(.custom-user-table .ant-table-tbody > tr:hover > td) {
          background: #E3F2FD !important;
        }
        :global(.custom-user-table .ant-table-tbody > tr > td) {
          border-bottom: 1px solid #F0F4F8 !important;
          padding: 12px 16px !important;
        }
        :global(.custom-user-table .ant-pagination-item-active) {
          border-color: #1976D2 !important;
        }
        :global(.custom-user-table .ant-pagination-item-active a) {
          color: #1976D2 !important;
        }
        :global(.custom-user-table .ant-select-selector) {
          border-radius: 6px !important;
          border-color: #D9D9D9 !important;
        }
        :global(.custom-user-table .ant-select-selector:hover) {
          border-color: #1976D2 !important;
        }
        :global(.custom-user-table .ant-select-focused .ant-select-selector) {
          border-color: #1976D2 !important;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2) !important;
        }
      `}</style>
    </div>
  );
}