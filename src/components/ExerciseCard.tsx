// mobile/src/components/ExerciseCard.tsx
import * as React from 'react';
import { View, Text, Linking, TextInput, Pressable } from 'react-native';
import { ExerciseItem, AlternativeTier } from '../types/workout';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface ExerciseCardProps {
  exercise: ExerciseItem;
  activeTier: 'A' | AlternativeTier;
  completedSets: Record<string, boolean>;
  onOpenSwap: (exercise: ExerciseItem) => void;
  onToggleSetComplete: (setKey: string, restSeconds: number) => void;
}

export function ExerciseCard({
  exercise,
  activeTier,
  completedSets,
  onOpenSwap,
  onToggleSetComplete,
}: ExerciseCardProps) {
  const activeAlt = exercise.alternatives.find((a) => a.tier === activeTier);
  const displayName = activeAlt ? activeAlt.name : exercise.name;
  const displayVideo = activeAlt ? activeAlt.video_url : exercise.video_url;
  const setsCount = exercise.adjusted_sets || exercise.default_sets;

  return (
    <Card className="mt-4">
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text className="text-base font-extrabold text-zinc-50">{displayName}</Text>
          <Text className="text-xs text-zinc-400">{exercise.target_muscle}</Text>
        </View>
        <Pressable
          onPress={() => Linking.openURL(displayVideo)}
          className="rounded-lg bg-red-600 px-3 py-1.5"
        >
          <Text className="text-[11px] font-bold text-white">▶ Execução</Text>
        </Pressable>
      </View>

      <View className="mt-2.5 flex-row flex-wrap gap-2">
        <Badge label={`${setsCount} séries × ${exercise.reps_range}`} tone="blue" />
        <Badge label={`Descanso: ${exercise.rest_seconds}s`} tone="amber" />
        <Badge label={`RIR ${exercise.recommended_rir || 1}-2`} tone="purple" />
      </View>

      <Text className="mt-2 text-xs text-zinc-400">{exercise.bjj_benefit}</Text>

      {exercise.auto_swap_reason ? (
        <Text className="mt-2 text-xs font-semibold text-amber-400">
          🛡️ {exercise.auto_swap_reason}
        </Text>
      ) : null}

      {/* 1-Touch Machine Swap Trigger */}
      <Pressable
        onPress={() => onOpenSwap(exercise)}
        className="mt-3 flex-row items-center justify-between rounded-xl border border-dashed border-zinc-700 bg-zinc-950/70 px-3 py-2"
      >
        <Text className="text-xs font-bold text-blue-400">
          🔄 Aparelho ocupado? Trocar (Plano B / C)
        </Text>
        <Text className="text-[11px] font-semibold text-zinc-400">
          Ativo: Opção {activeTier}
        </Text>
      </Pressable>

      {/* Sets Table */}
      <View className="mt-3 space-y-2">
        {Array.from({ length: setsCount }).map((_, idx) => {
          const setKey = `${exercise.id}_set_${idx + 1}`;
          const isDone = !!completedSets[setKey];
          return (
            <View
              key={setKey}
              className={`flex-row items-center justify-between rounded-xl border px-3 py-2 ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-zinc-800 bg-zinc-950'
              }`}
            >
              <Text className="w-14 text-xs font-bold text-zinc-300">
                Série {idx + 1}
              </Text>
              <TextInput
                placeholder="Carga (kg)"
                placeholderTextColor="#52525b"
                keyboardType="numeric"
                className="w-24 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-center text-xs font-bold text-zinc-100"
              />
              <TextInput
                placeholder={exercise.reps_range}
                placeholderTextColor="#52525b"
                keyboardType="numeric"
                className="w-20 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-center text-xs font-bold text-zinc-100"
              />
              <Pressable
                onPress={() => onToggleSetComplete(setKey, exercise.rest_seconds)}
                className={`h-8 w-8 items-center justify-center rounded-lg ${
                  isDone ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <Text className="text-xs font-extrabold text-zinc-950">✓</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
