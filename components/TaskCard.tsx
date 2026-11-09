"use client";

import { useState, useEffect } from "react";

export interface StatItem {
    id: string;
    label: string;
    defaultValue: number;
}

interface Wagon {
    num: number;
    code: string;
    status: "todo" | "pending" | "done";
}

interface TaskCardProps {
    title: string;
    sostavNumber: string | number;
    statFields: StatItem[];
}

// Mock data matching your wagon list
const INITIAL_WAGONS: Wagon[] = [
    { num: 1, code: "22421", status: "todo" },
    { num: 2, code: "24241", status: "todo" },
    { num: 3, code: "22245", status: "todo" },
    { num: 4, code: "22514", status: "todo" },
    { num: 5, code: "23412", status: "todo" },
    { num: 6, code: "25122", status: "todo" },
    { num: 7, code: "25432", status: "todo" },
    { num: 8, code: "25353", status: "todo" },
    { num: 9, code: "02000", status: "todo" },
    { num: 10, code: "02001", status: "todo" },
    { num: 11, code: "16004", status: "todo" },
    { num: 12, code: "10212", status: "todo" },
    { num: 13, code: "10545", status: "todo" },
    { num: 14, code: "14545", status: "todo" },
    { num: 15, code: "15422", status: "pending" },
    { num: 16, code: "16521", status: "done" },
    { num: 17, code: "17535", status: "pending" },
    { num: 18, code: "18533", status: "done" },
];

export default function TaskCard({ title, sostavNumber, statFields }: TaskCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedWagon, setSelectedWagon] = useState<string | null>(null);
    const [isStarted, setIsStarted] = useState(false);
    const [secondsElapsed, setSecondsElapsed] = useState(0);

    // Store dynamic input values for counters
    const [counts, setCounts] = useState<Record<string, number>>(() =>
        statFields.reduce((acc, item) => ({ ...acc, [item.id]: item.defaultValue }), {})
    );

    // Safe timer management
    useEffect(() => {
        if (!isStarted) return;
        const interval = setInterval(() => {
            setSecondsElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isStarted]);

    const handleCountChange = (id: string, delta: number) => {
        setCounts((prev) => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + delta),
        }));
    };

    const handleInputChange = (id: string, value: string) => {
        const parsed = parseInt(value, 10);
        setCounts((prev) => ({
            ...prev,
            [id]: isNaN(parsed) ? 0 : Math.max(0, parsed),
        }));
    };

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins > 0 ? `${mins}:` : ""}${secs < 10 && mins > 0 ? "0" : ""}${secs}s`;
    };

    const getStatusColor = (status: Wagon["status"]) => {
        if (status === "done") return "bg-emerald-600 text-white border-emerald-700";
        if (status === "pending") return "bg-amber-400 text-slate-900 border-amber-500";
        return "bg-slate-200 text-slate-700 border-slate-300";
    };

    return (
        <div className="mx-auto max-w-3xl px-4 mt-5">
            {/* Main Task Card */}
            <div
                onClick={() => {
                    setIsExpanded(!isExpanded);
                    if (isExpanded) setSelectedWagon(null);
                }}
                className="flex cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
                {/* Brigade Sidebar */}
                <div className="flex w-14 flex-col items-center justify-center gap-2 bg-slate-800 py-3">
                    <span title="Бригадир" className="h-6 w-6 rounded-full bg-amber-400 ring-2 ring-white" />
                    <span className="h-5 w-5 rounded-full bg-slate-500" />
                    <span className="h-5 w-5 rounded-full bg-slate-500" />
                    <span className="h-5 w-5 rounded-full bg-slate-500" />
                </div>

                {/* Center Info & Wagon Grid */}
                <div className="flex-1 p-2">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm  uppercase text-slate-800">
                            {title}
                        </h2>
                        <span className="text-xs font-medium text-slate-500">
                            {isExpanded ? "Скрыть ▲" : "Выбрать▼"}
                        </span>
                    </div>

                    {/* Mini Wagon Status Indicators */}
                    <div className="flex flex-wrap gap-1.5">
                        {INITIAL_WAGONS.map((w) => (
                            <span
                                key={w.num}
                                className={`flex h-6 w-6 items-center justify-center rounded border text-xs font-semibold ${getStatusColor(
                                    w.status
                                )}`}
                            >
                                {w.num}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right Sostav Badge */}
                <div className="flex w-20 flex-col items-center justify-center bg-amber-500 px-3 text-slate-950">
                    <span className="text-xl font-extrabold leading-none">{sostavNumber}</span>
                    <span className="mt-1 text-xs font-semibold uppercase tracking-wide opacity-80">
                        состав
                    </span>
                </div>
            </div>

            {/* Step 1: Horizontal Wagon Code Selector */}
            {isExpanded && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Выберите номер вагона:
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {INITIAL_WAGONS.map((w) => {
                            const isSelected = selectedWagon === w.code;
                            return (
                                <button
                                    key={w.code}
                                    onClick={() => setSelectedWagon(w.code)}
                                    className={`shrink-0 rounded-lg border px-4 py-2.5 text-sm font-bold transition ${isSelected
                                        ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                        }`}
                                >
                                    <span className="block text-[10px] font-normal opacity-70">№ {w.num}</span>
                                    {w.code}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 2: Work Controls & Linen Counters */}
            {selectedWagon && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <span className="text-xs text-slate-500">Активный вагон</span>
                            <h3 className="text-lg font-bold text-slate-900">Вагон #{selectedWagon}</h3>
                        </div>
                        {isStarted && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                В работе
                            </span>
                        )}
                    </div>

                    {/* Counters List (Only shown after starting work) */}
                    {isStarted && (
                        <div className="divide-y divide-slate-100 my-2">
                            {statFields.map((field) => (
                                <div key={field.id} className="flex items-center justify-between py-3">
                                    <span className="text-base font-medium text-slate-800">{field.label}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleCountChange(field.id, -1)}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-slate-50 text-xl font-bold text-slate-700 active:bg-slate-200"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            value={counts[field.id]}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            className="h-10 w-16 rounded-lg border border-slate-300 text-center text-base font-bold text-slate-900 focus:border-slate-900 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleCountChange(field.id, 1)}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-xl font-bold text-white active:bg-slate-700"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons & Timer */}
                    <div className="mt-4 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                if (!isStarted) {
                                    setIsStarted(true);
                                } else {
                                    // Handle save logic here
                                    setIsStarted(false);
                                    setSelectedWagon(null);
                                    setSecondsElapsed(0);
                                }
                            }}
                            className={`flex-1 rounded-xl py-3.5 text-lg font-bold text-white shadow-sm transition ${isStarted
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-slate-900 hover:bg-slate-800"
                                }`}
                        >
                            {isStarted ? "Сохранить и завершить" : "Начать работу"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedWagon(null)}
                            title="Закрыть панель"
                            className="flex h-14 min-w-[90px] items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 px-4 font-mono text-xl font-bold text-slate-800 hover:bg-slate-100"
                        >
                            {formatTime(secondsElapsed)}
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}