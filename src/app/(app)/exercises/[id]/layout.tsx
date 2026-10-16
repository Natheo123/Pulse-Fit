import { EXERCISES } from "@/lib/data/exercises";

export function generateStaticParams() {
  return EXERCISES.map((e) => ({ id: e.id }));
}

export default function ExerciseIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
