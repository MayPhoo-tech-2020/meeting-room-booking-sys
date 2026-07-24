"use client";

import { Select } from 'antd';
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
  { value: 'ADMIN', label: 'Admin' },
  { value: 'OWNER', label: 'Owner' },
  { value: 'USER', label: 'User' },
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

  return (
    <div style={{ maxWidth: 220 }}>
      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
        {label}
      </label>
      <Select
        value={selectedRole}
        options={roleOptions as unknown as Array<{ value: UserRole; label: string }>}
        onChange={handleChange}
        style={{ width: '100%' }}
      />
    </div>
  );
}
