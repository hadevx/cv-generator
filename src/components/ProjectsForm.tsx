import { Plus, Trash2 } from 'lucide-react'
import type { Project } from '../types'
import { SortableList } from './Sortable'

interface Props {
  items: Project[]
  onChange: (items: Project[]) => void
}

function newProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    url: '',
    technologies: '',
  }
}

export default function ProjectsForm({ items, onChange }: Props) {
  const update = (id: string, patch: Partial<Project>) =>
    onChange(items.map(p => (p.id === id ? { ...p, ...patch } : p)))

  const remove = (id: string) => onChange(items.filter(p => p.id !== id))

  return (
    <div className="space-y-4">
      <SortableList items={items} onChange={onChange}>
        {(proj, dragHandle) => (
          <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {dragHandle}
                <span className="text-sm font-semibold text-gray-600">
                  {proj.name || 'New Project'}
                </span>
              </div>
              <button onClick={() => remove(proj.id)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Project Name</label>
                <input
                  value={proj.name}
                  onChange={e => update(proj.id, { name: e.target.value })}
                  placeholder="My Awesome Project"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">URL / Link</label>
                <input
                  value={proj.url}
                  onChange={e => update(proj.id, { url: e.target.value })}
                  placeholder="github.com/you/project"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Technologies</label>
              <input
                value={proj.technologies}
                onChange={e => update(proj.id, { technologies: e.target.value })}
                placeholder="React, Node.js, PostgreSQL..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
              <textarea
                value={proj.description}
                onChange={e => update(proj.id, { description: e.target.value })}
                rows={2}
                placeholder="What does this project do? What problem does it solve?"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
              />
            </div>
          </div>
        )}
      </SortableList>

      <button
        onClick={() => onChange([...items, newProject()])}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        <Plus size={16} /> Add Project
      </button>
    </div>
  )
}
