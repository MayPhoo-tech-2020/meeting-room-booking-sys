"use client";

import { Button, Table, Tag, Spin, Modal, Card, Row, Col, Statistic, Collapse, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ExclamationCircleOutlined, UserOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";

import type { Booking } from "../types/booking";

const { confirm } = Modal;

interface BookingTableProps {
  bookings: Booking[];
  loading?: boolean;
  currentRole: string;
  currentUserId?: string;
  onDelete: (id: string) => Promise<void> | void;
}

// ✅ Helper function for user-friendly error messages
const getUserFriendlyErrorMessage = (err: any): string => {
  const errorData = err?.response?.data;
  const errorMessage = errorData?.error || errorData?.message || err?.message || "";
  const status = err?.response?.status;

  if (errorMessage.toLowerCase().includes("not found")) {
    return "🔍 This booking has already been deleted or doesn't exist.";
  }

  if (errorMessage.toLowerCase().includes("permission") || errorMessage.toLowerCase().includes("authorized")) {
    return "🔒 You don't have permission to delete this booking.";
  }

  if (errorMessage.toLowerCase().includes("only your own")) {
    return "🔒 You can only delete your own bookings.";
  }

  if (status === 400) return "⚠️ Please check your input and try again.";
  if (status === 401) return "🔒 Please login to continue.";
  if (status === 403) return "🔒 You don't have permission to do this.";
  if (status === 404) return "🔍 The booking you're looking for could not be found.";
  if (status === 500) return "❌ Something went wrong on our end. Please try again later.";

  return "❌ Something went wrong. Please try again or contact support if the issue persists.";
};

export default function BookingTable({
  bookings,
  loading = false,
  currentRole,
  currentUserId,
  onDelete
}: BookingTableProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = bookings.length;

    // Group bookings by user
    const bookingsByUser: { [key: string]: { user: any; bookings: Booking[] } } = {};
    bookings.forEach(booking => {
      const userId = booking.user?.id || "unknown";
      if (!bookingsByUser[userId]) {
        bookingsByUser[userId] = {
          user: booking.user || { name: "Unknown User", email: "-" },
          bookings: []
        };
      }
      bookingsByUser[userId].bookings.push(booking);
    });

    // Sort users by booking count (descending)
    const sortedUsers = Object.values(bookingsByUser).sort((a, b) => b.bookings.length - a.bookings.length);

    return {
      total,
      bookingsByUser: sortedUsers,
      totalUsers: sortedUsers.length
    };
  }, [bookings]);

  const canDelete = (booking: Booking) => {
    if (currentRole === "ADMIN" || currentRole === "OWNER") {
      return true;
    }

    if (currentRole === "USER" && booking.userId === currentUserId) {
      return true;
    }

    return false;
  };

  const handleDelete = (id: string) => {
    if (deletingId === id) return;

    confirm({
      title: "Delete Booking",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this booking? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setDeletingId(id);
        try {
          await onDelete(id);
          notification.success({
            message: "✅ Booking Deleted",
            description: "The booking has been successfully removed.",
          });
        } catch (err: any) {
          notification.error({
            message: "❌ Delete Failed",
            description: getUserFriendlyErrorMessage(err),
          });
        } finally {
          setDeletingId(null);
        }
      },
      onCancel: () => {}
    });
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

  const columns: ColumnsType<Booking> = [
    {
      title: "Created By",
      key: "createdBy",
      width: 200,
      render: (_: unknown, record: Booking) => (
        <div className="flex flex-col">
          <div className="font-semibold text-gray-800">
            {record.user?.name || "Unknown User"}
          </div>
          <div className="text-gray-400 text-xs">
            {record.user?.email || "-"}
          </div>
        </div>
      )
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      width: 180,
      render: (value: string | Date) =>
        isMounted ? new Date(value).toLocaleString() : "-"
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      width: 180,
      render: (value: string | Date) =>
        isMounted ? new Date(value).toLocaleString() : "-"
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_: unknown, record: Booking) =>
        canDelete(record) ? (
          <Button
            danger
            size="middle"
            loading={deletingId === record.id}
            disabled={deletingId === record.id}
            onClick={() => handleDelete(record.id)}
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
        ) : (
          <span className="text-gray-400 text-sm font-medium">
            No permission
          </span>
        )
    }
  ];

  // Build collapse items
  const collapseItems = summaryStats.bookingsByUser.map((item, index) => ({
    key: index,
    label: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: getRoleColor(item.user?.role || "USER"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: 14
            }}
          >
            {item.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#1F2937" }}>
              {item.user?.name || "Unknown User"}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              {item.user?.email || "-"} • {item.bookings.length} booking{item.bookings.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
        <Tag color={getRoleColor(item.user?.role || "USER")}>
          {item.user?.role || "USER"}
        </Tag>
      </div>
    ),
    children: (
      <Table
        rowKey="id"
        columns={[
          {
            title: "Start Time",
            dataIndex: "startTime",
            render: (value: string | Date) =>
              isMounted ? new Date(value).toLocaleString() : "-"
          },
          {
            title: "End Time",
            dataIndex: "endTime",
            render: (value: string | Date) =>
              isMounted ? new Date(value).toLocaleString() : "-"
          },
          {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: unknown, record: Booking) =>
              canDelete(record) ? (
                <Button
                  danger
                  size="small"
                  loading={deletingId === record.id}
                  disabled={deletingId === record.id}
                  onClick={() => handleDelete(record.id)}
                  style={{
                    borderRadius: "4px",
                    fontWeight: 500,
                    fontSize: "12px",
                    border: "1px solid #FF4D4F",
                    color: "#FF4D4F",
                    backgroundColor: "transparent"
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
                  Delete
                </Button>
              ) : (
                <span className="text-gray-400 text-sm font-medium">
                  No permission
                </span>
              )
          }
        ]}
        dataSource={item.bookings}
        pagination={false}
        size="small"
      />
    )
  }));

  return (
    <div>
      {/* Summary Cards - Only for ADMIN and OWNER */}
      {(currentRole === "ADMIN" || currentRole === "OWNER") && (
        <div style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Card 
                variant="borderless" 
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <Statistic
                  title="Total Bookings"
                  value={summaryStats.total}
                  prefix={<CalendarOutlined style={{ color: "#1976D2" }} />}
                  styles={{
                    content: { color: "#1976D2" }
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card 
                variant="borderless" 
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <Statistic
                  title="Total Users"
                  value={summaryStats.totalUsers}
                  prefix={<UserOutlined style={{ color: "#F39C12" }} />}
                  styles={{
                    content: { color: "#F39C12" }
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card 
                variant="borderless" 
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <Statistic
                  title="Avg Bookings per User"
                  value={summaryStats.totalUsers > 0 ? (summaryStats.total / summaryStats.totalUsers).toFixed(1) : 0}
                  prefix={<ClockCircleOutlined style={{ color: "#1976D2" }} />}
                  styles={{
                    content: { color: "#1976D2" }
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* Bookings Grouped by User - Only for ADMIN and OWNER */}
          <Card
            title="Bookings by User"
            variant="borderless"
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginTop: 16 }}
          >
            {summaryStats.bookingsByUser.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#9CA3AF" }}>
                No bookings found
              </div>
            ) : (
              <Collapse accordion items={collapseItems} />
            )}
          </Card>
        </div>
      )}

      {/* All Bookings Table */}
      <div className="relative">
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
            <Spin size="large" description="Loading..." />
          </div>
        )}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={bookings}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            style: {
              marginTop: "16px"
            }
          }}
          bordered={false}
          className="custom-table"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            overflow: "hidden"
          }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-even" : "table-row-odd"
          }
        />

        <style jsx>{`
          :global(.custom-table .ant-table) {
            border-radius: 8px;
            overflow: hidden;
          }
          :global(.custom-table .ant-table-thead > tr > th) {
            background: #F0F4F8 !important;
            color: #2C3E50 !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            border-bottom: 2px solid #E8EDF2 !important;
          }
          :global(.custom-table .table-row-even) {
            background: #FFFFFF !important;
          }
          :global(.custom-table .table-row-odd) {
            background: #FAFBFC !important;
          }
          :global(.custom-table .ant-table-tbody > tr:hover > td) {
            background: #E3F2FD !important;
          }
          :global(.custom-table .ant-table-tbody > tr > td) {
            border-bottom: 1px solid #F0F4F8 !important;
            padding: 12px 16px !important;
          }
          :global(.custom-table .ant-pagination-item-active) {
            border-color: #1976D2 !important;
          }
          :global(.custom-table .ant-pagination-item-active a) {
            color: #1976D2 !important;
          }
          :global(.ant-collapse) {
            border-radius: 8px !important;
            border: 1px solid #E8EDF2 !important;
          }
          :global(.ant-collapse-header) {
            padding: 12px 16px !important;
            display: flex !important;
            align-items: center !important;
          }
          :global(.ant-collapse-header:hover) {
            background: #F5F8FA !important;
          }
          :global(.ant-collapse-content-box) {
            padding: 16px !important;
          }
        `}</style>
      </div>
    </div>
  );
}