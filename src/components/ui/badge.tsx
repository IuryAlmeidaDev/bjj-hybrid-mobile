// mobile/src/components/ui/badge.tsx
import * as React from 'react';
import { View, Text, type ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
  label: string;
  tone?: 'blue' | 'amber' | 'emerald' | 'red' | 'purple';
}

export function Badge({ label, tone = 'blue', className = '', ...props }: BadgeProps & { className?: string }) {
  const toneStyles = {
    blue: 'bg-blue-500/15 border-blue-500/40 text-blue-400',
    amber: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
    emerald: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
    red: 'bg-red-500/15 border-red-500/40 text-red-400',
    purple: 'bg-purple-500/15 border-purple-500/40 text-purple-400',
  }[tone];

  return (
    <View className={`rounded-md border px-2.5 py-0.5 ${toneStyles} ${className}`} {...props}>
      <Text className="text-[11px] font-bold">{label}</Text>
    </View>
  );
}
