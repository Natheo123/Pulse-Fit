"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import { getExercise } from "../data/exercises";
import { getProgram } from "../data/programs";
import { estimate1RM, recommendProgression } from "../progression";
import type {
  AccentColor,
  Equipment,
  FitnessLevel,
  Goal,
  LoggedSet,
  PersonalRecord,
  ProgressionRecommendation,
  ThemePrefs,
  UserProfile,
  WorkoutSession,
} from "../types";

export interface CustomWorkout {
  id: string;
  title: string;
  exerciseIds: string[];
  createdAt: string;
}

interface AppState {
  user: UserProfile | null;
  theme: ThemePrefs;
  activeProgramId: string | null;
  sessions: WorkoutSession[];
  activeSessionId: string | null;
  lastFinishedSessionId: string | null;
  recommendations: ProgressionRecommendation[];
  records: PersonalRecord[];
  syncQueue: string[];
  customWorkouts: CustomWorkout[];
  /** Profils sauvegardés par email — survivent à la déconnexion */
  accounts: Record<string, UserProfile>;

  register: (email: string, name: string, password: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateOnboarding: (data: {
    level: FitnessLevel;
    goals: Goal[];
    equipment: Equipment[];
    daysPerWeek: number;
    sessionMinutes: number;
    limitations?: string;
  }) => void;
  setTheme: (partial: Partial<ThemePrefs>) => void;
  setActiveProgram: (programId: string) => void;
  startSession: (opts: {
    programId?: string;
    dayId?: string;
    title: string;
    exerciseIds?: string[];
  }) => string;
  saveCustomWorkout: (title: string, exerciseIds: string[]) => string;
  pauseSession: () => void;
  resumeSession: () => void;
  tickSession: (seconds?: number) => void;
  updateSet: (
    exerciseId: string,
    setId: string,
    patch: Partial<LoggedSet>
  ) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string) => void;
  finishSession: () => string | null;
  decideRecommendation: (
    id: string,
    decision: "accepted" | "rejected" | "modified"
  ) => void;
  markSynced: (sessionId: string) => void;
}

const DEMO_PASSWORD_KEY = "pulsefit_demo_auth";

function emptySets(count: number, weight = 20): LoggedSet[] {
  return Array.from({ length: count }, (_, i) => ({
    id: uuid(),
    setNumber: i + 1,
    reps: 0,
    weight,
    rir: 2,
    completed: false,
  }));
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: { mode: "dark", accent: "lime", unit: "kg" },
      activeProgramId: null,
      sessions: [],
      activeSessionId: null,
      lastFinishedSessionId: null,
      recommendations: [],
      records: [],
      syncQueue: [],
      customWorkouts: [],
      accounts: {},

      register: (email, name) => {
        const normalized = email.trim().toLowerCase();
        const saved = get().accounts[normalized];
        const user: UserProfile = saved
          ? { ...saved, name: name.trim() || saved.name }
          : {
              id: uuid(),
              email: normalized,
              name: name.trim() || "Athlète",
              isPremium: false,
              onboardingComplete: false,
              level: null,
              goals: [],
              equipment: [],
              daysPerWeek: 3,
              sessionMinutes: 60,
              limitations: "",
              createdAt: new Date().toISOString(),
            };
        if (typeof window !== "undefined") {
          localStorage.setItem(DEMO_PASSWORD_KEY, normalized);
        }
        set((s) => ({
          user,
          accounts: { ...s.accounts, [normalized]: user },
        }));
        return true;
      },

      login: (email) => {
        const normalized = email.trim().toLowerCase();
        const current = get().user;
        if (current && current.email === normalized) {
          return true;
        }
        const saved = get().accounts[normalized];
        if (saved) {
          set({ user: saved });
          return true;
        }
        // Nouvel email inconnu → compte fresh (questionnaire requis)
        const user: UserProfile = {
          id: uuid(),
          email: normalized,
          name: normalized.split("@")[0] || "Athlète",
          isPremium: false,
          onboardingComplete: false,
          level: null,
          goals: [],
          equipment: [],
          daysPerWeek: 3,
          sessionMinutes: 60,
          limitations: "",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          user,
          accounts: { ...s.accounts, [normalized]: user },
        }));
        return true;
      },

      logout: () => {
        const user = get().user;
        if (user) {
          set((s) => ({
            user: null,
            activeSessionId: null,
            accounts: { ...s.accounts, [user.email]: user },
          }));
        } else {
          set({ user: null, activeSessionId: null });
        }
      },

      updateOnboarding: (data) => {
        const user = get().user;
        if (!user) return;
        const next: UserProfile = {
          ...user,
          ...data,
          limitations: data.limitations ?? user.limitations,
          onboardingComplete: true,
        };
        set((s) => ({
          user: next,
          accounts: { ...s.accounts, [next.email]: next },
        }));
      },

      setTheme: (partial) => set({ theme: { ...get().theme, ...partial } }),

      setActiveProgram: (programId) => set({ activeProgramId: programId }),

      startSession: ({ programId, dayId, title, exerciseIds }) => {
        const program = programId ? getProgram(programId) : undefined;
        const day = program?.days.find((d) => d.id === dayId) ?? program?.days[0];

        let exercises;
        if (exerciseIds?.length) {
          exercises = exerciseIds.map((exerciseId) => {
            const ex = getExercise(exerciseId);
            return {
              exerciseId,
              sets: emptySets(
                ex?.defaultSets ?? 3,
                ex?.level === "beginner" ? 20 : 40
              ),
            };
          });
        } else {
          exercises = (day?.exercises ?? []).map((pe) => {
            const ex = getExercise(pe.exerciseId);
            return {
              exerciseId: pe.exerciseId,
              sets: emptySets(pe.sets, ex?.level === "beginner" ? 20 : 40),
            };
          });
        }

        const session: WorkoutSession = {
          id: uuid(),
          programId,
          dayId: day?.id,
          title,
          status: "active",
          startedAt: new Date().toISOString(),
          elapsedSeconds: 0,
          exercises,
          syncStatus: "pending",
        };

        set((s) => ({
          sessions: [session, ...s.sessions],
          activeSessionId: session.id,
          syncQueue: [...s.syncQueue, session.id],
        }));
        return session.id;
      },

      saveCustomWorkout: (title, exerciseIds) => {
        const id = uuid();
        set((s) => ({
          customWorkouts: [
            {
              id,
              title: title.trim() || "Ma séance",
              exerciseIds,
              createdAt: new Date().toISOString(),
            },
            ...s.customWorkouts,
          ],
        }));
        return id;
      },

      pauseSession: () => {
        const id = get().activeSessionId;
        if (!id) return;
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id
              ? { ...sess, status: "paused", pausedAt: new Date().toISOString() }
              : sess
          ),
        }));
      },

      resumeSession: () => {
        const id = get().activeSessionId;
        if (!id) return;
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id
              ? { ...sess, status: "active", pausedAt: undefined }
              : sess
          ),
        }));
      },

      tickSession: (seconds = 1) => {
        const id = get().activeSessionId;
        if (!id) return;
        const sess = get().sessions.find((x) => x.id === id);
        if (!sess || sess.status !== "active") return;
        set((s) => ({
          sessions: s.sessions.map((x) =>
            x.id === id ? { ...x, elapsedSeconds: x.elapsedSeconds + seconds } : x
          ),
        }));
      },

      updateSet: (exerciseId, setId, patch) => {
        const id = get().activeSessionId;
        if (!id) return;
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== id) return sess;
            return {
              ...sess,
              exercises: sess.exercises.map((ex) => {
                if (ex.exerciseId !== exerciseId) return ex;
                return {
                  ...ex,
                  sets: ex.sets.map((st) =>
                    st.id === setId ? { ...st, ...patch } : st
                  ),
                };
              }),
              syncStatus: "pending",
            };
          }),
          syncQueue: s.syncQueue.includes(id) ? s.syncQueue : [...s.syncQueue, id],
        }));
      },

      completeSet: (exerciseId, setId) => {
        get().updateSet(exerciseId, setId, {
          completed: true,
          completedAt: new Date().toISOString(),
        });
      },

      addSet: (exerciseId) => {
        const id = get().activeSessionId;
        if (!id) return;
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== id) return sess;
            return {
              ...sess,
              exercises: sess.exercises.map((ex) => {
                if (ex.exerciseId !== exerciseId) return ex;
                const last = ex.sets[ex.sets.length - 1];
                return {
                  ...ex,
                  sets: [
                    ...ex.sets,
                    {
                      id: uuid(),
                      setNumber: ex.sets.length + 1,
                      reps: last?.reps ?? 0,
                      weight: last?.weight ?? 20,
                      rir: last?.rir ?? 2,
                      completed: false,
                    },
                  ],
                };
              }),
            };
          }),
        }));
      },

      removeSet: (exerciseId) => {
        const id = get().activeSessionId;
        if (!id) return;
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== id) return sess;
            return {
              ...sess,
              exercises: sess.exercises.map((ex) => {
                if (ex.exerciseId !== exerciseId || ex.sets.length <= 1) return ex;
                return {
                  ...ex,
                  sets: ex.sets.slice(0, -1).map((st, i) => ({
                    ...st,
                    setNumber: i + 1,
                  })),
                };
              }),
            };
          }),
        }));
      },

      finishSession: () => {
        const id = get().activeSessionId;
        if (!id) return null;
        const session = get().sessions.find((s) => s.id === id);
        if (!session) return null;

        // Auto-complete sets that have reps entered but not checked
        const normalizedExercises = session.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((st) =>
            !st.completed && st.reps > 0
              ? {
                  ...st,
                  completed: true,
                  completedAt: new Date().toISOString(),
                }
              : st
          ),
        }));

        const completed: WorkoutSession = {
          ...session,
          exercises: normalizedExercises,
          status: "completed",
          completedAt: new Date().toISOString(),
          syncStatus: "pending",
        };

        const newRecs: ProgressionRecommendation[] = [];
        const newRecords = [...get().records];

        for (const exLog of completed.exercises) {
          const ex = getExercise(exLog.exerciseId);
          const rec = recommendProgression(
            completed,
            exLog,
            ex?.defaultReps ?? [8, 12]
          );
          if (rec) newRecs.push(rec);

          for (const st of exLog.sets.filter((x) => x.completed && x.weight > 0)) {
            const e1rm = estimate1RM(st.weight, st.reps);
            const prev = newRecords.find((r) => r.exerciseId === exLog.exerciseId);
            if (!prev || e1rm > prev.estimated1rm) {
              const entry: PersonalRecord = {
                exerciseId: exLog.exerciseId,
                weight: st.weight,
                reps: st.reps,
                estimated1rm: e1rm,
                achievedAt: new Date().toISOString(),
                sessionId: completed.id,
              };
              if (prev) {
                const idx = newRecords.findIndex(
                  (r) => r.exerciseId === exLog.exerciseId
                );
                newRecords[idx] = entry;
              } else {
                newRecords.push(entry);
              }
            }
          }
        }

        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id ? completed : sess
          ),
          activeSessionId: null,
          lastFinishedSessionId: id,
          recommendations: [...newRecs, ...s.recommendations],
          records: newRecords,
          syncQueue: s.syncQueue.includes(id) ? s.syncQueue : [...s.syncQueue, id],
        }));
        return id;
      },

      decideRecommendation: (id, decision) => {
        set((s) => ({
          recommendations: s.recommendations.map((r) =>
            r.id === id ? { ...r, userDecision: decision } : r
          ),
        }));
      },

      markSynced: (sessionId) => {
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId ? { ...sess, syncStatus: "synced" } : sess
          ),
          syncQueue: s.syncQueue.filter((id) => id !== sessionId),
        }));
      },
    }),
    {
      name: "pulsefit-storage-v1",
      partialize: (s) => ({
        user: s.user,
        theme: s.theme,
        activeProgramId: s.activeProgramId,
        sessions: s.sessions,
        activeSessionId: s.activeSessionId,
        lastFinishedSessionId: s.lastFinishedSessionId,
        recommendations: s.recommendations,
        records: s.records,
        syncQueue: s.syncQueue,
        customWorkouts: s.customWorkouts,
        accounts: s.accounts,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.user) return;
        if (!state.accounts) state.accounts = {};
        if (!state.accounts[state.user.email]) {
          state.accounts[state.user.email] = state.user;
        }
      },
    }
  )
);

export function useActiveSession() {
  return useAppStore((s) =>
    s.sessions.find((x) => x.id === s.activeSessionId) ?? null
  );
}

export type { AccentColor };
