"use client";

import { Button, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '../types/user';

interface UserTableProps {
  users: User[];
  loading?: boolean;
  currentRole: string;
  onDelete: (id: string) => Promise<void> | void;
  onRoleChange: (id: string, role: User['role']) => Promise<void> | void;
}

const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'OWNER', label: 'Owner' },
  { value: 'USER', label: 'User' },
];

export default function UserTable({ users, loading = false, currentRole, onDelete, onRoleChange }: UserTableProps) {
  const columns: ColumnsType<User> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: User['role']) => <Tag color={role === 'ADMIN' ? 'red' : role === 'OWNER' ? 'blue' : 'green'}>{role}</Tag>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    ...(currentRole === 'ADMIN'
      ? [
          {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: User) => (
              <div style={{ display: 'flex', gap: 8 }}>
                <Select
                  value={record.role}
                  options={roleOptions}
                  onChange={(value) => onRoleChange(record.id, value as User['role'])}
                  style={{ width: 120 }}
                />
                <Button danger onClick={() => onDelete(record.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return <Table rowKey="id" columns={columns} dataSource={users} loading={loading} />;
}
