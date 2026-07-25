"use client";

import { Button, DatePicker, Form, Space, Alert } from "antd";
import { CalendarOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface BookingFormProps {
  loading?: boolean;
  onCreate: (
    values: {
      userId: string;
      startTime: string;
      endTime: string;
    }
  ) => Promise<void> | void;
}

type CurrentUser = {
  id: string;
  name: string;
  role: string;
};

export default function BookingForm({
  loading = false,
  onCreate
}: BookingFormProps) {
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const handleFinish = async (values: any) => {
    if (!currentUser) {
      setError("Please login first");
      return;
    }

    setError(null);

    try {
      const start = values.startTime.toISOString();
      const end = values.endTime.toISOString();

      await onCreate({
        userId: currentUser.id,
        startTime: start,
        endTime: end,
      });

      form.resetFields();
    } catch (err) {
      setError("Failed to create booking. Please try again.");
    }
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="booking-form"
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

      {/* Created By - User Info */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 max-w-md">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
          <UserOutlined />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">
            {currentUser ? currentUser.name : "Loading..."}
          </div>
          {currentUser && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              {currentUser.role}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        {/* Start Time */}
        <Form.Item
          name="startTime"
          label={
            <span className="text-sm font-medium text-gray-700">
              <CalendarOutlined className="mr-1 text-blue-500" />
              Start Time
            </span>
          }
          rules={[
            {
              required: true,
              message: "Please select start time"
            }
          ]}
          className="mb-3"
        >
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            placeholder="Select start time"
            className="w-full rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 h-10"
            suffixIcon={<ClockCircleOutlined className="text-gray-400" />}
          />
        </Form.Item>

        {/* End Time */}
        <Form.Item
          name="endTime"
          label={
            <span className="text-sm font-medium text-gray-700">
              <CalendarOutlined className="mr-1 text-blue-500" />
              End Time
            </span>
          }
          dependencies={["startTime"]}
          rules={[
            {
              required: true,
              message: "Please select end time"
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const start = getFieldValue("startTime");

                if (!start || !value) {
                  return Promise.resolve();
                }

                if (dayjs(value).isAfter(dayjs(start))) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("End time must be after start time")
                );
              }
            })
          ]}
          className="mb-4"
        >
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            placeholder="Select end time"
            className="w-full rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 h-10"
            suffixIcon={<ClockCircleOutlined className="text-gray-400" />}
          />
        </Form.Item>
      </div>

      {/* Submit Button */}
      <Form.Item className="mb-0">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
          className="rounded-lg font-medium text-sm h-10 px-6 bg-blue-600 hover:bg-blue-700 border-none min-w-[160px]"
        >
          {loading ? "Creating Booking..." : "Create Booking"}
        </Button>
      </Form.Item>

      <style jsx>{`
        :global(.booking-form .ant-form-item-label > label) {
          font-weight: 500;
          color: #374151;
        }
        :global(.booking-form .ant-picker) {
          border-radius: 8px;
          border-color: #E5E7EB;
          height: 40px;
          width: 100%;
          transition: all 0.2s;
        }
        :global(.booking-form .ant-picker:hover) {
          border-color: #60A5FA;
        }
        :global(.booking-form .ant-picker-focused) {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        :global(.booking-form .ant-picker-input > input) {
          font-size: 14px;
        }
        :global(.booking-form .ant-picker-input > input::placeholder) {
          color: #9CA3AF;
        }
        :global(.booking-form .ant-picker-suffix) {
          color: #9CA3AF;
        }
        :global(.booking-form .ant-alert) {
          border-radius: 8px;
        }
        :global(.booking-form .ant-btn-primary) {
          background-color: #2563EB;
        }
        :global(.booking-form .ant-btn-primary:hover) {
          background-color: #1D4ED8 !important;
        }
        @media (max-width: 768px) {
          :global(.booking-form .ant-picker) {
            height: 38px;
          }
        }
      `}</style>
    </Form>
  );
}