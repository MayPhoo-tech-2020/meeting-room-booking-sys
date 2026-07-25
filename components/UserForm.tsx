"use client";

import { Button, Form, Input, Select, Space, Card, Alert } from "antd";
import { UserOutlined, MailOutlined, SafetyOutlined, CrownOutlined, UserOutlined as UserIcon } from "@ant-design/icons";
import { useState } from "react";

interface UserFormProps {
  loading?: boolean;
  onCreate: (
    values: {
      name: string;
      email: string;
      role: "ADMIN" | "OWNER" | "USER";
    }
  ) => Promise<void> | void;
}

const roleOptions = [
  {
    value: "ADMIN",
    label: "Admin",
    icon: <SafetyOutlined style={{ color: "#E74C3C" }} />
  },
  {
    value: "OWNER",
    label: "Owner",
    icon: <CrownOutlined style={{ color: "#F39C12" }} />
  },
  {
    value: "USER",
    label: "User",
    icon: <UserIcon style={{ color: "#3498DB" }} />
  },
];

export default function UserForm({
  loading = false,
  onCreate
}: UserFormProps) {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async (values: {
    name: string;
    email: string;
    role: "ADMIN" | "OWNER" | "USER";
  }) => {
    setError(null);
    try {
      await onCreate(values);
      form.resetFields();
    } catch (err) {
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="user-form"
    >
      {/* Error Alert */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16, borderRadius: 8 }}
        />
      )}

      {/* Name Field */}
      <Form.Item
        name="name"
        label={
          <Space>
            <UserOutlined style={{ color: "#1976D2" }} />
            <span style={{ fontWeight: 500 }}>Name</span>
          </Space>
        }
        rules={[
          {
            required: true,
            message: "Please enter a name"
          },
          {
            min: 2,
            message: "Name must be at least 2 characters"
          }
        ]}
      >
        <Input
          placeholder="Enter user's full name"
          size="large"
          prefix={<UserOutlined style={{ color: "#B0B8C4" }} />}
          style={{
            borderRadius: 8,
            borderColor: "#D9D9D9",
            height: 44
          }}
        />
      </Form.Item>

      {/* Email Field */}
      <Form.Item
        name="email"
        label={
          <Space>
            <MailOutlined style={{ color: "#1976D2" }} />
            <span style={{ fontWeight: 500 }}>Email</span>
          </Space>
        }
        rules={[
          {
            required: true,
            message: "Please enter an email"
          },
          {
            type: "email",
            message: "Please enter a valid email"
          }
        ]}
      >
        <Input
          placeholder="Enter user's email address"
          size="large"
          prefix={<MailOutlined style={{ color: "#B0B8C4" }} />}
          style={{
            borderRadius: 8,
            borderColor: "#D9D9D9",
            height: 44
          }}
        />
      </Form.Item>

      {/* Role Field */}
      <Form.Item
        name="role"
        label={
          <Space>
            <SafetyOutlined style={{ color: "#1976D2" }} />
            <span style={{ fontWeight: 500 }}>Role</span>
          </Space>
        }
        initialValue="USER"
        rules={[
          {
            required: true,
            message: "Please select a role"
          }
        ]}
      >
        <Select
          options={roleOptions.map(option => ({
            value: option.value,
            label: (
              <Space>
                {option.icon}
                <span style={{ fontWeight: 500, color: "#2C3E50" }}>
                  {option.label}
                </span>
              </Space>
            )
          }))}
          size="large"
          placeholder="Select a role"
          style={{
            width: "100%",
            borderRadius: 8
          }}
          className="role-select"
        />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
          size="large"
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "#1976D2",
            fontWeight: 600,
            fontSize: 15,
            height: 44,
            border: "none",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1565C0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#1976D2";
          }}
        >
          {loading ? "Creating User..." : "Create User"}
        </Button>
      </Form.Item>

      {/* Styles */}
      <style jsx>{`
        :global(.user-form .ant-form-item-label > label) {
          font-weight: 500;
          color: #2C3E50;
        }
        :global(.user-form .ant-input) {
          border-radius: 8px;
          border-color: #D9D9D9;
        }
        :global(.user-form .ant-input:hover) {
          border-color: #1976D2;
        }
        :global(.user-form .ant-input:focus) {
          border-color: #1976D2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
        }
        :global(.user-form .ant-input-affix-wrapper) {
          border-radius: 8px;
          border-color: #D9D9D9;
        }
        :global(.user-form .ant-input-affix-wrapper:hover) {
          border-color: #1976D2;
        }
        :global(.user-form .ant-input-affix-wrapper:focus) {
          border-color: #1976D2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
        }
        :global(.user-form .role-select .ant-select-selector) {
          border-radius: 8px !important;
          border-color: #D9D9D9 !important;
          height: 44px !important;
          padding: 0 12px !important;
        }
        :global(.user-form .role-select .ant-select-selector:hover) {
          border-color: #1976D2 !important;
        }
        :global(.user-form .role-select .ant-select-focused .ant-select-selector) {
          border-color: #1976D2 !important;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2) !important;
        }
        :global(.user-form .role-select .ant-select-selection-item) {
          display: flex !important;
          align-items: center !important;
        }
        :global(.user-form .role-select .ant-select-dropdown) {
          border-radius: 8px !important;
        }
        :global(.user-form .role-select .ant-select-item) {
          border-radius: 6px !important;
        }
        :global(.user-form .role-select .ant-select-item:hover) {
          background-color: #E3F2FD !important;
        }
        :global(.user-form .role-select .ant-select-item-option-selected) {
          background-color: #E3F2FD !important;
        }
      `}</style>
    </Form>
  );
}