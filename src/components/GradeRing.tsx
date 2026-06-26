import { gradeColor } from '../types'

interface GradeRingProps {
  value: number | null
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
}

export function GradeRing({ value, size = 100, strokeWidth = 8, label, sublabel }: GradeRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  const pct = value != null ? Math.max(0, Math.min(1, (value - 1) / 5)) : 0
  const dashOffset = circumference * (1 - pct)
  const color = value != null ? gradeColor(value) : '#1E2D45'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke="#1E2D45"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          className="ring-animate"
          style={{
            ['--dash-total' as string]: circumference,
            ['--dash-offset' as string]: dashOffset,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {value != null ? (
          <>
            <span className="font-display font-bold text-text" style={{ fontSize: size * 0.22, color }}>
              {value.toFixed(2)}
            </span>
            {sublabel && (
              <span className="text-muted" style={{ fontSize: size * 0.1 }}>{sublabel}</span>
            )}
          </>
        ) : (
          <span className="text-muted" style={{ fontSize: size * 0.14 }}>–</span>
        )}
      </div>
      {label && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  )
}
