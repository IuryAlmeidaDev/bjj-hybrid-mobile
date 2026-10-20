// mobile/src/services/api.ts
import { BjjCheckinPayload, WorkoutPlan } from '../types/workout';
import { FALLBACK_WORKOUTS } from '../data/fallbackSeed';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export interface WorkoutsSyncResponse {
  online: boolean;
  readiness_summary: string;
  workouts: Record<'A' | 'B' | 'C', WorkoutPlan>;
}

export interface SetLogPayload {
  workout_code: string;
  exercise_id: string;
  exercise_slug: string;
  chosen_tier: 'A' | 'B' | 'C';
  set_number: number;
  weight_kg: number;
  reps_done: number;
  rir: number;
}

function applyOfflineReadiness(
  baseWorkouts: Record<'A' | 'B' | 'C', WorkoutPlan>,
  payload: BjjCheckinPayload
): WorkoutsSyncResponse {
  const internalLoad = payload.rounds_count * payload.round_duration_min * payload.rpe_intensity;
  const isHeavy = payload.rpe_intensity >= 8 || internalLoad >= 200;
  const tags = payload.body_stress_tags || [];
  const updated = { ...baseWorkouts };

  (['A', 'B', 'C'] as const).forEach((code) => {
    updated[code] = {
      ...updated[code],
      exercises: updated[code].exercises.map((ex, idx) => {
        let adjustedSets = ex.default_sets;
        let recommendedRir = 1;
        let autoTier = ex.auto_swapped_to_tier;
        let autoReason = ex.auto_swap_reason;

        if (isHeavy) {
          recommendedRir = 2;
          if (idx === 0 && ex.default_sets > 2) {
            adjustedSets = ex.default_sets - 1;
          }
        }

        if (tags.includes('lombar')) {
          if (ex.slug === 'rdl_terra_romeno') {
            autoTier = 'C';
            autoReason = 'Auto-ajuste: Lombar fadigada do Jiu-Jitsu (Sem compressão axial)';
          } else if (ex.slug === 'agachamento_livre' || ex.slug === 'remada_curvada') {
            autoTier = 'B';
            autoReason = 'Auto-ajuste: Proteção lombar pós-rola';
          }
        }

        if (tags.includes('pegada')) {
          if (ex.slug === 'barra_fixa' || ex.slug === 'farmers_walk') {
            autoTier = 'B';
            autoReason = 'Auto-ajuste: Antebraço/Pegada fadigados do pano';
          }
        }

        if (tags.includes('ombro')) {
          if (ex.slug === 'supino_reto' || ex.slug === 'desenvolvimento_halteres') {
            autoTier = 'B';
            autoReason = 'Auto-ajuste: Estresse articular no ombro';
          }
        }

        if (tags.includes('pescoco')) {
          if (ex.slug === 'desenvolvimento_halteres') {
            autoTier = 'C';
            autoReason = 'Auto-ajuste: Cervical sensível (Máquina guiada)';
          }
        }

        return {
          ...ex,
          adjusted_sets: adjustedSets,
          recommended_rir: recommendedRir,
          auto_swapped_to_tier: autoTier,
          auto_swap_reason: autoReason,
        };
      }),
    };
  });

  const summary =
    isHeavy || tags.length > 0
      ? `Check-in (${payload.rounds_count} rolas • RPE ${payload.rpe_intensity}): Volume e exercícios ajustados`
      : `Check-in (${payload.rounds_count} rolas • RPE ${payload.rpe_intensity}): Prontidão 100% mantida`;

  return {
    online: false,
    readiness_summary: summary,
    workouts: updated,
  };
}

export async function fetchAllWorkoutsWithReadiness(): Promise<WorkoutsSyncResponse> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_BASE_URL}/api/workouts`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      online: true,
      readiness_summary: data.readiness_summary || 'Prontidão 100% — Volume padrão liberado (RIR 1–2)',
      workouts: data.workouts,
    };
  } catch {
    return {
      online: false,
      readiness_summary: 'Prontidão 100% — Volume padrão liberado (Modo Offline)',
      workouts: FALLBACK_WORKOUTS,
    };
  }
}

export async function submitBjjCheckin(payload: BjjCheckinPayload): Promise<WorkoutsSyncResponse> {
  try {
    const postRes = await fetch(`${API_BASE_URL}/api/bjj-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
    return await fetchAllWorkoutsWithReadiness();
  } catch {
    return applyOfflineReadiness(FALLBACK_WORKOUTS, payload);
  }
}

export async function resetReadinessState(): Promise<WorkoutsSyncResponse> {
  try {
    await fetch(`${API_BASE_URL}/api/bjj-sessions`, { method: 'DELETE' });
    return await fetchAllWorkoutsWithReadiness();
  } catch {
    return {
      online: false,
      readiness_summary: 'Prontidão 100% — Volume padrão restaurado',
      workouts: FALLBACK_WORKOUTS,
    };
  }
}

export async function submitSetLog(payload: SetLogPayload): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/sets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
