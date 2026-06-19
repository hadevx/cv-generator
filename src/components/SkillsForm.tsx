import { Plus, Trash2 } from 'lucide-react'
import type { Skill, SkillGroup } from '../types'

interface Props {
  items: SkillGroup[]
  onChange: (items: SkillGroup[]) => void
}

const levels: Skill['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

function newSkill(): Skill {
  return { id: crypto.randomUUID(), name: '', level: 'Intermediate' }
}

function newGroup(): SkillGroup {
  return { id: crypto.randomUUID(), name: '', skills: [newSkill()] }
}

export default function SkillsForm({ items, onChange }: Props) {
  const updateGroup = (gid: string, patch: Partial<SkillGroup>) =>
    onChange(items.map(g => (g.id === gid ? { ...g, ...patch } : g)))

  const removeGroup = (gid: string) => onChange(items.filter(g => g.id !== gid))

  const updateSkill = (gid: string, sid: string, patch: Partial<Skill>) =>
    updateGroup(gid, {
      skills: items.find(g => g.id === gid)!.skills.map(s => (s.id === sid ? { ...s, ...patch } : s)),
    })

  const removeSkill = (gid: string, sid: string) =>
    updateGroup(gid, { skills: items.find(g => g.id === gid)!.skills.filter(s => s.id !== sid) })

  const addSkill = (gid: string) =>
    updateGroup(gid, { skills: [...items.find(g => g.id === gid)!.skills, newSkill()] })

  return (
    <div className="space-y-4">
      {items.map(group => (
        <div key={group.id} className="border border-gray-200 rounded-xl bg-gray-50">
          {/* Group header */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 rounded-t-xl border-b border-gray-200">
            <input
              value={group.name}
              onChange={e => updateGroup(group.id, { name: e.target.value })}
              placeholder="Group name (e.g. Frontend)"
              className="flex-1 min-w-0 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              onClick={() => removeGroup(group.id)}
              title="Delete group"
              className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Skills list */}
          <div className="p-3 space-y-2">
            {group.skills.map(skill => (
              <div key={skill.id} className="flex items-center gap-2">
                <input
                  value={skill.name}
                  onChange={e => updateSkill(group.id, skill.id, { name: e.target.value })}
                  placeholder="Skill name"
                  className="flex-1 min-w-0 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <select
                  value={skill.level}
                  onChange={e => updateSkill(group.id, skill.id, { level: e.target.value as Skill['level'] })}
                  className="w-28 shrink-0 rounded-lg border border-gray-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <button
                  onClick={() => removeSkill(group.id, skill.id)}
                  title="Delete skill"
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addSkill(group.id)}
              className="w-full flex items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-lg py-1.5 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <Plus size={13} /> Add Skill
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => onChange([...items, newGroup()])}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        <Plus size={16} /> Add Group
      </button>
    </div>
  )
}
