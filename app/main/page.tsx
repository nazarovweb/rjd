'use client'

import { useEffect, useMemo, useState } from 'react'

// ---------- Типы ----------
type TaskType = 'застел' | 'перешот'
type TaskStatus = 'in_process' | 'done'
type StatusFilter = 'all' | TaskStatus
type PeriodFilter = 'today' | 'week' | 'month' | 'range'
type SortFilter = 'az' | 'za'

interface Task {
  id: number
  type: TaskType
  status: TaskStatus
  daysAgo: number // сколько дней назад
  hour: number // час начала
  sostav: number
  minutes: number
}

type DatedTask = Task & { date: string }

interface Worker {
  id: number
  fio: string
  color: string
  tasks: Task[]
}

// ---------- Фейковые данные (без new Date — безопасно для сборки) ----------
const workers: Worker[] = [
  {
    id: 1,
    fio: 'Иванов Сергей Петрович',
    color: 'bg-blue-500',
    tasks: [
      { id: 1, type: 'перешот', status: 'done', daysAgo: 0, hour: 8, sostav: 16, minutes: 45 },
      { id: 2, type: 'застел', status: 'in_process', daysAgo: 0, hour: 11, sostav: 28, minutes: 0 },
      { id: 3, type: 'застел', status: 'done', daysAgo: 3, hour: 9, sostav: 42, minutes: 60 },
      { id: 4, type: 'перешот', status: 'done', daysAgo: 12, hour: 9, sostav: 4, minutes: 30 },
      { id: 5, type: 'застел', status: 'done', daysAgo: 25, hour: 9, sostav: 16, minutes: 55 },
    ],
  },
  {
    id: 2,
    fio: 'Петрова Анна Викторовна',
    color: 'bg-rose-500',
    tasks: [
      { id: 6, type: 'застел', status: 'done', daysAgo: 0, hour: 7, sostav: 42, minutes: 50 },
      { id: 7, type: 'перешот', status: 'in_process', daysAgo: 1, hour: 9, sostav: 28, minutes: 0 },
      { id: 8, type: 'застел', status: 'done', daysAgo: 6, hour: 9, sostav: 16, minutes: 65 },
      { id: 9, type: 'перешот', status: 'done', daysAgo: 18, hour: 9, sostav: 4, minutes: 35 },
    ],
  },
  {
    id: 3,
    fio: 'Сидоров Дмитрий Андреевич',
    color: 'bg-emerald-600',
    tasks: [
      { id: 10, type: 'перешот', status: 'done', daysAgo: 0, hour: 9, sostav: 28, minutes: 40 },
      { id: 11, type: 'застел', status: 'done', daysAgo: 2, hour: 9, sostav: 4, minutes: 70 },
      { id: 12, type: 'перешот', status: 'in_process', daysAgo: 5, hour: 9, sostav: 42, minutes: 0 },
      { id: 13, type: 'застел', status: 'done', daysAgo: 15, hour: 9, sostav: 16, minutes: 45 },
      { id: 14, type: 'застел', status: 'done', daysAgo: 28, hour: 9, sostav: 28, minutes: 60 },
    ],
  },
  {
    id: 4,
    fio: 'Кузнецов Олег Иванович',
    color: 'bg-amber-500',
    tasks: [
      { id: 15, type: 'застел', status: 'in_process', daysAgo: 0, hour: 10, sostav: 16, minutes: 0 },
      { id: 16, type: 'перешот', status: 'done', daysAgo: 4, hour: 9, sostav: 42, minutes: 25 },
      { id: 17, type: 'застел', status: 'done', daysAgo: 9, hour: 9, sostav: 28, minutes: 55 },
      { id: 18, type: 'перешот', status: 'done', daysAgo: 22, hour: 9, sostav: 4, minutes: 40 },
    ],
  },
  {
    id: 5,
    fio: 'Смирнова Елена Дмитриевна',
    color: 'bg-violet-600',
    tasks: [
      { id: 19, type: 'перешот', status: 'done', daysAgo: 0, hour: 8, sostav: 4, minutes: 30 },
      { id: 20, type: 'застел', status: 'done', daysAgo: 0, hour: 12, sostav: 16, minutes: 50 },
      { id: 21, type: 'застел', status: 'in_process', daysAgo: 2, hour: 9, sostav: 42, minutes: 0 },
      { id: 22, type: 'перешот', status: 'done', daysAgo: 11, hour: 9, sostav: 28, minutes: 35 },
      { id: 23, type: 'застел', status: 'done', daysAgo: 20, hour: 9, sostav: 4, minutes: 65 },
    ],
  },
]

// ---------- Хелперы ----------
const buildDate = (base: Date, n: number, h: number): string => {
  const d = new Date(base)
  d.setDate(d.getDate() - n)
  d.setHours(h, 0, 0, 0)
  return d.toISOString()
}

const startOfToday = (base: Date): Date => {
  const d = new Date(base)
  d.setHours(0, 0, 0, 0)
  return d
}

const startOfWeek = (base: Date): Date => {
  const d = startOfToday(base)
  const day = d.getDay()
  const diff = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - diff)
  return d
}

const startOfMonth = (base: Date): Date => {
  const d = startOfToday(base)
  d.setDate(1)
  return d
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

const initials = (fio: string): string =>
  fio
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

function cn(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

// ---------- Компонент ----------
export default function Page() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('today')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortFilter, setSortFilter] = useState<SortFilter>('az')
  const [openWorkerId, setOpenWorkerId] = useState<number | null>(null)
  const [selectedTask, setSelectedTask] = useState<DatedTask | null>(null)
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
  }, [])

  // Даты вычисляются только на клиенте, после монтирования
  const datedWorkers = useMemo(() => {
    if (!now) return []
    return workers.map((w) => ({
      ...w,
      tasks: w.tasks.map((t) => ({ ...t, date: buildDate(now, t.daysAgo, t.hour) })),
    }))
  }, [now])

  const inPeriod = (iso: string): boolean => {
    if (!now) return false
    const d = new Date(iso)
    if (periodFilter === 'range') {
      if (dateFrom) {
        const from = new Date(dateFrom)
        from.setHours(0, 0, 0, 0)
        if (d < from) return false
      }
      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59, 999)
        if (d > to) return false
      }
      return true
    }
    if (periodFilter === 'today') return d >= startOfToday(now)
    if (periodFilter === 'week') return d >= startOfWeek(now)
    return d >= startOfMonth(now)
  }

  const filteredWorkers = useMemo(() => {
    const list = datedWorkers
      .map((w) => ({
        ...w,
        tasks: w.tasks.filter(
          (t) => (statusFilter === 'all' || t.status === statusFilter) && inPeriod(t.date)
        ),
      }))
      .filter((w) => w.tasks.length > 0 || statusFilter === 'all')

    list.sort((a, b) =>
      sortFilter === 'az' ? a.fio.localeCompare(b.fio, 'ru') : b.fio.localeCompare(a.fio, 'ru')
    )

    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datedWorkers, statusFilter, periodFilter, dateFrom, dateTo, sortFilter])

  const statusBtn = (active: boolean) =>
    cn(
      'flex-1 rounded-lg border px-2 py-2 text-sm font-medium',
      active
        ? 'border-slate-900 bg-slate-900 text-white'
        : 'border-slate-200 bg-white text-slate-600'
    )

  const periodBtn = (active: boolean) =>
    cn(
      'flex-1 rounded-lg border px-2 py-2 text-xs font-medium',
      active
        ? 'border-slate-900 bg-slate-900 text-white'
        : 'border-slate-200 bg-white text-slate-600'
    )

  // Пока даты не посчитаны (при prerender) — ничего не показываем
  if (!now) {
    return <div className="mx-auto max-w-md px-3 py-4" />
  }

  return (
    <div className="mx-auto max-w-md px-3 py-4">
      {/* Шапка */}
      <h1 className="text-lg font-bold text-slate-900">РЖД Белявик</h1>
      <p className="mb-4 text-sm text-slate-500">Главная бригадира</p>

      {/* Фильтр: статус */}
      <div className="mb-3 flex gap-2">
        <button className={statusBtn(statusFilter === 'all')} onClick={() => setStatusFilter('all')}>
          Все
        </button>
        <button
          className={statusBtn(statusFilter === 'in_process')}
          onClick={() => setStatusFilter('in_process')}
        >
          В процессе
        </button>
        <button
          className={statusBtn(statusFilter === 'done')}
          onClick={() => setStatusFilter('done')}
        >
          Выполнено
        </button>
      </div>

      {/* Фильтр: период */}
      <div className="mb-3 flex gap-2">
        <button className={periodBtn(periodFilter === 'today')} onClick={() => setPeriodFilter('today')}>
          Сегодня
        </button>
        <button className={periodBtn(periodFilter === 'week')} onClick={() => setPeriodFilter('week')}>
          Неделя
        </button>
        <button className={periodBtn(periodFilter === 'month')} onClick={() => setPeriodFilter('month')}>
          Месяц
        </button>
        <button className={periodBtn(periodFilter === 'range')} onClick={() => setPeriodFilter('range')}>
          Период
        </button>
      </div>

      {/* Период от/до */}
      {periodFilter === 'range' && (
        <div className="mb-3 flex gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-1/2 rounded-lg border border-slate-200 px-2 py-2 text-sm"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-1/2 rounded-lg border border-slate-200 px-2 py-2 text-sm"
          />
        </div>
      )}

      {/* Сортировка */}
      <div className="mb-3 flex gap-2">
        <button className={periodBtn(sortFilter === 'az')} onClick={() => setSortFilter('az')}>
          А-Я
        </button>
        <button className={periodBtn(sortFilter === 'za')} onClick={() => setSortFilter('za')}>
          Я-А
        </button>
      </div>

      {/* Список работников */}
      <div className="flex flex-col gap-3">
        {filteredWorkers.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">Нет данных за выбранный период</p>
        )}

        {filteredWorkers.map((w) => {
          const zastels = w.tasks.filter((t) => t.type === 'застел').length
          const pereshots = w.tasks.filter((t) => t.type === 'перешот').length
          const doneMinutes = w.tasks
            .filter((t) => t.status === 'done')
            .reduce((sum, t) => sum + t.minutes, 0)
          const isOpen = openWorkerId === w.id

          return (
            <div key={w.id} className="rounded-xl border border-slate-200 bg-white">
              {/* Шапка карточки: аватар | ФИО | счётчики */}
              <button
                onClick={() => setOpenWorkerId(isOpen ? null : w.id)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                    w.color
                  )}
                >
                  {initials(w.fio)}
                </div>
                <p className="flex-1 text-sm font-semibold text-slate-900">{w.fio}</p>
                <div className="flex gap-1.5">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    З {zastels}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    П {pereshots}
                  </span>
                </div>
              </button>

              {/* Аккордеон: статистика + задачи */}
              {isOpen && (
                <div className="border-t border-slate-100 p-3">
                  <p className="mb-2 text-xs text-slate-500">
                    Минут в выполненных задачах:{' '}
                    <span className="font-semibold text-slate-900">{doneMinutes}</span>
                  </p>

                  <ul className="flex flex-col gap-1.5">
                    {[...w.tasks]
                      .sort((a, b) => (a.type === b.type ? 0 : a.type === 'застел' ? -1 : 1))
                      .map((t) => (
                        <li key={t.id}>
                          <button
                            onClick={() => setSelectedTask(t)}
                            className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          >
                            <span className="font-medium text-slate-800">{t.type}</span>
                            <span className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">{formatDate(t.date)}</span>
                              <span
                                className={cn(
                                  'rounded-full px-2 py-0.5 text-xs font-medium',
                                  t.status === 'done'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                )}
                              >
                                {t.status === 'done' ? 'Выполнено' : 'В процессе'}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Модалка: детали задачи */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-base font-bold text-slate-900">{selectedTask.type}</p>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  selectedTask.status === 'done'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                )}
              >
                {selectedTask.status === 'done' ? 'Выполнено' : 'В процессе'}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between border-b border-slate-100 py-2">
                <span className="text-slate-500">Дата</span>
                <span className="font-medium text-slate-900">{formatDate(selectedTask.date)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-2">
                <span className="text-slate-500">Начало</span>
                <span className="font-medium text-slate-900">{formatTime(selectedTask.date)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-2">
                <span className="text-slate-500">Состав</span>
                <span className="font-medium text-slate-900">№ {selectedTask.sostav}</span>
              </div>
              {selectedTask.status === 'done' && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Время выполнения</span>
                  <span className="font-medium text-slate-900">{selectedTask.minutes} мин</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTask(null)}
              className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}