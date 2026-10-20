// mobile/src/components/ui/card.tsx
import * as React from 'react';
import { View, Text, type ViewProps, type TextProps } from 'react-native';

export function Card({ className = '', ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-md ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }: ViewProps & { className?: string }) {
  return <View className={`flex-col space-y-1.5 pb-2 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: TextProps & { className?: string }) {
  return (
    <Text
      className={`text-lg font-extrabold tracking-tight text-zinc-50 ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = '', ...props }: TextProps & { className?: string }) {
  return <Text className={`text-xs text-zinc-400 ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: ViewProps & { className?: string }) {
  return <View className={`pt-2 ${className}`} {...props} />;
}
