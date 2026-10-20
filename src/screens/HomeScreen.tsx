// mobile/src/screens/HomeScreen.tsx
import * as React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { BjjCheckinPayload, WorkoutPlan } from '../types/workout';
import { FALLBACK_WORKOUTS } from '../data/fallbackSeed';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { BjjCheckinModal } from '../components/BjjCheckinModal';
import { ActiveWorkoutScreen } from './ActiveWorkoutScreen';

interface WeeklyDayItem {
  day: string;
  type: 'BJJ' | 'GYM' | 'REST';
  label: string;
  workoutCode?: 'A' | 'B' | 'C';
}

const WEEKLY_SCHEDULE: WeeklyDayItem[] = [
  { day: 'SEG', type: 'BJJ', label: 'Jiu-Jitsu (19h–21h)' },
  { day: 'TER', type: 'GYM', label: 'Treino A • Empurrar', workoutCode: 'A' },
  { day: 'QUA', type: 'BJJ', label: 'Jiu-Jitsu (19h–21h)' },
  { day: 'QUI', type: 'GYM', label: 'Treino B • Puxar', workoutCode: 'B' },
  { day: 'SEX', type: 'BJJ', label: 'Jiu-Jitsu (19h–21h)' },
  { day: 'SÁB', type: 'GYM', label: 'Treino C • Pernas', workoutCode: 'C' },
  { day: 'DOM', type: 'REST', label: 'Descanso Total' },
];

export function HomeScreen() {
  const [selectedCode, setSelectedCode] = React.useState<'A' | 'B' | 'C'>('A');
  const [activeWorkoutView, setActiveWorkoutView] = React.useState<boolean>(false);
  const [checkinVisible, setCheckinVisible] = React.useState<boolean>(false);
  const [workouts, setWorkouts] = React.useState<Record<'A' | 'B' | 'C', WorkoutPlan>>(FALLBACK_WORKOUTS);
  const [statusBanner, setStatusBanner] = React.useState<string>(
    'Prontidão 100% — Volume padrão liberado (RIR 1–2)'
  );

  const handleBjjCheckinSubmit = (payload: BjjCheckinPayload) => {
    const internalLoad = payload.rounds_count * payload.round_duration_min * payload.rpe_intensity;
    const isHeavy = payload.rpe_intensity >= 8 || internalLoad >= 200;
    const hasStress = payload.body_stress_tags.length > 0;

    if (isHeavy || hasStress) {
      const updated = { ...workouts };
      (['A', 'B', 'C'] as const).forEach((code) => {
        updated[code] = {
          ...updated[code],
          exercises: updated[code].exercises.map((ex) => {
            const nextSets = isHeavy ? Math.max(2, ex.default_sets - 1) : ex.default_sets;
            let autoTier = ex.auto_swapped_to_tier;
            let autoReason = ex.auto_swap_reason;

            if (payload.body_stress_tags.includes('lombar') && ex.slug === 'rdl_terra_romeno') {
              autoTier = 'B';
              autoReason = 'Auto-ajuste por fadiga lombar no Jiu-Jitsu';
            } else if (payload.body_stress_tags.includes('ombro') && ex.slug === 'supino_reto') {
              autoTier = 'B';
              autoReason = 'Auto-ajuste para proteger articulação do ombro';
            } else if (payload.body_stress_tags.includes('pegada') && ex.slug === 'barra_fixa') {
              autoTier = 'B';
              autoReason = 'Auto-ajuste por fadiga de pegada de quimono';
            }

            return {
              ...ex,
              adjusted_sets: nextSets,
              recommended_rir: isHeavy ? 2 : 1,
              auto_swapped_to_tier: autoTier,
              auto_swap_reason: autoReason,
            };
          }),
        };
      });
      setWorkouts(updated);
      setStatusBanner(
        `Check-in registrado (${payload.rounds_count} rolas • RPE ${payload.rpe_intensity}): Volume ajustado para recuperação articular`
      );
    } else {
      setStatusBanner(
        `Check-in registrado (${payload.rounds_count} rolas • RPE ${payload.rpe_intensity}): Prontidão alta mantida`
      );
    }
  };

  if (activeWorkoutView) {
    return (
      <View className="flex-1 bg-zinc-950">
        <View className="flex-row items-center justify-between border-b border-zinc-800 px-4 pt-4 pb-3">
          <Pressable
            onPress={() => setActiveWorkoutView(false)}
            className="rounded-lg bg-zinc-900 px-3 py-1.5"
          >
            <Text className="text-xs font-bold text-zinc-300">← Voltar ao Painel</Text>
          </Pressable>
          <Badge label={`TREINO ${selectedCode}`} tone="blue" />
        </View>
        <ActiveWorkoutScreen workout={workouts[selectedCode]} statusBanner={statusBanner} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1 px-4 pt-6 pb-16">
        <Badge label="PERIODIZAÇÃO HÍBRIDA • JIU-JITSU + FORÇA" tone="blue" className="self-start" />
        <Text className="mt-2 text-2xl font-extrabold text-zinc-50">
          BJJ & Strength Hybrid
        </Text>
        <Text className="mt-1 text-xs text-zinc-400">
          3x Jiu-Jitsu (Seg/Qua/Sex) + 3x Musculação Full-Body/Split (Ter/Qui/Sáb)
        </Text>

        {/* Readiness Banner */}
        <Card className="mt-4 border-emerald-500/40 bg-emerald-950/20">
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <Badge label="STATUS DE PRONTIDÃO" tone="emerald" />
              <Text className="text-xs font-bold text-emerald-400">Motor Autoreg Ativo</Text>
            </View>
            <CardTitle className="mt-2 text-base">Adaptação Dinâmica Pós-Tatame</CardTitle>
            <CardDescription className="text-zinc-300">{statusBanner}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              label="🥋 Registrar Check-in Pós-Jiu (30s)"
              onPress={() => setCheckinVisible(true)}
            />
          </CardContent>
        </Card>

        {/* Weekly Timeline Seg-Dom */}
        <Text className="mt-6 text-xs font-bold uppercase tracking-wider text-zinc-400">
          Cronograma Semanal (Seg – Dom)
        </Text>
        <View className="mt-2.5 space-y-2">
          {WEEKLY_SCHEDULE.map((item) => {
            const isSelectedGym = item.workoutCode === selectedCode;
            const badgeTone =
              item.type === 'BJJ' ? 'purple' : item.type === 'GYM' ? 'blue' : 'emerald';

            return (
              <Pressable
                key={item.day}
                onPress={() => {
                  if (item.workoutCode) {
                    setSelectedCode(item.workoutCode);
                  } else if (item.type === 'BJJ') {
                    setCheckinVisible(true);
                  }
                }}
                className={`flex-row items-center justify-between rounded-xl border px-3.5 py-3 ${
                  isSelectedGym
                    ? 'border-blue-500 bg-blue-950/25'
                    : 'border-zinc-800 bg-zinc-900/80'
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="w-10 text-xs font-extrabold text-zinc-100">{item.day}</Text>
                  <Text className="text-xs font-semibold text-zinc-300">{item.label}</Text>
                </View>
                <Badge label={item.type} tone={badgeTone} />
              </Pressable>
            );
          })}
        </View>

        {/* Selected Workout Quick Launch */}
        <Card className="mt-6">
          <CardHeader>
            <Badge label={workouts[selectedCode].tag} tone="blue" className="self-start" />
            <CardTitle className="mt-1">{workouts[selectedCode].title}</CardTitle>
            <CardDescription>{workouts[selectedCode].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="flex-row gap-2">
              {(['A', 'B', 'C'] as const).map((code) => (
                <Pressable
                  key={code}
                  onPress={() => setSelectedCode(code)}
                  className={`flex-1 items-center rounded-lg border py-2 ${
                    selectedCode === code
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-zinc-800 bg-zinc-950'
                  }`}
                >
                  <Text className="text-xs font-bold text-zinc-100">Treino {code}</Text>
                </Pressable>
              ))}
            </View>
            <Button
              label={`Iniciar ${workouts[selectedCode].title}`}
              onPress={() => setActiveWorkoutView(true)}
              className="mt-4"
            />
          </CardContent>
        </Card>
      </ScrollView>

      <BjjCheckinModal
        visible={checkinVisible}
        onClose={() => setCheckinVisible(false)}
        onSubmit={handleBjjCheckinSubmit}
      />
    </View>
  );
}
