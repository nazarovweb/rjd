import Nav from "@/components/Nav";
import TaskCard, { StatItem } from "@/components/TaskCard";

const PERESHOT_STATS: StatItem[] = [
  { id: "prostin", label: "Простыня", defaultValue: 150 },
  { id: "pododeyalnik", label: "Пододеяльник", defaultValue: 150 },
  { id: "navolochka", label: "Наволочка", defaultValue: 150 },
  { id: "maxra", label: "Полотенце", defaultValue: 150 },
  { id: "meshok", label: "Мешок", defaultValue: 15 },
];

const ZASTEL_STATS: StatItem[] = [
  { id: "komplekt", label: "Комплект", defaultValue: 18 },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 pb-12">
      <Nav />
      <TaskCard title="Pereshot" sostavNumber={28} statFields={PERESHOT_STATS} />
      <TaskCard title="Zastel" sostavNumber={16} statFields={ZASTEL_STATS} />
    </main>
  );
}
