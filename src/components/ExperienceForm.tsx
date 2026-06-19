import { Plus, Trash2 } from 'lucide-react'
import type { Experience } from '../types'
import { SortableList } from './Sortable'
import DateInput from './DateInput'

interface Props {
  items: Experience[]
  onChange: (items: Experience[]) => void
}

function newExperience(): Experience {
  return {
    id: crypto.randomUUID(),
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  }
}

export default function ExperienceForm({ items, onChange }: Props) {
  const update = (id: string, patch: Partial<Experience>) =>
    onChange(items.map(e => (e.id === id ? { ...e, ...patch } : e)))

  const remove = (id: string) => onChange(items.filter(e => e.id !== id))

  return (
    <div className="space-y-4">
      <SortableList items={items} onChange={onChange}>
        {(exp, dragHandle) => (
          <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {dragHandle}
                <span className="text-sm font-semibold text-gray-600">
                  {exp.role || exp.company || 'New Experience'}
                </span>
              </div>
              <button
                onClick={() => remove(exp.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Company</label>
                <input
                  value={exp.company}
                  onChange={e => update(exp.id, { company: e.target.value })}
                  placeholder="Company name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Job Title</label>
                <input
                  value={exp.role}
                  onChange={e => update(exp.id, { role: e.target.value })}
                  placeholder="Role / Position"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Start Date</label>
                <DateInput
                  value={exp.startDate}
                  onChange={v => update(exp.id, { startDate: v })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">End Date</label>
                <DateInput
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={v => update(exp.id, { endDate: v })}
                />
                <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer mt-1.5">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={e => update(exp.id, { current: e.target.checked, endDate: '' })}
                    className="rounded"
                  />
                  Currently working here
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
              <textarea
                value={exp.description}
                onChange={e => update(exp.id, { description: e.target.value })}
                rows={3}
                placeholder="Describe your responsibilities and achievements..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
              />
            </div>
          </div>
        )}
      </SortableList>

      <button
        onClick={() => onChange([...items, newExperience()])}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        <Plus size={16} /> Add Experience
      </button>
    </div>
  )
}
