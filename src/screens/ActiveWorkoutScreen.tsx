// mobile/src/screens/ActiveWorkoutScreen.tsx
import * as React from 'react';
import { ScrollView, View, Text, Linking, TextInput, Pressable } from 'react-native';
import { WorkoutPlan, ExerciseItem, AlternativeTier } from '../types/workout';
import { submitSetLog } from '../services/api';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SwapSheetModal } from '../components/SwapSheetModal';
import { FloatingRestTimer } from '../components/FloatingRestTimer';

interface ActiveWorkoutScreenProps {
  workout: WorkoutPlan;
  statusBanner?: string;
}

export function ActiveWorkoutScreen({ workout, statusBanner }: ActiveWorkoutScreenProps) {
  const [selectedTiers, setSelectedTiers] = React.useState<Record<string, 'A' | AlternativeTier>>({});
  const [swapTarget, setSwapTarget] = React.useState<ExerciseItem | null>(null);
  const [completedSets, setCompletedSets] = React.useState<Record<string, boolean>>({});
  const [weightsInput, setWeightsInput] = React.useState<Record<string, string>>({});
  const [repsInput, setRepsInput] = React.useState<Record<string, string>>({});
  const [restRemaining, setRestRemaining] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (restRemaining === null || restRemaining <= 0) return;
    const timer = setInterval(() => {
      setRestRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [restRemaining]);

  const toggleSetComplete = (
    ex: ExerciseItem,
    setNumber: number,
    activeTier: 'A' | AlternativeTier
  ) => {
    const key = `${ex.id}_set_${setNumber}`;
    setCompletedSets((prev) => {
      const nextState = !prev[key];
      if (nextState) {
        setRestRemaining(ex.rest_seconds);
        submitSetLog({
          workout_code: workout.code,
          exercise_id: ex.id,
          exercise_slug: ex.slug,
          chosen_tier: activeTier,
          set_number: setNumber,
          weight_kg: parseFloat(weightsInput[key] || '0') || 0,
          reps_done: parseInt(repsInput[key] || '8', 10) || 8,
          rir: ex.recommended_rir || 1,
        });
      }
      return { ...prev, [key]: nextState };
    });
  };

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1 px-4 pt-6 pb-28">
        <Badge label={workout.tag} tone="blue" className="self-start" />
        <Text className="mt-2 text-2xl font-extrabold text-zinc-50">{workout.title}</Text>
        <Text className="mt-1 text-xs text-zinc-400">{workout.description}</Text>

        {statusBanner ? (
          <View className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
            <Text className="text-xs font-bold text-amber-300">⚡ {statusBanner}</Text>
          </View>
        ) : null}

        {workout.exercises.map((ex) => {
          const activeTier = selectedTiers[ex.id] || ex.auto_swapped_to_tier || 'A';
          const activeAlt = ex.alternatives.find((a) => a.tier === activeTier);
          const displayName = activeAlt ? activeAlt.name : ex.name;
          const displayVideo = activeAlt ? activeAlt.video_url : ex.video_url;
          const setsCount = ex.adjusted_sets || ex.default_sets;

          return (
            <Card key={ex.id} className="mt-4">
              <View className="flex-row items-start justify-between gap-2">
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-zinc-50">{displayName}</Text>
                  <Text className="text-xs text-zinc-400">{ex.target_muscle}</Text>
                </View>
                <Pressable
                  onPress={() => Linking.openURL(displayVideo)}
                  className="rounded-lg bg-red-600 px-3 py-1.5"
                >
                  <Text className="text-[11px] font-bold text-white">▶ Execução</Text>
                </Pressable>
              </View>

              <View className="mt-2.5 flex-row flex-wrap gap-2">
                <Badge label={`${setsCount} séries × ${ex.reps_range}`} tone="blue" />
                <Badge label={`Descanso: ${ex.rest_seconds}s`} tone="amber" />
                <Badge label={`RIR ${ex.recommended_rir || 1}-2`} tone="purple" />
              </View>

              {ex.auto_swap_reason ? (
                <Text className="mt-2 text-xs font-semibold text-amber-400">
                  🛡️ {ex.auto_swap_reason}
                </Text>
              ) : null}

              {/* 1-Touch Machine Swap Trigger */}
              <Pressable
                onPress={() => setSwapTarget(ex)}
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
                  const setNumber = idx + 1;
                  const setKey = `${ex.id}_set_${setNumber}`;
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
                        Série {setNumber}
                      </Text>
                      <TextInput
                        value={weightsInput[setKey] || ''}
                        onChangeText={(val) =>
                          setWeightsInput((prev) => ({ ...prev, [setKey]: val }))
                        }
                        placeholder="Carga (kg)"
                        placeholderTextColor="#52525b"
                        keyboardType="numeric"
                        className="w-24 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-center text-xs font-bold text-zinc-100"
                      />
                      <TextInput
                        value={repsInput[setKey] || ''}
                        onChangeText={(val) =>
                          setRepsInput((prev) => ({ ...prev, [setKey]: val }))
                        }
                        placeholder={ex.reps_range}
                        placeholderTextColor="#52525b"
                        keyboardType="numeric"
                        className="w-20 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-center text-xs font-bold text-zinc-100"
                      />
                      <Pressable
                        onPress={() => toggleSetComplete(ex, setNumber, activeTier)}
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
        })}
      </ScrollView>

      <SwapSheetModal
        visible={!!swapTarget}
        exercise={swapTarget}
        activeTier={
          swapTarget
            ? selectedTiers[swapTarget.id] || swapTarget.auto_swapped_to_tier || 'A'
            : 'A'
        }
        onSelectTier={(tier) => {
          if (swapTarget) {
            setSelectedTiers((prev) => ({ ...prev, [swapTarget.id]: tier }));
          }
        }}
        onClose={() => setSwapTarget(null)}
      />

      <FloatingRestTimer
        remainingSeconds={restRemaining}
        onAddSeconds={(delta) => setRestRemaining((prev) => (prev || 0) + delta)}
        onSkip={() => setRestRemaining(null)}
      />
    </View>
  );
}
