import type { Equipment, Exercise } from "./types";

/**
 * Règles d'accès :
 * - salle complète → tout le catalogue
 * - sinon → exercices dont l'équipement chevauche le profil
 * - + toujours les mouvements poids du corps ("rien")
 */
export function allowedEquipment(userEquipment: Equipment[] | undefined | null): Equipment[] | "all" {
  if (!userEquipment?.length) return "all";
  if (userEquipment.includes("full_gym")) return "all";
  const set = new Set<Equipment>(userEquipment);
  set.add("bodyweight");
  return [...set];
}

export function matchesUserEquipment(
  exercise: Pick<Exercise, "equipment">,
  userEquipment: Equipment[] | undefined | null
) {
  const allowed = allowedEquipment(userEquipment);
  if (allowed === "all") return true;
  return exercise.equipment.some((eq) => allowed.includes(eq));
}

export function filterByEquipment<T extends Pick<Exercise, "equipment">>(
  exercises: T[],
  userEquipment: Equipment[] | undefined | null
) {
  return exercises.filter((e) => matchesUserEquipment(e, userEquipment));
}

export const EQUIPMENT_FR: Record<Equipment, string> = {
  full_gym: "Salle",
  dumbbells: "Haltères",
  machines: "Machines",
  home: "Maison",
  bodyweight: "Poids du corps",
};
