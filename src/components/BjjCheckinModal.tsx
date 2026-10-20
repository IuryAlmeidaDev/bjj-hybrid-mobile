// mobile/src/components/BjjCheckinModal.tsx
import * as React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { BjjCheckinPayload } from '../types/workout';
import { Button } from './ui/button';

const STRESS_TAGS = [
  { id: 'ombro', label: 'Ombro' },
  { id: 'lombar', label: 'Lombar' },
  { id: 'pegada', label: 'Dedos / Pegada' },
  { id: 'joelho', label: 'Joelho' },
  { id: 'pescoco', label: 'Pescoço' },
];

interface BjjCheckinModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: BjjCheckinPayload) => void;
}

export function BjjCheckinModal({ visible, onClose, onSubmit }: BjjCheckinModalProps) {
  const [rounds, setRounds] = React.useState(4);
  const [rpe, setRpe] = React.useState(7);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/80">
        <View className="rounded-t-3xl border-t border-zinc-800 bg-zinc-950 p-6">
          <Text className="text-xl font-extrabold text-zinc-50">
            Check-in Pós-Jiu (30 Segundos)
          </Text>
          <Text className="mt-1 text-xs text-zinc-400">
            Adapta automaticamente o volume da sua musculação de amanhã:
          </Text>

          {/* Rounds Stepper */}
          <View className="mt-5 flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3.5">
            <Text className="text-sm font-bold text-zinc-200">Quantidade de Rolas (6 min)</Text>
            <View className="flex-row items-center gap-4">
              <Pressable
                onPress={() => setRounds(Math.max(1, rounds - 1))}
                className="h-8 w-8 items-center justify-center rounded-lg bg-zinc-800"
              >
                <Text className="text-lg font-bold text-zinc-50">-</Text>
              </Pressable>
              <Text className="text-lg font-extrabold text-blue-400">{rounds}</Text>
              <Pressable
                onPress={() => setRounds(rounds + 1)}
                className="h-8 w-8 items-center justify-center rounded-lg bg-zinc-800"
              >
                <Text className="text-lg font-bold text-zinc-50">+</Text>
              </Pressable>
            </View>
          </View>

          {/* Intensity RPE Selector */}
          <Text className="mt-4 text-xs font-bold uppercase text-zinc-400">
            Intensidade do Treino (RPE: {rpe}/10)
          </Text>
          <View className="mt-2 flex-row justify-between gap-1.5">
            {[4, 6, 7, 8, 9, 10].map((val) => (
              <Pressable
                key={val}
                onPress={() => setRpe(val)}
                className={`flex-1 items-center rounded-lg border py-2.5 ${
                  rpe === val
                    ? 'border-red-500 bg-red-600/25'
                    : 'border-zinc-800 bg-zinc-900'
                }`}
              >
                <Text className="text-xs font-extrabold text-zinc-100">{val}</Text>
              </Pressable>
            ))}
          </View>

          {/* Body Stress Map Chips */}
          <Text className="mt-4 text-xs font-bold uppercase text-zinc-400">
            Alguma Articulação Sentiu Hoje?
          </Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {STRESS_TAGS.map((tag) => {
              const active = selectedTags.includes(tag.id);
              return (
                <Pressable
                  key={tag.id}
                  onPress={() => toggleTag(tag.id)}
                  className={`rounded-full border px-3.5 py-1.5 ${
                    active
                      ? 'border-amber-500 bg-amber-500/20'
                      : 'border-zinc-800 bg-zinc-900'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      active ? 'text-amber-300' : 'text-zinc-300'
                    }`}
                  >
                    {tag.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Button
            label="Salvar & Ajustar Musculação de Amanhã"
            onPress={() => {
              onSubmit({
                rounds_count: rounds,
                round_duration_min: 6,
                rpe_intensity: rpe,
                body_stress_tags: selectedTags,
              });
              onClose();
            }}
            className="mt-6"
          />
        </View>
      </View>
    </Modal>
  );
}
