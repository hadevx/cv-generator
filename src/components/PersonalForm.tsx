import type { PersonalInfo } from '../types'

interface Props {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

const field = (
  label: string,
  key: keyof PersonalInfo,
  data: PersonalInfo,
  onChange: (data: PersonalInfo) => void,
  type = 'text',
  placeholder = '',
) => (
  <div key={key}>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </label>
    {key === 'summary' ? (
      <textarea
        value={data[key]}
        onChange={e => onChange({ ...data, [key]: e.target.value })}
        rows={3}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    ) : (
      <input
        type={type}
        value={data[key]}
        onChange={e => onChange({ ...data, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
  </div>
)

export default function PersonalForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field('Full Name', 'fullName', data, onChange, 'text', 'John Doe')}
        {field('Professional Title', 'title', data, onChange, 'text', 'Software Engineer')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('Email', 'email', data, onChange, 'email', 'john@example.com')}
        {field('Phone', 'phone', data, onChange, 'tel', '+1 (555) 000-0000')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('Location', 'location', data, onChange, 'text', 'City, Country')}
        {field('Website', 'website', data, onChange, 'text', 'yoursite.com')}
      </div>
      {field('LinkedIn', 'linkedin', data, onChange, 'text', 'linkedin.com/in/yourname')}
      {field('Professional Summary', 'summary', data, onChange, 'text', 'Brief description of your background and goals...')}
    </div>
  )
}
