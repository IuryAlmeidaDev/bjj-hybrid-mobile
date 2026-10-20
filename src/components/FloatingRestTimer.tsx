// mobile/src/components/FloatingRestTimer.tsx
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface FloatingRestTimerProps {
  remainingSeconds: number | null;
  onAddSeconds: (delta: number) => void;
  onSkip: () => void;
}

export function FloatingRestTimer({
  remainingSeconds,
  onAddSeconds,
  onSkip,
}: FloatingRestTimerProps) {
  React.useEffect(() => {
    if (remainingSeconds === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [remainingSeconds]);

  if (remainingSeconds === null || remainingSeconds <= 0) return null;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <View className="absolute bottom-6 left-4 right-4 flex-row items-center justify-between rounded-2xl border border-blue-500/50 bg-zinc-900 px-5 py-3.5 shadow-2xl">
      <View>
        <Text className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
          Descanso em Andamento
        </Text>
        <Text className="text-2xl font-extrabold text-zinc-50">{formatted}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => onAddSeconds(15)}
          className="rounded-lg bg-zinc-800 px-3 py-2"
        >
          <Text className="text-xs font-bold text-zinc-200">+15s</Text>
        </Pressable>
        <Pressable
          onPress={onSkip}
          className="rounded-lg bg-red-600/20 border border-red-500/40 px-3 py-2"
        >
          <Text className="text-xs font-bold text-red-400">Pular</Text>
        </Pressable>
      </View>
    </View>
  );
}
