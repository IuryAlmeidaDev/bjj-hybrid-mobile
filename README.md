# 📱 BJJ Hybrid Mobile (React Native + Expo + React Native Reusables)

Aplicativo mobile para atletas híbridos de **Jiu-Jítsu e Musculação**, construído com **React Native (Expo)**, **NativeWind v4 (Tailwind CSS)** e componentes no padrão **[React Native Reusables](https://reactnativereusables.com/) (`shadcn/ui`)**.

## ⚡ Funcionalidades Principais

- **Dashboard Semanal & Score de Prontidão (`HomeScreen.tsx`):** Linha do tempo integrada (Seg/Qua/Sex Jiu-Jítsu às 20h30, Ter/Qui/Sáb Musculação, Dom Descanso Total).
- **Troca Rápida de Aparelho Ocupado (`SwapSheetModal.tsx`):** Substitua qualquer exercício com 1 toque pelo **Plano B** ou **Plano C** mantendo o estímulo biomecânico.
- **Timer de Descanso Flutuante com Feedback Háptico (`FloatingRestTimer.tsx`):** Dispara automaticamente ao concluir uma série e vibra quando o tempo zera.
- **Check-in Pós-Jiu de 30 Segundos (`BjjCheckinModal.tsx`):** Registro rápido de rolas, RPE (1-10) e mapa de desgaste articular (`ombro`, `lombar`, `pegada`, `joelho`, `pescoço`) que recalibra o treino do dia seguinte.
- **Offline-First (`fallbackSeed.ts`):** Funciona mesmo em academias sem sinal de internet, com os 19 exercícios principais e 38 alternativas pré-carregados.

## 🛠️ Como Executar

```bash
npm install
npx expo start
```
