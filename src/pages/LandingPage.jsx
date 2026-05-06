import './LandingPage.css'
import { useAuth } from '../context/AuthContext'

const s = {
  page: {
    background: '#0d0d0d',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'DM Mono', monospace",
    overflow: 'hidden',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6vh',
  },
  logo: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.18em',
    color: '#3a3a3a',
    textTransform: 'uppercase',
  },
  themeBtn: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '1px solid #2a2a2a',
    background: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#4a4a4a',
    fontSize: 16,
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 11,
    color: '#3d3d3d',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#60a5fa',
    display: 'inline-block',
    flexShrink: 0,
  },
  lineAccent: {
    width: 32,
    height: 2,
    background: '#60a5fa',
    borderRadius: 1,
    marginBottom: 16,
  },
  headlineAccent: {
    color: '#60a5fa',
    fontStyle: 'normal',
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    background: '#60a5fa',
    color: '#0d0d0d',
    fontFamily: "'DM Mono', monospace",
    fontSize: 11.5,
    fontWeight: 500,
    letterSpacing: '0.06em',
    padding: '13px 24px',
    borderRadius: 6,
    cursor: 'pointer',
    border: 'none',
    textTransform: 'uppercase',
  },
  block: {
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bDark: { background: '#141414', border: '1px solid #222' },
  bAccent: { background: '#0a0f1a', border: '1px solid #1a2d4a' },
  topicPill: {
    background: '#141414',
    border: '1px solid #222',
    borderRadius: 4,
    padding: '5px 10px',
    fontFamily: "'DM Mono', monospace",
    fontSize: 10,
    color: '#3d3d3d',
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
  },
  topicPillLit: { color: '#60a5fa', borderColor: '#1a2d4a' },
  dotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 8px)',
    gap: 6,
    opacity: 0.15,
  },
  dot: { width: 3, height: 3, borderRadius: '50%', background: '#f5f5f0' },
  statNum: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 26,
    fontWeight: 800,
    color: '#60a5fa',
    letterSpacing: '-0.5px',
  },
  statLabel: {
    fontSize: 10,
    color: '#333',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: 2,
    fontFamily: "'DM Mono', monospace",
  },
  gridBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
}

const DOTS = Array.from({ length: 12 })

export default function LandingPage({ onToggleMode, mode }) {
  const { signInWithGoogle } = useAuth()

  return (
    <div style={s.page}>
      <div className="lp-inner">
        <div style={s.topbar}>
          <span style={s.logo}>queryn</span>
          <button
            style={s.themeBtn}
            onClick={onToggleMode}
            aria-label={mode === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {mode === 'light' ? '☽' : '☀'}
          </button>
        </div>

        <div className="lp-body-wrap">
          <div className="lp-left">
            <div style={s.tag}>
              <span style={s.tagDot} />
              AI quiz engine — CS
            </div>
            <div style={s.lineAccent} />
            <h1 className="lp-headline">
              Ace every<br />
              CS<br />
              <em style={s.headlineAccent}>assessment.</em>
            </h1>
            <p className="lp-body-text">
              AI-generated quizzes across 10 core CS topics. Answer, get instant explanations, and walk away knowing exactly what to review.
            </p>
            <button style={s.cta} onClick={signInWithGoogle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#0d0d0d" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#0d0d0d" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#0d0d0d" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#0d0d0d" />
              </svg>
              Sign in with Google <span style={{ marginLeft: 4, fontSize: 14 }}>→</span>
            </button>
          </div>

          <div className="lp-right">
            <div className="lp-deco-row">
              <span style={{ ...s.topicPill, ...s.topicPillLit }}>/ data structures</span>
              <div style={{ ...s.block, ...s.bDark, width: 100, height: 80 }}>
                <div style={s.dotGrid}>
                  {DOTS.map((_, i) => <div key={i} style={s.dot} />)}
                </div>
              </div>
            </div>

            <div className="lp-deco-row">
              <div style={{ ...s.block, ...s.bDark, width: 110, height: 110 }}>
                <div style={s.gridBlock}>
                  <div style={s.statNum}>10</div>
                  <div style={s.statLabel}>topics</div>
                </div>
              </div>
              <div style={{ ...s.block, ...s.bAccent, width: 88, height: 88 }}>
                <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="10" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                  <circle cx="14" cy="14" r="5" stroke="#60a5fa" strokeWidth="1" opacity="0.35" />
                  <circle cx="14" cy="14" r="2" fill="#60a5fa" opacity="0.8" />
                </svg>
              </div>
              <div style={{ ...s.block, ...s.bDark, width: 76, height: 76 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <polyline points="3,18 7,10 12,14 18,5 22,8" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                </svg>
              </div>
            </div>

            <div className="lp-deco-row">
              <span style={s.topicPill}>algorithms</span>
              <span style={s.topicPill}>os</span>
              <span style={s.topicPill}>networks</span>
            </div>

            <div className="lp-deco-row lp-deco-row--end">
              <span style={s.topicPill}>discrete math</span>
              <span style={{ ...s.topicPill, ...s.topicPillLit }}>ai / ml</span>
            </div>

            <div className="lp-deco-footer">
              instant explanations →
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
