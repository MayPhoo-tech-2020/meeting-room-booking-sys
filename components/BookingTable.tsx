"use client";

import { Button, Table, Tag, Spin, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

import type { Booking } from "../types/booking";

const { confirm } = Modal;

interface BookingTableProps {
  bookings: Booking[];
  loading?: boolean;
  currentRole: string;
  currentUserId?: string;
  onDelete: (id: string) => Promise<void> | void;
}

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

  const canDelete = (booking: Booking) => {
    if (currentRole === "ADMIN" || currentRole === "OWNER") {
      return true;
    }

    if (currentRole === "USER" && booking.userId === currentUserId) {
      return true;
    }

    return false;
  };

  const handleDelete = (id: string, bookingName: string) => {
    // Prevent double clicks
    if (deletingId === id) return;

    confirm({
      title: "Delete Booking",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete this booking?`,
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

  const getStatusColor = (value: string) => {
    switch (value) {
      case "APPROVED":
        return "#52C41A";
      case "REJECTED":
        return "#FF4D4F";
      case "PENDING":
        return "#FAAD14";
      default:
        return "#8C8C8C";
    }
  };

  const getStatusBgColor = (value: string) => {
    switch (value) {
      case "APPROVED":
        return "#F6FFED";
      case "REJECTED":
        return "#FFF1F0";
      case "PENDING":
        return "#FFFBE6";
      default:
        return "#F5F5F5";
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
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (value: string) => (
        <Tag
          color={getStatusColor(value)}
          style={{
            backgroundColor: getStatusBgColor(value),
            border: `1px solid ${getStatusColor(value)}`,
            color: getStatusColor(value),
            fontWeight: 500,
            borderRadius: "4px",
            padding: "2px 12px"
          }}
        >
          {value}
        </Tag>
      )
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      width: 180,
      render: (value: string) =>
        isMounted ? new Date(value).toLocaleString() : "-"
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      width: 180,
      render: (value: string) =>
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
            onClick={() => handleDelete(record.id, record.user?.name || "Booking")}
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

      {/* Add these styles in your global CSS or use styled-components */}
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
      `}</style>
    </div>
  );
}