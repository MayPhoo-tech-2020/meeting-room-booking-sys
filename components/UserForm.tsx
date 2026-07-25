"use client";

import { Button, Form, Input, Select, Space, Alert } from "antd";
import { UserOutlined, MailOutlined, SafetyOutlined, CrownOutlined } from "@ant-design/icons";
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
    icon: <SafetyOutlined className="text-red-500" />
  },
  {
    value: "OWNER",
    label: "Owner",
    icon: <CrownOutlined className="text-orange-500" />
  },
  {
    value: "USER",
    label: "User",
    icon: <UserOutlined className="text-blue-500" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        {/* Name Field */}
        <Form.Item
          name="name"
          label={
            <span className="text-sm font-medium text-gray-700">
              <UserOutlined className="mr-1 text-blue-500" />
              Name
            </span>
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
          className="mb-3"
        >
          <Input
            placeholder="Enter user's name"
            prefix={<UserOutlined className="text-gray-400" />}
            className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 h-10"
          />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          name="email"
          label={
            <span className="text-sm font-medium text-gray-700">
              <MailOutlined className="mr-1 text-blue-500" />
              Email
            </span>
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
          className="mb-3"
        >
          <Input
            placeholder="Enter user's email"
            prefix={<MailOutlined className="text-gray-400" />}
            className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 h-10"
          />
        </Form.Item>
      </div>

      {/* Role Field */}
      <Form.Item
        name="role"
        label={
          <span className="text-sm font-medium text-gray-700">
            <SafetyOutlined className="mr-1 text-blue-500" />
            Role
          </span>
        }
        initialValue="USER"
        rules={[
          {
            required: true,
            message: "Please select a role"
          }
        ]}
        className="mb-4"
      >
        <Select
          options={roleOptions.map(option => ({
            value: option.value,
            label: (
              <Space className="gap-2">
                {option.icon}
                <span className="font-medium text-gray-700">
                  {option.label}
                </span>
              </Space>
            )
          }))}
          placeholder="Select a role"
          className="w-full max-w-[300px] rounded-lg"
          classNames={{
            popup: {
              root: "rounded-lg"
            }
          }}
        />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item className="mb-0">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
          className="rounded-lg font-medium text-sm h-10 px-6 bg-blue-600 hover:bg-blue-700 border-none min-w-[160px]"
        >
          {loading ? "Creating User..." : "Create User"}
        </Button>
      </Form.Item>

      <style jsx>{`
        :global(.user-form .ant-form-item-label > label) {
          font-weight: 500;
          color: #374151;
        }
        :global(.user-form .ant-input) {
          border-radius: 8px;
          border-color: #E5E7EB;
          height: 40px;
          transition: all 0.2s;
        }
        :global(.user-form .ant-input:hover) {
          border-color: #60A5FA;
        }
        :global(.user-form .ant-input:focus) {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        :global(.user-form .ant-input-affix-wrapper) {
          border-radius: 8px;
          border-color: #E5E7EB;
          height: 40px;
          transition: all 0.2s;
        }
        :global(.user-form .ant-input-affix-wrapper:hover) {
          border-color: #60A5FA;
        }
        :global(.user-form .ant-input-affix-wrapper:focus) {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        :global(.user-form .ant-input-affix-wrapper .ant-input) {
          height: 38px;
        }
        :global(.user-form .ant-select-selector) {
          border-radius: 8px !important;
          border-color: #E5E7EB !important;
          height: 40px !important;
          transition: all 0.2s !important;
        }
        :global(.user-form .ant-select-selector:hover) {
          border-color: #60A5FA !important;
        }
        :global(.user-form .ant-select-focused .ant-select-selector) {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        :global(.user-form .ant-select-selection-item) {
          display: flex !important;
          align-items: center !important;
        }
        :global(.user-form .ant-select-dropdown) {
          border-radius: 8px !important;
        }
        :global(.user-form .ant-select-item) {
          border-radius: 6px !important;
        }
        :global(.user-form .ant-select-item:hover) {
          background-color: #EFF6FF !important;
        }
        :global(.user-form .ant-select-item-option-selected) {
          background-color: #DBEAFE !important;
        }
        :global(.user-form .ant-btn-primary) {
          background-color: #2563EB;
        }
        :global(.user-form .ant-btn-primary:hover) {
          background-color: #1D4ED8 !important;
        }
        @media (max-width: 768px) {
          :global(.user-form .ant-input) {
            height: 38px;
          }
          :global(.user-form .ant-input-affix-wrapper) {
            height: 38px;
          }
          :global(.user-form .ant-select-selector) {
            height: 38px !important;
          }
        }
      `}</style>
    </Form>
  );
}