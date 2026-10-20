// mobile/src/components/SwapSheetModal.tsx
import * as React from 'react';
import { Modal, View, Text, Pressable, Linking } from 'react-native';
import { ExerciseItem, AlternativeTier } from '../types/workout';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface SwapSheetModalProps {
  visible: boolean;
  exercise: ExerciseItem | null;
  activeTier: 'A' | AlternativeTier;
  onSelectTier: (tier: 'A' | AlternativeTier) => void;
  onClose: () => void;
}

export function SwapSheetModal({
  visible,
  exercise,
  activeTier,
  onSelectTier,
  onClose,
}: SwapSheetModalProps) {
  if (!exercise) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/75">
        <View className="rounded-t-3xl border-t border-zinc-800 bg-zinc-950 p-6">
          <Text className="text-lg font-extrabold text-zinc-50">
            Aparelho Ocupado? Escolha a Alternativa
          </Text>
          <Text className="mt-1 text-xs text-zinc-400">
            Substitua {exercise.name} mantendo o exato estímulo biomecânico:
          </Text>

          {/* Option A: Primary */}
          <Pressable
            onPress={() => {
              onSelectTier('A');
              onClose();
            }}
            className="mt-4"
          >
            <Card className={activeTier === 'A' ? 'border-blue-500' : ''}>
              <View className="flex-row items-center justify-between">
                <Badge label="Padrão Ouro (Principal)" tone="blue" />
                <Text
                  onPress={() => Linking.openURL(exercise.video_url)}
                  className="text-xs font-bold text-red-400"
                >
                  ▶ Ver Vídeo
                </Text>
              </View>
              <Text className="mt-2 text-sm font-bold text-zinc-100">{exercise.name}</Text>
              <Text className="mt-1 text-xs text-zinc-400">{exercise.bjj_benefit}</Text>
            </Card>
          </Pressable>

          {/* Options B & C */}
          {exercise.alternatives.map((alt) => (
            <Pressable
              key={alt.tier}
              onPress={() => {
                onSelectTier(alt.tier);
                onClose();
              }}
              className="mt-3"
            >
              <Card className={activeTier === alt.tier ? 'border-emerald-500' : ''}>
                <View className="flex-row items-center justify-between">
                  <Badge label={`Opção ${alt.tier} • ${alt.equipment}`} tone="emerald" />
                  <Text
                    onPress={() => Linking.openURL(alt.video_url)}
                    className="text-xs font-bold text-red-400"
                  >
                    ▶ Ver Vídeo
                  </Text>
                </View>
                <Text className="mt-2 text-sm font-bold text-zinc-100">{alt.name}</Text>
                <Text className="mt-1 text-xs text-zinc-400">{alt.reason_to_use}</Text>
              </Card>
            </Pressable>
          ))}

          <Button variant="secondary" label="Fechar" onPress={onClose} className="mt-5" />
        </View>
      </View>
    </Modal>
  );
}
