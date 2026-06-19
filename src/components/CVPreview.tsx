import { forwardRef } from 'react'
import { Mail, Phone, MapPin, Globe, Link2 } from 'lucide-react'
import type { CVData, Skill } from '../types'

interface Props {
  data: CVData
}

const LABELS = {
  en: {
    aboutMe: 'About Me', about: 'About', experience: 'Experience',
    workExperience: 'Work Experience', education: 'Education',
    skills: 'Skills', projects: 'Projects', profile: 'Profile',
    professionalSummary: 'Professional Summary', contact: 'Contact',
    present: 'Present', gpa: 'GPA',
  },
  ar: {
    aboutMe: 'من أنا', about: 'نبذة', experience: 'الخبرات',
    workExperience: 'الخبرة العملية', education: 'التعليم',
    skills: 'المهارات', projects: 'المشاريع', profile: 'الملف الشخصي',
    professionalSummary: 'الملخص المهني', contact: 'التواصل',
    present: 'حتى الآن', gpa: 'المعدل',
  },
}

function formatDate(ym: string, lang: 'en' | 'ar') {
  if (!ym) return ''
  const [year, month] = ym.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', year: 'numeric' })
}

function dateRange(start: string, end: string, current: boolean, lang: 'en' | 'ar') {
  const s = formatDate(start, lang)
  const e = current ? LABELS[lang].present : formatDate(end, lang)
  if (!s && !e) return ''
  if (!s) return e
  if (!e) return s
  return lang === 'ar' ? `${e} – ${s}` : `${s} – ${e}`
}

const levelDots: Record<Skill['level'], number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
}



function SectionTitle({ title, color, theme }: { title: string; color: string; theme: string }) {
  if (theme === 'minimal') {
    return (
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 mt-6 first:mt-0">
        {title}
      </h2>
    )
  }
  if (theme === 'classic') {
    return (
      <div className="mb-3 mt-6 first:mt-0">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color }}>
          {title}
        </h2>
        <div className="h-px mt-1" style={{ backgroundColor: color, opacity: 0.3 }} />
      </div>
    )
  }
  if (theme === 'executive') {
    return (
      <div className="flex items-center gap-3 mb-4 mt-7 first:mt-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    )
  }
  if (theme === 'creative') {
    return (
      <div className="mb-4 mt-7 first:mt-0">
        <h2
          className="text-sm font-extrabold uppercase tracking-wider inline-block px-3 py-0.5 rounded"
          style={{ color, backgroundColor: `${color}15` }}
        >
          {title}
        </h2>
      </div>
    )
  }
  if (theme === 'tech') {
    return (
      <div className="flex items-center gap-2 mb-4 mt-7 first:mt-0">
        <span className="font-mono text-xs font-bold" style={{ color }}>{'>//'}</span>
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-300">{title}</h2>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 mb-4 mt-6 first:mt-0">
      <div className="w-1 h-5 rounded-full" style={{ backgroundColor: color }} />
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">{title}</h2>
    </div>
  )
}

export const CVPreview = forwardRef<HTMLDivElement, Props>(function CVPreview({ data }, ref) {
  const { personal, experiences, education, skills, projects, theme, accentColor, showSkillLevel, language = 'en' } = data
  const L = LABELS[language]
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const arFont = language === 'ar' ? "'Segoe UI', Tahoma, Arial, sans-serif" : undefined

  // ── MINIMAL ────────────────────────────────────────────────────────────────
  if (theme === 'minimal') {
    return (
      <div
        ref={ref}
        id="cv-preview"
        dir={dir}
        className="bg-white w-full h-full p-12 text-gray-900 text-sm leading-relaxed"
        style={{ fontFamily: arFont ?? 'Georgia, serif' }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-1">{personal.fullName || 'Your Name'}</h1>
          <p className="text-base text-gray-500 mb-4">{personal.title}</p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.website && <span>{personal.website}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
          </div>
        </div>

        {personal.summary && (
          <>
            <SectionTitle title={L.profile} color={accentColor} theme={theme} />
            <p className="text-gray-600 leading-relaxed">{personal.summary}</p>
          </>
        )}
        {education.length > 0 && (
          <>
            <SectionTitle title={L.education} color={accentColor} theme={theme} />
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                      {edu.institution && <span className="text-gray-500"> — {edu.institution}</span>}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {dateRange(edu.startDate, edu.endDate, false, language)}
                    </span>
                  </div>
                  {edu.description && <p className="text-gray-500 text-xs mt-1 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
        {experiences.length > 0 && (
          <>
            <SectionTitle title={L.experience} color={accentColor} theme={theme} />
            <div className="space-y-5">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold">{exp.role}</span>
                      {exp.company && <span className="text-gray-500"> — {exp.company}</span>}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {dateRange(exp.startDate, exp.endDate, exp.current, language)}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-500 text-xs mt-1 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
        {skills.length > 0 && (
          <>
            <SectionTitle title={L.skills} color={accentColor} theme={theme} />
            <div className="space-y-1">
              {skills.map(group => (
                <div key={group.id} className="flex flex-wrap gap-x-1 text-sm">
                  {group.name && <span className="font-semibold text-gray-700">{group.name}:</span>}
                  <span className="text-gray-600">{group.skills.map(s => s.name).filter(Boolean).join(', ')}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {projects.length > 0 && (
          <>
            <SectionTitle title={L.projects} color={accentColor} theme={theme} />
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{proj.name}</span>
                    {proj.url && <span className="text-xs text-gray-400">{proj.url}</span>}
                  </div>
                  {proj.description && <p className="text-gray-500 text-xs mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // ── CLASSIC ────────────────────────────────────────────────────────────────
  if (theme === 'classic') {
    return (
      <div
        ref={ref}
        id="cv-preview"
        dir={dir}
        className="bg-white w-full h-full p-10 text-gray-900 font-sans text-sm leading-relaxed"
        style={arFont ? { fontFamily: arFont } : undefined}
      >
        <div className="text-center mb-6 pb-6 border-b-2" style={{ borderColor: accentColor }}>
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>
            {personal.fullName || 'Your Name'}
          </h1>
          {personal.title && <p className="text-base font-medium text-gray-600 tracking-wide">{personal.title}</p>}
          <div className="flex justify-center flex-wrap gap-4 mt-3 text-xs text-gray-500">
            {personal.email && <span className="flex items-center gap-1"><Mail size={11} />{personal.email}</span>}
            {personal.phone && <span className="flex items-center gap-1"><Phone size={11} />{personal.phone}</span>}
            {personal.location && <span className="flex items-center gap-1"><MapPin size={11} />{personal.location}</span>}
            {personal.website && <span className="flex items-center gap-1"><Globe size={11} />{personal.website}</span>}
            {personal.linkedin && <span className="flex items-center gap-1"><Link2 size={11} />{personal.linkedin}</span>}
          </div>
        </div>
        {personal.summary && (
          <>
            <SectionTitle title={L.professionalSummary} color={accentColor} theme={theme} />
            <p className="text-gray-600 leading-relaxed">{personal.summary}</p>
          </>
        )}
        {education.length > 0 && (
          <>
            <SectionTitle title={L.education} color={accentColor} theme={theme} />
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                      {edu.institution && <span className="text-gray-600"> | {edu.institution}</span>}
                    </div>
                    <span className="text-xs text-gray-500">{dateRange(edu.startDate, edu.endDate, false, language)}</span>
                  </div>
                  {edu.gpa && <p className="text-xs text-gray-500 mt-0.5">{L.gpa}: {edu.gpa}</p>}
                  {edu.description && <p className="text-gray-600 text-xs mt-1 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
        {experiences.length > 0 && (
          <>
            <SectionTitle title={L.workExperience} color={accentColor} theme={theme} />
            <div className="space-y-5">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold">{exp.role}</span>
                      {exp.company && <span className="text-gray-600"> | {exp.company}</span>}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {dateRange(exp.startDate, exp.endDate, exp.current, language)}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-600 text-xs mt-1 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
        {projects.length > 0 && (
          <>
            <SectionTitle title={L.projects} color={accentColor} theme={theme} />
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-xs">{proj.name}</span>
                    {proj.url && <span className="text-xs text-gray-400">{proj.url}</span>}
                  </div>
                  {proj.technologies && <p className="text-xs" style={{ color: accentColor }}>{proj.technologies}</p>}
                  {proj.description && <p className="text-gray-500 text-xs mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
        {skills.length > 0 && (
          <>
            <SectionTitle title={L.skills} color={accentColor} theme={theme} />
            <div className="space-y-1">
              {skills.map(group => (
                <div key={group.id} className="flex flex-wrap gap-x-1 text-sm">
                  {group.name && <span className="font-semibold text-gray-700">{group.name}:</span>}
                  <span className="text-gray-700">{group.skills.map(s => s.name).filter(Boolean).join(', ')}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // ── EXECUTIVE ──────────────────────────────────────────────────────────────
  if (theme === 'executive') {
    return (
      <div
        ref={ref}
        id="cv-preview"
        dir={dir}
        className="bg-white w-full h-full font-sans text-sm leading-relaxed flex flex-col"
        style={arFont ? { fontFamily: arFont } : undefined}
      >
        <div className="px-10 py-8 shrink-0" style={{ backgroundColor: accentColor }}>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-white leading-none mb-1">
                {personal.fullName || 'Your Name'}
              </h1>
              <p className="text-base font-light text-white/80 tracking-widest uppercase">
                {personal.title}
              </p>
            </div>
            <div className="text-right space-y-1">
              {personal.email && (
                <div className="flex items-center justify-end gap-2 text-xs text-white/80">
                  <span>{personal.email}</span><Mail size={11} className="shrink-0" />
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center justify-end gap-2 text-xs text-white/80">
                  <span>{personal.phone}</span><Phone size={11} className="shrink-0" />
                </div>
              )}
              {personal.location && (
                <div className="flex items-center justify-end gap-2 text-xs text-white/80">
                  <span>{personal.location}</span><MapPin size={11} className="shrink-0" />
                </div>
              )}
              {personal.website && (
                <div className="flex items-center justify-end gap-2 text-xs text-white/80">
                  <span>{personal.website}</span><Globe size={11} className="shrink-0" />
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center justify-end gap-2 text-xs text-white/80">
                  <span>{personal.linkedin}</span><Link2 size={11} className="shrink-0" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-1.5 shrink-0" style={{ backgroundColor: `${accentColor}40` }} />

        <div className="flex flex-1 min-h-0">
          <div className="flex-1 px-10 py-6 overflow-hidden">
            {personal.summary && (
              <>
                <SectionTitle title={L.profile} color={accentColor} theme={theme} />
                <p className="text-gray-600 leading-relaxed text-sm">{personal.summary}</p>
              </>
            )}
            {experiences.length > 0 && (
              <>
                <SectionTitle title={L.experience} color={accentColor} theme={theme} />
                <div className="space-y-5">
                  {experiences.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p className="font-bold text-gray-900">{exp.role}</p>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {dateRange(exp.startDate, exp.endDate, exp.current, language)}
                        </span>
                      </div>
                      {exp.company && (
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                          {exp.company}
                        </p>
                      )}
                      {exp.description && <p className="text-gray-500 text-xs leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
            {projects.length > 0 && (
              <>
                <SectionTitle title={L.projects} color={accentColor} theme={theme} />
                <div className="space-y-4">
                  {projects.map(proj => (
                    <div key={proj.id}>
                      <div className="flex items-baseline gap-3">
                        <p className="font-bold text-gray-900">{proj.name}</p>
                        {proj.url && <span className="text-xs text-gray-400">{proj.url}</span>}
                      </div>
                      {proj.technologies && (
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                          {proj.technologies}
                        </p>
                      )}
                      {proj.description && <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="w-52 shrink-0 bg-gray-50 border-l border-gray-100 px-6 py-6 overflow-hidden">
            {education.length > 0 && (
              <>
                <SectionTitle title={L.education} color={accentColor} theme={theme} />
                <div className="space-y-4">
                  {education.map(edu => (
                    <div key={edu.id}>
                      <p className="font-bold text-gray-900 text-xs">{edu.degree}</p>
                      {edu.field && <p className="text-xs text-gray-600">{edu.field}</p>}
                      {edu.institution && <p className="text-xs font-medium" style={{ color: accentColor }}>{edu.institution}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">{dateRange(edu.startDate, edu.endDate, false, language)}</p>
                      {edu.gpa && <p className="text-xs text-gray-400">{L.gpa}: {edu.gpa}</p>}
                      {edu.description && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
            {skills.length > 0 && (
              <>
                <SectionTitle title={L.skills} color={accentColor} theme={theme} />
                <div className="space-y-3">
                  {skills.map(group => (
                    <div key={group.id}>
                      {group.name && (
                        <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: accentColor }}>
                          {group.name}
                        </p>
                      )}
                      <div className="space-y-1.5">
                        {group.skills.map(skill => (
                          <div key={skill.id}>
                            <span className="text-xs text-gray-700 font-medium">{skill.name}</span>
                            {showSkillLevel && (
                              <div className="h-1 bg-gray-200 rounded-full overflow-hidden mt-0.5">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${(levelDots[skill.level] / 4) * 100}%`, backgroundColor: accentColor }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── CREATIVE ───────────────────────────────────────────────────────────────
  if (theme === 'creative') {
    return (
      <div
        ref={ref}
        id="cv-preview"
        dir={dir}
        className="bg-white w-full h-full font-sans text-sm leading-relaxed flex"
        style={arFont ? { fontFamily: arFont } : undefined}
      >
        <div className="w-4 shrink-0" style={{ backgroundColor: accentColor }} />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-10 pt-10 pb-6 border-b border-gray-100 shrink-0">
            <h1
              className="font-black leading-none mb-2"
              style={{ fontSize: '3rem', color: accentColor }}
            >
              {(personal.fullName || 'Your Name').toUpperCase()}
            </h1>
            <p className="text-lg text-gray-500 font-light tracking-widest mb-5">
              {personal.title}
            </p>
            <div className="flex flex-wrap gap-5 text-xs text-gray-500">
              {personal.email && (
                <span className="flex items-center gap-1.5"><Mail size={12} style={{ color: accentColor }} />{personal.email}</span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1.5"><Phone size={12} style={{ color: accentColor }} />{personal.phone}</span>
              )}
              {personal.location && (
                <span className="flex items-center gap-1.5"><MapPin size={12} style={{ color: accentColor }} />{personal.location}</span>
              )}
              {personal.website && (
                <span className="flex items-center gap-1.5"><Globe size={12} style={{ color: accentColor }} />{personal.website}</span>
              )}
              {personal.linkedin && (
                <span className="flex items-center gap-1.5"><Link2 size={12} style={{ color: accentColor }} />{personal.linkedin}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-5 flex-1 min-h-0">
            <div className="col-span-3 px-10 py-6 overflow-hidden">
              {personal.summary && (
                <>
                  <SectionTitle title={L.about} color={accentColor} theme={theme} />
                  <p className="text-gray-600 leading-relaxed text-sm">{personal.summary}</p>
                </>
              )}
              {experiences.length > 0 && (
                <>
                  <SectionTitle title={L.experience} color={accentColor} theme={theme} />
                  <div className="space-y-5">
                    {experiences.map(exp => (
                      <div key={exp.id}>
                        <p className="font-extrabold text-gray-900">{exp.role}</p>
                        <div className="flex items-center gap-2 mb-1">
                          {exp.company && (
                            <span className="text-xs font-bold" style={{ color: accentColor }}>{exp.company}</span>
                          )}
                          <span className="text-xs text-gray-400">
                            {dateRange(exp.startDate, exp.endDate, exp.current, language)}
                          </span>
                        </div>
                        {exp.description && <p className="text-gray-500 text-xs leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {projects.length > 0 && (
                <>
                  <SectionTitle title={L.projects} color={accentColor} theme={theme} />
                  <div className="space-y-4">
                    {projects.map(proj => (
                      <div key={proj.id}>
                        <div className="flex items-baseline gap-2">
                          <p className="font-extrabold text-gray-900">{proj.name}</p>
                          {proj.url && <span className="text-xs text-gray-400">{proj.url}</span>}
                        </div>
                        {proj.technologies && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.technologies.split(',').map((t, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                              >
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {proj.description && <p className="text-gray-500 text-xs mt-1 leading-relaxed">{proj.description}</p>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="col-span-2 px-6 py-6 border-l border-gray-100 overflow-hidden">
              {education.length > 0 && (
                <>
                  <SectionTitle title={L.education} color={accentColor} theme={theme} />
                  <div className="space-y-4">
                    {education.map(edu => (
                      <div key={edu.id}>
                        <p className="font-extrabold text-gray-900 text-xs leading-snug">
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </p>
                        {edu.institution && <p className="text-xs font-bold" style={{ color: accentColor }}>{edu.institution}</p>}
                        <p className="text-xs text-gray-400">{dateRange(edu.startDate, edu.endDate, false, language)}</p>
                        {edu.gpa && <p className="text-xs text-gray-400">{L.gpa}: {edu.gpa}</p>}
                        {edu.description && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {skills.length > 0 && (
                <>
                  <SectionTitle title={L.skills} color={accentColor} theme={theme} />
                  <div className="space-y-3">
                    {skills.map(group => (
                      <div key={group.id}>
                        {group.name && (
                          <p className="text-xs font-bold text-gray-500 mb-1">{group.name}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {group.skills.map(skill => (
                            <span
                              key={skill.id}
                              className="text-xs px-2.5 py-1 rounded-full font-semibold"
                              style={
                                showSkillLevel && levelDots[skill.level] >= 3
                                  ? { backgroundColor: accentColor, color: 'white' }
                                  : { backgroundColor: `${accentColor}20`, color: accentColor }
                              }
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── TECH ───────────────────────────────────────────────────────────────────
  if (theme === 'tech') {
    return (
      <div
        ref={ref}
        id="cv-preview"
        dir={dir}
        className="w-full h-full text-sm leading-relaxed flex"
        style={{ backgroundColor: '#0f172a', fontFamily: arFont ?? "'Courier New', Courier, monospace" }}
      >
        <div className="w-60 shrink-0 p-7 flex flex-col" style={{ backgroundColor: '#1e293b' }}>
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-xl font-black mb-4 mx-auto shrink-0"
            style={{ backgroundColor: accentColor, color: 'white' }}
          >
            {(personal.fullName || 'YN').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <h1 className="text-base font-black text-center text-white mb-0.5 leading-tight shrink-0">
            {personal.fullName || 'Your Name'}
          </h1>
          <p className="text-xs text-center mb-5 shrink-0" style={{ color: accentColor }}>
            {personal.title}
          </p>

          <div className="space-y-1.5 mb-6 shrink-0">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{L.contact}</p>
            {personal.email && (
              <div className="flex items-start gap-1.5 text-xs text-gray-400">
                <Mail size={11} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                <span className="break-all">{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Phone size={11} className="shrink-0" style={{ color: accentColor }} />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin size={11} className="shrink-0" style={{ color: accentColor }} />
                <span>{personal.location}</span>
              </div>
            )}
            {personal.website && (
              <div className="flex items-start gap-1.5 text-xs text-gray-400">
                <Globe size={11} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                <span className="break-all">{personal.website}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-start gap-1.5 text-xs text-gray-400">
                <Link2 size={11} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                <span className="break-all">{personal.linkedin}</span>
              </div>
            )}
          </div>

          {skills.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{L.skills}</p>
              <div className="space-y-3">
                {skills.map(group => (
                  <div key={group.id}>
                    {group.name && (
                      <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: accentColor }}>
                        {group.name}
                      </p>
                    )}
                    <div className="space-y-2">
                      {group.skills.map(skill => (
                        <div key={skill.id}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">{skill.name}</span>
                            {showSkillLevel && <span className="text-gray-600">{skill.level.slice(0, 3).toUpperCase()}</span>}
                          </div>
                          {showSkillLevel && (
                            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#334155' }}>
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${(levelDots[skill.level] / 4) * 100}%`, backgroundColor: accentColor }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 p-8 overflow-hidden">
          <div className="mb-6 pb-4 border-b" style={{ borderColor: '#1e293b' }}>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <span style={{ color: accentColor }}>$</span>
              <span>whoami</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">{personal.summary}</p>
          </div>

          {education.length > 0 && (
            <>
              <SectionTitle title={L.education} color={accentColor} theme={theme} />
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="font-bold text-white">
                        {edu.degree}{edu.field ? ` :: ${edu.field}` : ''}
                      </p>
                      <span className="text-xs whitespace-nowrap ml-4 text-gray-500">
                        {dateRange(edu.startDate, edu.endDate, false, language)}
                      </span>
                    </div>
                    {edu.institution && (
                      <p className="text-xs" style={{ color: accentColor }}>{'// '}{edu.institution}</p>
                    )}
                    {edu.description && (
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed font-sans">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {experiences.length > 0 && (
            <>
              <SectionTitle title={L.experience} color={accentColor} theme={theme} />
              <div className="space-y-5">
                {experiences.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="font-bold text-white">{exp.role}</p>
                      <span className="text-xs whitespace-nowrap ml-4" style={{ color: accentColor }}>
                        {dateRange(exp.startDate, exp.endDate, exp.current, language)}
                      </span>
                    </div>
                    {exp.company && (
                      <p className="text-xs mb-1" style={{ color: accentColor }}>
                        {'// '}{exp.company}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {projects.length > 0 && (
            <>
              <SectionTitle title={L.projects} color={accentColor} theme={theme} />
              <div className="space-y-4">
                {projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex items-baseline gap-3">
                      <p className="font-bold text-white">{proj.name}</p>
                      {proj.url && (
                        <span className="text-xs text-gray-500">{proj.url}</span>
                      )}
                    </div>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.split(',').map((t, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded font-mono"
                            style={{ backgroundColor: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}40` }}
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed font-sans">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ── MODERN (default) ───────────────────────────────────────────────────────
  return (
    <div
      ref={ref}
      id="cv-preview"
      dir={dir}
      className="bg-white w-full h-full text-gray-900 font-sans text-sm leading-relaxed flex"
      style={arFont ? { fontFamily: arFont } : undefined}
    >
      <div className="w-64 shrink-0 p-8 text-white" style={{ backgroundColor: accentColor }}>
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-5 mx-auto">
          {(personal.fullName || 'YN').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <h1 className="text-xl font-bold text-center leading-tight mb-1">
          {personal.fullName || 'Your Name'}
        </h1>
        <p className="text-xs text-center text-white/70 mb-6">{personal.title}</p>
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">{L.contact}</h3>
          {personal.email && (
            <div className="flex items-start gap-2 text-xs text-white/85">
              <Mail size={12} className="mt-0.5 shrink-0" /><span className="break-all">{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-2 text-xs text-white/85">
              <Phone size={12} className="shrink-0" /><span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center gap-2 text-xs text-white/85">
              <MapPin size={12} className="shrink-0" /><span>{personal.location}</span>
            </div>
          )}
          {personal.website && (
            <div className="flex items-start gap-2 text-xs text-white/85">
              <Globe size={12} className="mt-0.5 shrink-0" /><span className="break-all">{personal.website}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-start gap-2 text-xs text-white/85">
              <Link2 size={12} className="mt-0.5 shrink-0" /><span className="break-all">{personal.linkedin}</span>
            </div>
          )}
        </div>
        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">{L.skills}</h3>
            <div className="space-y-3">
              {skills.map(group => (
                <div key={group.id}>
                  {group.name && (
                    <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">{group.name}</p>
                  )}
                  <div className="space-y-2">
                    {group.skills.map(skill => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/90">{skill.name}</span>
                          {showSkillLevel && <span className="text-white/50">{skill.level}</span>}
                        </div>
                        {showSkillLevel && (
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full"
                              style={{ width: `${(levelDots[skill.level] / 4) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-8 overflow-hidden">
        {personal.summary && (
          <>
            <SectionTitle title={L.aboutMe} color={accentColor} theme={theme} />
            <p className="text-gray-600 leading-relaxed text-sm mb-2">{personal.summary}</p>
          </>
        )}
        {education.length > 0 && (
          <>
            <SectionTitle title={L.education} color={accentColor} theme={theme} />
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-gray-100">
                  <div className="absolute w-2 h-2 rounded-full -left-1.25 top-1.5" style={{ backgroundColor: accentColor }} />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </p>
                      {edu.institution && <p className="text-xs font-medium" style={{ color: accentColor }}>{edu.institution}</p>}
                      {edu.gpa && <p className="text-xs text-gray-400">{L.gpa}: {edu.gpa}</p>}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4 mt-0.5">
                      {dateRange(edu.startDate, edu.endDate, false, language)}
                    </span>
                  </div>
                  {edu.description && <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
        {experiences.length > 0 && (
          <>
            <SectionTitle title={L.experience} color={accentColor} theme={theme} />
            <div className="space-y-5">
              {experiences.map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-100">
                  <div className="absolute w-2 h-2 rounded-full -left-1.25 top-1.5" style={{ backgroundColor: accentColor }} />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{exp.role}</p>
                      {exp.company && <p className="text-xs font-medium" style={{ color: accentColor }}>{exp.company}</p>}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4 mt-0.5">
                      {dateRange(exp.startDate, exp.endDate, exp.current, language)}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
        {projects.length > 0 && (
          <>
            <SectionTitle title={L.projects} color={accentColor} theme={theme} />
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id} className="relative pl-4 border-l-2 border-gray-100">
                  <div className="absolute w-2 h-2 rounded-full -left-1.25 top-1.5" style={{ backgroundColor: accentColor }} />
                  <div className="flex items-baseline gap-2">
                    <p className="font-bold text-gray-900">{proj.name}</p>
                    {proj.url && <span className="text-xs text-gray-400">{proj.url}</span>}
                  </div>
                  {proj.technologies && (
                    <p className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>{proj.technologies}</p>
                  )}
                  {proj.description && <p className="text-gray-500 text-xs mt-1 leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
})
