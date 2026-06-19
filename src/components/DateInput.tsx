const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface Props {
  value: string       // stored as "YYYY-MM" or ""
  onChange: (v: string) => void
  disabled?: boolean
  placeholder?: string
}

function parse(v: string): { month: string; year: string } {
  if (!v) return { month: '', year: '' }
  const [y, m] = v.split('-')
  return { month: m ?? '', year: y ?? '' }
}

function build(month: string, year: string): string {
  if (!month && !year) return ''
  if (!year) return ''
  if (!month) return `${year}`
  return `${year}-${month}`
}

export default function DateInput({ value, onChange, disabled, placeholder }: Props) {
  const { month, year } = parse(value)

  const setMonth = (m: string) => onChange(build(m, year))
  const setYear = (y: string) => {
    const clean = y.replace(/\D/g, '').slice(0, 4)
    onChange(build(month, clean))
  }

  const base =
    'rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40'

  return (
    <div className="flex gap-1.5">
      <select
        value={month}
        disabled={disabled}
        onChange={e => setMonth(e.target.value)}
        className={`${base} flex-1 px-2 py-2 min-w-0`}
      >
        <option value="">{placeholder ?? 'Month'}</option>
        {MONTHS.map((name, i) => {
          const val = String(i + 1).padStart(2, '0')
          return <option key={val} value={val}>{name}</option>
        })}
      </select>
      <input
        type="number"
        value={year}
        disabled={disabled}
        onChange={e => setYear(e.target.value)}
        placeholder="Year"
        min={1950}
        max={2099}
        className={`${base} w-20 px-2 py-2`}
      />
    </div>
  )
}
