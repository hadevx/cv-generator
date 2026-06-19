import { Plus, Trash2 } from 'lucide-react'
import type { Education } from '../types'
import { SortableList } from './Sortable'
import DateInput from './DateInput'

interface Props {
  items: Education[]
  onChange: (items: Education[]) => void
}

function newEducation(): Education {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: '',
  }
}

export default function EducationForm({ items, onChange }: Props) {
  const update = (id: string, patch: Partial<Education>) =>
    onChange(items.map(e => (e.id === id ? { ...e, ...patch } : e)))

  const remove = (id: string) => onChange(items.filter(e => e.id !== id))

  return (
    <div className="space-y-4">
      <SortableList items={items} onChange={onChange}>
        {(edu, dragHandle) => (
          <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {dragHandle}
                <span className="text-sm font-semibold text-gray-600">
                  {edu.institution || edu.degree || 'New Education'}
                </span>
              </div>
              <button onClick={() => remove(edu.id)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Institution</label>
              <input
                value={edu.institution}
                onChange={e => update(edu.id, { institution: e.target.value })}
                placeholder="University / School name"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Degree</label>
                <select
                  value={edu.degree}
                  onChange={e => update(edu.id, { degree: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select degree</option>
                  <option>High School Diploma</option>
                  <option>Associate's</option>
                  <option>Bachelor's</option>
                  <option>Master's</option>
                  <option>PhD</option>
                  <option>Certificate</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Field of Study</label>
                <input
                  value={edu.field}
                  onChange={e => update(edu.id, { field: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Start</label>
                <DateInput
                  value={edu.startDate}
                  onChange={v => update(edu.id, { startDate: v })}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">End</label>
                <DateInput
                  value={edu.endDate}
                  onChange={v => update(edu.id, { endDate: v })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">GPA</label>
                <input
                  value={edu.gpa}
                  onChange={e => update(edu.id, { gpa: e.target.value })}
                  placeholder="e.g. 3.8"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
              <textarea
                value={edu.description}
                onChange={e => update(edu.id, { description: e.target.value })}
                placeholder="Activities, achievements, relevant coursework..."
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
              />
            </div>
          </div>
        )}
      </SortableList>

      <button
        onClick={() => onChange([...items, newEducation()])}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        <Plus size={16} /> Add Education
      </button>
    </div>
  )
}
