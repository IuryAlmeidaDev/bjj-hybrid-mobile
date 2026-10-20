// mobile/src/types/workout.ts
export type AlternativeTier = 'B' | 'C';

export interface ExerciseAlternative {
  id: string;
  tier: AlternativeTier;
  name: string;
  equipment: string;
  reason_to_use: string;
  video_url: string;
}

export interface ExerciseItem {
  id: string;
  slug: string;
  name: string;
  name_en: string;
  target_muscle: string;
  default_sets: number;
  adjusted_sets: number;
  recommended_rir: number;
  reps_range: string;
  rest_seconds: number;
  video_url: string;
  bjj_benefit: string;
  auto_swapped_to_tier?: AlternativeTier;
  auto_swap_reason?: string;
  alternatives: ExerciseAlternative[];
}

export interface WorkoutPlan {
  code: 'A' | 'B' | 'C';
  title: string;
  tag: string;
  description: string;
  exercises: ExerciseItem[];
}

export interface BjjCheckinPayload {
  rounds_count: number;
  round_duration_min: number;
  rpe_intensity: number;
  body_stress_tags: string[];
  notes?: string;
}
