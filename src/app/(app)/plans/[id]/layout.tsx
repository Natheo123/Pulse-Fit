import { PROGRAMS } from "@/lib/data/programs";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ id: p.id }));
}

export default function PlanIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
