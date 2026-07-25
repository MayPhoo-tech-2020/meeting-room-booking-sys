"use client";

import { Select, Space, Tag } from 'antd';
import { UserOutlined, CrownOutlined, SafetyOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

export type UserRole = 'ADMIN' | 'OWNER' | 'USER';

export interface RoleSelectorProps {
  value?: UserRole;
  defaultValue?: UserRole;
  onChange?: (role: UserRole) => void;
  label?: string;
}

const STORAGE_KEY = 'selected-role';

const roleOptions = [
  { 
    value: 'ADMIN' as const, 
    label: 'Admin',
    icon: <SafetyOutlined style={{ color: '#E74C3C' }} />,
    color: '#E74C3C',
    bgColor: '#FFF5F5'
  },
  { 
    value: 'OWNER' as const, 
    label: 'Owner',
    icon: <CrownOutlined style={{ color: '#F39C12' }} />,
    color: '#F39C12',
    bgColor: '#FFFBF5'
  },
  { 
    value: 'USER' as const, 
    label: 'User',
    icon: <UserOutlined style={{ color: '#3498DB' }} />,
    color: '#3498DB',
    bgColor: '#F5F9FF'
  },
] as const;

export function RoleSelector({
  value,
  defaultValue = 'ADMIN',
  onChange,
  label = 'Role',
}: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(value ?? defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedRole = window.localStorage.getItem(STORAGE_KEY);
    const parsedRole = storedRole as UserRole | null;

    if (parsedRole && roleOptions.some((option) => option.value === parsedRole)) {
      setSelectedRole(parsedRole);
      onChange?.(parsedRole);
      return;
    }

    if (value) {
      setSelectedRole(value);
    }
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedRole(value);
    }
  }, [value]);

  const handleChange = (nextValue: string) => {
    const nextRole = nextValue as UserRole;
    setSelectedRole(nextRole);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextRole);
    }

    onChange?.(nextRole);
  };

  const getRoleOption = (role: UserRole) => {
    return roleOptions.find(option => option.value === role);
  };

  const currentRole = getRoleOption(selectedRole);

  // Create select options
  const selectOptions = roleOptions.map(option => ({
    value: option.value,
    label: `${option.label}`
  }));

  return (
    <div style={{ maxWidth: 240 }}>
      <label 
        style={{ 
          display: 'block', 
          marginBottom: 8, 
          fontWeight: 600,
          color: '#2C3E50',
          fontSize: 14
        }}
      >
        {label}
      </label>
      <Select
        value={selectedRole}
        options={selectOptions}
        onChange={handleChange}
        style={{ 
          width: '100%',
          borderRadius: 8
        }}
        dropdownStyle={{
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        optionRender={(option) => {
          const roleData = roleOptions.find(r => r.value === option.value);
          return (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 0'
              }}
            >
              <Space>
                {roleData?.icon}
                <span style={{ fontWeight: 500, color: '#2C3E50' }}>
                  {roleData?.label}
                </span>
              </Space>
              <Tag
                style={{
                  backgroundColor: roleData?.bgColor,
                  border: `1px solid ${roleData?.color}`,
                  color: roleData?.color,
                  fontWeight: 600,
                  fontSize: 10,
                  padding: '2px 10px',
                  borderRadius: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {option.value}
              </Tag>
            </div>
          );
        }}
        className="role-selector"
      />

      {/* Styles */}
      <style jsx>{`
        :global(.role-selector .ant-select-selector) {
          border-radius: 8px !important;
          border-color: #D9D9D9 !important;
          height: 44px !important;
          padding: 0 12px !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
        }
        :global(.role-selector .ant-select-selector:hover) {
          border-color: #1976D2 !important;
        }
        :global(.role-selector .ant-select-focused .ant-select-selector) {
          border-color: #1976D2 !important;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2) !important;
        }
        :global(.role-selector .ant-select-selection-item) {
          display: flex !important;
          align-items: center !important;
          color: #2C3E50 !important;
          font-weight: 500 !important;
        }
        :global(.role-selector .ant-select-selection-item .ant-space) {
          display: flex !important;
          align-items: center !important;
        }
        :global(.role-selector .ant-select-arrow) {
          color: #5A6C7D !important;
        }
        :global(.role-selector .ant-select-dropdown) {
          border-radius: 8px !important;
          padding: 4px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        :global(.role-selector .ant-select-item) {
          border-radius: 6px !important;
          padding: 8px 12px !important;
          transition: all 0.2s ease !important;
        }
        :global(.role-selector .ant-select-item:hover) {
          background-color: #E3F2FD !important;
        }
        :global(.role-selector .ant-select-item-option-selected) {
          background-color: #E3F2FD !important;
        }
      `}</style>
    </div>
  );
}