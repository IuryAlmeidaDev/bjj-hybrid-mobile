// mobile/src/screens/HomeScreen.tsx
import * as React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { BjjCheckinPayload, WorkoutPlan } from '../types/workout';
import { FALLBACK_WORKOUTS } from '../data/fallbackSeed';
import {
  fetchAllWorkoutsWithReadiness,
  submitBjjCheckin,
  resetReadinessState,
} from '../services/api';
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
  { day: 'SEG', type: 'BJJ', label: 'Jiu-Jitsu (20h30–22h00)' },
  { day: 'TER', type: 'GYM', label: 'Treino A • Empurrar & Ombros', workoutCode: 'A' },
  { day: 'QUA', type: 'BJJ', label: 'Jiu-Jitsu (20h30–22h00)' },
  { day: 'QUI', type: 'GYM', label: 'Treino B • Puxar & Pegada', workoutCode: 'B' },
  { day: 'SEX', type: 'BJJ', label: 'Jiu-Jitsu (20h30–22h00)' },
  { day: 'SÁB', type: 'GYM', label: 'Treino C • Pernas & Quadril', workoutCode: 'C' },
  { day: 'DOM', type: 'REST', label: 'Descanso Total (Recuperação SNC)' },
];

export function HomeScreen() {
  const [selectedCode, setSelectedCode] = React.useState<'A' | 'B' | 'C'>('A');
  const [activeWorkoutView, setActiveWorkoutView] = React.useState<boolean>(false);
  const [checkinVisible, setCheckinVisible] = React.useState<boolean>(false);
  const [workouts, setWorkouts] = React.useState<Record<'A' | 'B' | 'C', WorkoutPlan>>(FALLBACK_WORKOUTS);
  const [isApiOnline, setIsApiOnline] = React.useState<boolean>(false);
  const [statusBanner, setStatusBanner] = React.useState<string>(
    'Prontidão 100% — Volume padrão liberado (RIR 1–2)'
  );

  React.useEffect(() => {
    fetchAllWorkoutsWithReadiness().then((sync) => {
      setIsApiOnline(sync.online);
      setWorkouts(sync.workouts);
      setStatusBanner(sync.readiness_summary);
    });
  }, []);

  const handleBjjCheckinSubmit = async (payload: BjjCheckinPayload) => {
    const sync = await submitBjjCheckin(payload);
    setIsApiOnline(sync.online);
    setWorkouts(sync.workouts);
    setStatusBanner(sync.readiness_summary);
  };

  const handleResetReadiness = async () => {
    const sync = await resetReadinessState();
    setIsApiOnline(sync.online);
    setWorkouts(sync.workouts);
    setStatusBanner(sync.readiness_summary);
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
          <View className="flex-row items-center gap-2">
            <Badge
              label={isApiOnline ? 'API NODE ONLINE' : 'MODO OFFLINE'}
              tone={isApiOnline ? 'emerald' : 'amber'}
            />
            <Badge label={`TREINO ${selectedCode}`} tone="blue" />
          </View>
        </View>
        <ActiveWorkoutScreen workout={workouts[selectedCode]} statusBanner={statusBanner} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1 px-4 pt-6 pb-16">
        <View className="flex-row items-center justify-between">
          <Badge label="PERIODIZAÇÃO HÍBRIDA • JIU-JITSU + FORÇA" tone="blue" />
          <Badge
            label={isApiOnline ? '🟢 API NODE ONLINE' : '⚡ SEED OFFLINE'}
            tone={isApiOnline ? 'emerald' : 'amber'}
          />
        </View>
        <Text className="mt-2 text-2xl font-extrabold text-zinc-50">
          BJJ & Strength Hybrid
        </Text>
        <Text className="mt-1 text-xs text-zinc-400">
          3x Jiu-Jitsu (Seg/Qua/Sex • 20h30–22h00) + 3x Musculação (Ter/Qui/Sáb)
        </Text>

        {/* Readiness Banner */}
        <Card className="mt-4 border-emerald-500/40 bg-emerald-950/20">
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <Badge label="STATUS DE PRONTIDÃO" tone="emerald" />
              <Pressable onPress={handleResetReadiness}>
                <Text className="text-xs font-bold text-emerald-400 underline">
                  Resetar 100%
                </Text>
              </Pressable>
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
