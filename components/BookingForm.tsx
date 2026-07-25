"use client";

import { Button, DatePicker, Form, Card, Space, Alert } from "antd";
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

  const disabledEndDate = (current: dayjs.Dayjs) => {
    const start = form.getFieldValue("startTime");
    if (!start) return false;
    return current && current < dayjs(start);
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

      {/* Created By - User Info Card */}
      <Form.Item label="Created By">
        <Card
          size="small"
          style={{
            backgroundColor: "#F5F9FF",
            borderColor: "#E3F2FD",
            borderRadius: 8,
            borderWidth: 2
          }}
          bodyStyle={{ padding: "12px 16px" }}
        >
          <Space>
            <UserOutlined style={{ color: "#1976D2", fontSize: 16 }} />
            <span style={{ fontWeight: 600, color: "#2C3E50" }}>
              {currentUser ? currentUser.name : "Loading..."}
            </span>
            {currentUser && (
              <span
                style={{
                  fontSize: 11,
                  color: "#5A6C7D",
                  backgroundColor: "#E8EDF2",
                  padding: "2px 10px",
                  borderRadius: 12,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}
              >
                {currentUser.role}
              </span>
            )}
          </Space>
        </Card>
      </Form.Item>

      {/* Start Time */}
      <Form.Item
        name="startTime"
        label={
          <Space>
            <CalendarOutlined style={{ color: "#1976D2" }} />
            <span style={{ fontWeight: 500 }}>Start Time</span>
          </Space>
        }
        rules={[
          {
            required: true,
            message: "Please select start time"
          }
        ]}
      >
        <DatePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          disabledDate={disabledDate}
          placeholder="Select start date & time"
          style={{
            width: "100%",
            borderRadius: 8,
            borderColor: "#D9D9D9",
            height: 44
          }}
          suffixIcon={<ClockCircleOutlined />}
        />
      </Form.Item>

      {/* End Time */}
      <Form.Item
        name="endTime"
        label={
          <Space>
            <CalendarOutlined style={{ color: "#1976D2" }} />
            <span style={{ fontWeight: 500 }}>End Time</span>
          </Space>
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
      >
        <DatePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          placeholder="Select end date & time"
          style={{
            width: "100%",
            borderRadius: 8,
            borderColor: "#D9D9D9",
            height: 44
          }}
          suffixIcon={<ClockCircleOutlined />}
        />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 8,
            backgroundColor: "#1976D2",
            fontWeight: 600,
            fontSize: 15,
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
          {loading ? "Creating Booking..." : "Create Booking"}
        </Button>
      </Form.Item>

      {/* Styles */}
      <style jsx>{`
        :global(.booking-form .ant-form-item-label > label) {
          font-weight: 500;
          color: #2C3E50;
        }
        :global(.booking-form .ant-picker) {
          border-radius: 8px;
          border-color: #D9D9D9;
        }
        :global(.booking-form .ant-picker:hover) {
          border-color: #1976D2;
        }
        :global(.booking-form .ant-picker-focused) {
          border-color: #1976D2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
        }
        :global(.booking-form .ant-picker-input > input) {
          font-size: 14px;
        }
        :global(.booking-form .ant-picker-input > input::placeholder) {
          color: #B0B8C4;
        }
      `}</style>
    </Form>
  );
}