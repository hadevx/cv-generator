import { useRef, useState, useEffect, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  Palette,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Save,
  LogOut,
  LogIn,
  CheckCircle2,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'
import type { CVData } from './types'
import { defaultCV } from './defaultData'
import { CVPreview } from './components/CVPreview'
import PersonalForm from './components/PersonalForm'
import ExperienceForm from './components/ExperienceForm'
import EducationForm from './components/EducationForm'
import SkillsForm from './components/SkillsForm'
import ProjectsForm from './components/ProjectsForm'
import AuthModal from './components/AuthModal'
import { useAuth } from './contexts/AuthContext'
import { api } from './api'

// A4 at 96 dpi
const A4_W = 794
const A4_H = 1123

const ACCENT_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#dc2626',
  '#d97706', '#059669', '#0891b2', '#374151',
]

const THEMES: { key: CVData['theme']; label: string; desc: string }[] = [
  { key: 'modern',    label: 'Modern',    desc: 'Sidebar + timeline' },
  { key: 'classic',  label: 'Classic',   desc: 'Centered header' },
  { key: 'minimal',  label: 'Minimal',   desc: 'Clean serif' },
  { key: 'executive',label: 'Executive', desc: 'Bold banner' },
  { key: 'creative', label: 'Creative',  desc: 'Color strip' },
  { key: 'tech',     label: 'Tech',      desc: 'Dark terminal' },
]

function normalizeCV(data: CVData): CVData {
  const first = data.skills?.[0] as unknown as Record<string, unknown>
  if (first && !Array.isArray(first.skills)) {
    return {
      ...data,
      skills: [{ id: crypto.randomUUID(), name: '', skills: data.skills as unknown as import('./types').Skill[] }],
    }
  }
  return data
}

type Section = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'design'

const sections: { key: Section; label: string; icon: typeof User }[] = [
  { key: 'personal',   label: 'Personal Info', icon: User },
  { key: 'experience', label: 'Experience',    icon: Briefcase },
  { key: 'education',  label: 'Education',     icon: GraduationCap },
  { key: 'skills',     label: 'Skills',        icon: Wrench },
  { key: 'projects',   label: 'Projects',      icon: FolderKanban },
  { key: 'design',     label: 'Design',        icon: Palette },
]

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function App() {
  const { user, logout } = useAuth()
  const [cv, setCV] = useState<CVData>(defaultCV)
  const [openSection, setOpenSection] = useState<Section>('personal')
  const [showPreview, setShowPreview] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [isDirty, setIsDirty] = useState(false)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')
  const [fitScale, setFitScale] = useState(0.96)
  const [manualZoom, setManualZoom] = useState<number | null>(0.96)
  const [leftWidth, setLeftWidth] = useState(440)

  const previewRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Compute the fit-to-width scale whenever the container resizes
  useEffect(() => {
    const el = previewContainerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      setFitScale((width - 32) / A4_W)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const displayScale = manualZoom ?? fitScale
  const zoomIn  = () => setManualZoom(z => Math.min(+(((z ?? fitScale) + 0.1).toFixed(2)), 2))
  const zoomOut = () => setManualZoom(z => Math.max(+(((z ?? fitScale) - 0.1).toFixed(2)), 0.25))

  // Load CV from server when user logs in
  useEffect(() => {
    if (!user) return
    api.loadCV().then(({ cv: saved }) => {
      if (saved) setCV(normalizeCV(saved))
      setIsDirty(false)
    }).catch(() => {/* keep local state */})
  }, [user])

  const updateCV = useCallback((patch: Partial<CVData> | ((prev: CVData) => CVData)) => {
    setCV(prev => typeof patch === 'function' ? patch(prev) : { ...prev, ...patch })
    setIsDirty(true)
    setSaveState('idle')
  }, [])

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: cv.personal.fullName ? `${cv.personal.fullName} - CV` : 'CV',
  })

  function onDividerPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onDividerPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current || !mainRef.current) return
    const rect = mainRef.current.getBoundingClientRect()
    const newW = Math.round(Math.min(Math.max(e.clientX - rect.left, 280), rect.width - 360))
    setLeftWidth(newW)
  }
  function onDividerPointerUp() {
    isDragging.current = false
  }

  async function handleSave() {
    if (!user) { setShowAuthModal(true); return }
    setSaveState('saving')
    try {
      await api.saveCV(cv)
      setSaveState('saved')
      setIsDirty(false)
      setTimeout(() => setSaveState('idle'), 3000)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  const toggle = (s: Section) => setOpenSection(prev => (prev === s ? ('none' as Section) : s))

  const scaledW = Math.round(A4_W * displayScale)
  const scaledH = Math.round(A4_H * displayScale)

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="shrink-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-2.5 lg:py-3 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">CV</span>
          </div>
          <h1 className="text-base lg:text-lg font-bold text-gray-900 hidden sm:block">CV Generator</h1>
        </div>

        <div className="flex items-center gap-1.5 lg:gap-2">
          {/* Save */}
          {user && (
            <button
              onClick={handleSave}
              disabled={saveState === 'saving' || !isDirty}
              className={`flex items-center gap-1.5 px-2.5 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                saveState === 'saved'
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : saveState === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : isDirty
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                  : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-default'
              }`}
            >
              {saveState === 'saving' && <Loader2 size={14} className="animate-spin" />}
              {saveState === 'saved'  && <CheckCircle2 size={14} />}
              {(saveState === 'idle' || saveState === 'error') && <Save size={14} />}
              <span className="hidden sm:inline">
                {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Error' : isDirty ? 'Save' : 'Saved'}
              </span>
            </button>
          )}

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(user.name || user.email)[0].toUpperCase()}
              </div>
              <span className="text-sm text-gray-700 font-medium hidden md:block max-w-28 truncate">
                {user.name || user.email}
              </span>
              <button
                onClick={logout}
                title="Sign out"
                className="flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={14} />
                <span className="hidden lg:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-2.5 lg:px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}

          {/* Toggle preview — desktop only */}
          <button
            onClick={() => setShowPreview(p => !p)}
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
            {showPreview ? 'Hide' : 'Show'}
          </button>

          {/* Download PDF */}
          <button
            onClick={() => handlePrint()}
            className="flex items-center gap-1.5 px-3 lg:px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </header>

      {/* ── Mobile tab bar ──────────────────────────────────────────────────── */}
      <div className="lg:hidden shrink-0 flex bg-white border-b border-gray-200">
        {(['edit', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors ${
              mobileTab === tab ? '' : 'text-gray-500 hover:text-gray-700'
            }`}
            style={mobileTab === tab
              ? { borderBottom: '2px solid #2563eb', color: '#2563eb' }
              : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div ref={mainRef} className="flex flex-1 min-h-0 overflow-hidden">

        {/* Form panel */}
        <div
          className={[
            mobileTab === 'edit' ? 'flex' : 'hidden',
            'lg:flex flex-col shrink-0 bg-white border-r border-gray-200 overflow-y-auto',
            showPreview ? '' : 'lg:max-w-2xl lg:mx-auto',
          ].join(' ')}
          style={showPreview ? { width: leftWidth } : undefined}
        >
          {user && isDirty && saveState === 'idle' && (
            <div className="shrink-0 px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
              <span className="text-xs text-amber-700">Unsaved changes</span>
              <button onClick={handleSave} className="text-xs font-semibold text-amber-700 hover:text-amber-900">
                Save now
              </button>
            </div>
          )}

          <div className="p-4 space-y-2">
            {sections.map(({ key, label, icon: Icon }) => (
              <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-50">
                      <Icon size={14} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{label}</span>
                  </div>
                  {openSection === key
                    ? <ChevronUp size={16} className="text-gray-400" />
                    : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {openSection === key && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                    {key === 'personal' && (
                      <PersonalForm
                        data={cv.personal}
                        onChange={personal => updateCV(c => ({ ...c, personal }))}
                      />
                    )}
                    {key === 'experience' && (
                      <ExperienceForm
                        items={cv.experiences}
                        onChange={experiences => updateCV(c => ({ ...c, experiences }))}
                      />
                    )}
                    {key === 'education' && (
                      <EducationForm
                        items={cv.education}
                        onChange={education => updateCV(c => ({ ...c, education }))}
                      />
                    )}
                    {key === 'skills' && (
                      <SkillsForm
                        items={cv.skills}
                        onChange={skills => updateCV(c => ({ ...c, skills }))}
                      />
                    )}
                    {key === 'projects' && (
                      <ProjectsForm
                        items={cv.projects}
                        onChange={projects => updateCV(c => ({ ...c, projects }))}
                      />
                    )}
                    {key === 'design' && (
                      <div className="space-y-5 pt-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Theme
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {THEMES.map(t => (
                              <button
                                key={t.key}
                                onClick={() => updateCV(c => ({ ...c, theme: t.key }))}
                                className={`py-2.5 px-3 rounded-xl border-2 text-left transition-all ${
                                  cv.theme === t.key
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                                }`}
                              >
                                <p className="text-sm font-bold leading-tight">{t.label}</p>
                                <p className={`text-xs mt-0.5 ${cv.theme === t.key ? 'text-white/70' : 'text-gray-400'}`}>
                                  {t.desc}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Skills
                          </label>
                          <button
                            onClick={() => updateCV(c => ({ ...c, showSkillLevel: !c.showSkillLevel }))}
                            className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border-2 transition-all text-left ${
                              cv.showSkillLevel
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="text-sm font-semibold">Show skill level</span>
                            <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${cv.showSkillLevel ? 'bg-white/30' : 'bg-gray-200'}`}>
                              <div className={`w-4 h-4 rounded-full transition-transform ${cv.showSkillLevel ? 'translate-x-4 bg-white' : 'translate-x-0 bg-white'}`} />
                            </div>
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Accent Color
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {ACCENT_COLORS.map(color => (
                              <button
                                key={color}
                                onClick={() => updateCV(c => ({ ...c, accentColor: color }))}
                                className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                                style={{
                                  backgroundColor: color,
                                  outline: cv.accentColor === color ? `3px solid ${color}` : '3px solid transparent',
                                  outlineOffset: '2px',
                                }}
                              />
                            ))}
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-500">Custom:</label>
                              <input
                                type="color"
                                value={cv.accentColor}
                                onChange={e => updateCV(c => ({ ...c, accentColor: e.target.value }))}
                                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Language
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {([['en', 'English'], ['ar', 'العربية']] as const).map(([code, name]) => (
                              <button
                                key={code}
                                onClick={() => updateCV(c => ({ ...c, language: code }))}
                                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                  cv.language === code
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                                }`}
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resizable divider — only on desktop when preview is visible */}
        {showPreview && (
          <div
            onPointerDown={onDividerPointerDown}
            onPointerMove={onDividerPointerMove}
            onPointerUp={onDividerPointerUp}
            className="hidden lg:flex w-1.5 shrink-0 cursor-col-resize items-center justify-center bg-gray-200 hover:bg-blue-400 active:bg-blue-500 transition-colors group"
          >
            <div className="w-0.5 h-8 rounded-full bg-gray-400 group-hover:bg-white group-active:bg-white transition-colors" />
          </div>
        )}

        {/* Preview panel */}
        {(showPreview || mobileTab === 'preview') && (
          <div
            className={[
              mobileTab === 'preview' ? 'flex' : 'hidden',
              'lg:flex flex-col flex-1 min-w-0',
            ].join(' ')}
          >
            {/* Scrollable CV area */}
            <div
              ref={previewContainerRef}
              className="flex-1 overflow-auto bg-gray-200 flex items-start justify-center p-4"
            >
              <div className="shrink-0" style={{ width: scaledW, height: scaledH, position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: A4_W,
                    height: A4_H,
                    transform: `scale(${displayScale})`,
                    transformOrigin: 'top left',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px -10px rgba(0,0,0,0.4)',
                    borderRadius: 2,
                  }}
                >
                  <CVPreview ref={previewRef} data={cv} />
                </div>
              </div>
            </div>

            {/* Zoom controls */}
            <div className="shrink-0 flex items-center justify-center gap-3 px-4 py-2 bg-white border-t border-gray-200">
              <button
                onClick={zoomOut}
                title="Zoom out"
                disabled={displayScale <= 0.25}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30"
              >
                <ZoomOut size={15} />
              </button>

              <input
                type="range"
                min={25} max={200} step={5}
                value={Math.round(displayScale * 100)}
                onChange={e => setManualZoom(Number(e.target.value) / 100)}
                className="w-32 lg:w-48 accent-blue-600"
                title="Zoom"
              />

              <span className="text-xs font-semibold text-gray-600 w-10 text-center tabular-nums select-none">
                {Math.round(displayScale * 100)}%
              </span>

              <button
                onClick={zoomIn}
                title="Zoom in"
                disabled={displayScale >= 2}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30"
              >
                <ZoomIn size={15} />
              </button>

              <div className="w-px h-4 bg-gray-200" />

              <button
                onClick={() => setManualZoom(fitScale)}
                title="Fit to width"
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Maximize2 size={15} />
              </button>

              <button
                onClick={() => setManualZoom(1)}
                title="Actual size (100%)"
                className="text-xs font-semibold px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                1:1
              </button>
            </div>
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </div>
  )
}
