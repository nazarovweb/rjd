"use client";

import React, { useState } from "react";

type TaskType = "Pereshot" | "Zastel";

export interface BrigadierTask {
    id: number;
    type: TaskType;
    sostav: string;
    wagons: string[];
    rasxod?: number;
    ostatka?: number;
    createdAt: string;
}

export default function Brigadir() {
    const [taskType, setTaskType] = useState<TaskType>("Pereshot");
    const [sostav, setSostav] = useState<string>("28");
    const [wagonInput, setWagonInput] = useState<string>("");
    const [wagons, setWagons] = useState<string[]>(["22421", "24241"]);

    // Поля только для Pereshot
    const [rasxod, setRasxod] = useState<string>("150");
    const [ostatka, setOstatka] = useState<string>("30");

    // Список созданных заданий (для наглядности)
    const [tasks, setTasks] = useState<BrigadierTask[]>([]);

    // Добавление номера вагона
    const handleAddWagon = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = wagonInput.trim();
        if (!trimmed || wagons.includes(trimmed)) return;

        setWagons((prev) => [...prev, trimmed]);
        setWagonInput("");
    };

    // Удаление вагона из списка
    const handleRemoveWagon = (wagonToRemove: string) => {
        setWagons((prev) => prev.filter((w) => w !== wagonToRemove));
    };

    // Сохранение наряда
    const handleSaveTask = () => {
        if (!sostav.trim() || wagons.length === 0) {
            alert("Укажите номер состава и добавьте хотя бы один вагон.");
            return;
        }

        const newTask: BrigadierTask = {
            id: Date.now(),
            type: taskType,
            sostav: sostav.trim(),
            wagons,
            ...(taskType === "Pereshot" && {
                rasxod: Number(rasxod) || 0,
                ostatka: Number(ostatka) || 0,
            }),
            createdAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setTasks((prev) => [newTask, ...prev]);
        setWagons([]);
        setWagonInput("");
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-6">
            {/* Шапка панели бригадира */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <span className="inline-block rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                        Рабочее место бригадира
                    </span>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900">
                        Назначение состава
                    </h1>
                </div>
                <div
                    title="Бригадир"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-amber-400 ring-2 ring-amber-400"
                >
                    БР
                </div>
            </div>

            {/* Основная форма */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {/* 1. Переключатель типа задачи */}
                <div className="mb-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        1. Выберите тип работы
                    </label>
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                        {(["Pereshot", "Zastel"] as TaskType[]).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setTaskType(type)}
                                className={`rounded-lg py-2.5 text-sm font-bold transition ${taskType === type
                                    ? "bg-slate-900 text-white shadow-xs"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Номер состава */}
                <div className="mb-5">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        2. Номер состава
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Например: 28"
                        value={sostav}
                        onChange={(e) => setSostav(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-lg font-bold text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                    />
                </div>

                {/* 3. Добавление вагонов */}
                <div className="mb-5">
                    <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            3. Номера вагонов
                        </label>
                        <span className="text-xs font-semibold text-slate-500">
                            Всего вагонов: {wagons.length}
                        </span>
                    </div>

                    <form onSubmit={handleAddWagon} className="flex gap-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Номер вагона (напр. 22421)"
                            value={wagonInput}
                            onChange={(e) => setWagonInput(e.target.value)}
                            className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-95"
                        >
                            + Добавить
                        </button>
                    </form>

                    {/* Список добавленных вагонов */}
                    {wagons.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {wagons.map((code, idx) => (
                                <span
                                    key={code}
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800"
                                >
                                    <span className="text-xs font-normal text-slate-400">
                                        #{idx + 1}
                                    </span>
                                    {code}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveWagon(code)}
                                        className="ml-1 text-slate-400 hover:text-red-600"
                                        title="Удалить"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-2 text-xs text-slate-400">
                            Добавьте номера вагонов для этого состава.
                        </p>
                    )}
                </div>

                {/* 4. Поля расхода и остатка (только для Pereshot) */}
                {taskType === "Pereshot" && (
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-900">
                            4. Учёт комплектов (Pereshot)
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700">
                                    Расход (комплект)
                                </label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={rasxod}
                                    onChange={(e) => setRasxod(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-lg font-bold text-slate-900 focus:border-slate-900 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700">
                                    Остаток
                                </label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={ostatka}
                                    onChange={(e) => setOstatka(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-lg font-bold text-slate-900 focus:border-slate-900 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Кнопка сохранения */}
                <button
                    type="button"
                    onClick={handleSaveTask}
                    className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
                >
                    Сохранить ({taskType})
                </button>
            </div>

            {/* Список созданных нарядов */}
            {tasks.length > 0 && (
                <div className="mt-6">
                    <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Активные наряды ({tasks.length})
                    </h2>
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div 
                                key={task.id}
                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">
                                            {task.type}
                                        </span>
                                        <span className="text-sm font-bold text-slate-800">
                                            Состав №{task.sostav}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            • {task.createdAt}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-600">
                                        Вагоны ({task.wagons.length}):{" "}
                                        <span className="font-semibold">
                                            {task.wagons.join(", ")}
                                        </span>
                                    </p>
                                </div>

                                <p className="font-bold text-slate-800">
                                    Расход: {task.rasxod}
                                </p>
                                <p className="font-semibold text-amber-600">
                                    Остаток: {task.ostatka}
                                </p>
                            </div>))}
                    </div>
                </div>)}
        </div>
    )
}

