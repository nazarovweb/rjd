
const Nav = () => {
    return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4 shadow-xs">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded bg-red-600 px-2.5 py-1 text-lg font-black tracking-widest text-white">
            RJD
          </span>
          <span className="text-sm font-medium text-slate-500">
            Учёт экипировки вагонов
          </span>
        </div>

        {/* Status Legend for Workers & Management */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-xs bg-slate-300" /> Ожидает
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-xs bg-amber-400" /> В работе
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600" /> Готово
          </span>
        </div>
      </div>
    </nav>
    )
}

export default Nav