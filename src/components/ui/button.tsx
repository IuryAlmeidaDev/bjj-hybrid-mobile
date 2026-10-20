// mobile/src/components/ui/button.tsx
import * as React from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  label: string;
  className?: string;
}

export function Button({
  variant = 'default',
  size = 'default',
  label,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    default: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-zinc-800 active:bg-zinc-700',
    destructive: 'bg-red-600 active:bg-red-700',
    outline: 'border border-zinc-700 bg-transparent active:bg-zinc-800',
  }[variant];

  const sizeClasses = {
    default: 'h-11 px-4 py-2.5 rounded-xl',
    sm: 'h-8 px-3 py-1.5 rounded-lg',
    lg: 'h-12 px-6 py-3 rounded-2xl',
  }[size];

  return (
    <Pressable
      className={`flex-row items-center justify-center ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      <Text className="text-xs font-bold uppercase tracking-wider text-zinc-50">{label}</Text>
    </Pressable>
  );
}
