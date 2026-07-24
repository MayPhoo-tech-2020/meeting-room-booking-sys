"use client";

import { Button, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Booking } from '../types/booking';

interface BookingTableProps {
  bookings: Booking[];
  loading?: boolean;
  currentRole: string;
  currentUserId?: string;
  onDelete: (id: string) => Promise<void> | void;
}

export default function BookingTable({ bookings, loading = false, currentRole, currentUserId, onDelete }: BookingTableProps) {
  const canDelete = (booking: Booking) => currentRole !== 'USER' || booking.userId === currentUserId;

  const columns: ColumnsType<Booking> = [
    { title: 'Title', dataIndex: 'title', render: (value: string) => value || 'Untitled Booking' },
    { title: 'User', render: (_: unknown, record: Booking) => record.user?.name || record.userId },

    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: Booking['status']) => <Tag color={value === 'APPROVED' ? 'green' : value === 'REJECTED' ? 'red' : 'orange'}>{value}</Tag>,
    },
    {
      title: 'Start',
      dataIndex: 'startTime',
      render: (value: Date) => new Date(value).toLocaleString(),
    },
    {
      title: 'End',
      dataIndex: 'endTime',
      render: (value: Date) => new Date(value).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Booking) => (
        canDelete(record) ? (
          <Button danger onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        ) : null
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={bookings} loading={loading} />;
}
