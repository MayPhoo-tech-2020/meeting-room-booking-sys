"use client";

import { Button, DatePicker, Form, Input } from 'antd';

interface BookingFormProps {
  loading?: boolean;
  onCreate: (values: { userId: string; startTime: string; endTime: string }) => Promise<void> | void;
}

const serializeDateValue = (value: unknown): string => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object' && 'toISOString' in value && typeof (value as { toISOString?: () => string }).toISOString === 'function') {
    return (value as { toISOString: () => string }).toISOString();
  }

  return String(value);
};

export default function BookingForm({ loading = false, onCreate }: BookingFormProps) {
  const [form] = Form.useForm();

  const handleFinish = async (values: { userId: string; startTime: unknown; endTime: unknown }) => {
    await onCreate({
      userId: values.userId,
      startTime: serializeDateValue(values.startTime),
      endTime: serializeDateValue(values.endTime),
    });
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item name="userId" label="User ID" rules={[{ required: true, message: 'Please enter a user ID' }]}> 
        <Input />
      </Form.Item>

      <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: 'Please select a start time' }]}> 
        <DatePicker showTime style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="endTime" label="End Time" rules={[{ required: true, message: 'Please select an end time' }]}> 
        <DatePicker showTime style={{ width: '100%' }} />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Create Booking
      </Button>
    </Form>
  );
}
