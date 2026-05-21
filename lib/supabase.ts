export type Plan = "free" | "pro" | "team";

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 5,
  pro: Infinity,
  team: Infinity,
};
