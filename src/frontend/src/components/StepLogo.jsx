export default function StepLogo({ compact = false, className = "", style = {} }) {
  return (
    <svg
      viewBox={compact ? "15 5 305 125" : "15 5 305 160"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="STEP: Segmented Teaching for Every Person"
      className={className}
      style={style}
    >
      <path
        d="M20 118 H72 V96 H26 C22.7 96 20 98.7 20 102 V118 Z"
        fill="var(--logo-step-1)"
      />
      <path
        d="M54 96 H112 V74 H60 C56.7 74 54 76.7 54 80 V96 Z"
        fill="var(--logo-step-2)"
      />
      <path
        d="M94 74 H152 V52 H100 C96.7 52 94 54.7 94 58 V74 Z"
        fill="var(--logo-step-3)"
      />
      <path
        d="M134 52 H198 L212 42 H140 C136.7 42 134 44.7 134 48 V52 Z"
        fill="var(--logo-step-4)"
      />
      <rect x="134" y="42" width="62" height="12" rx="4" fill="var(--logo-step-4)" />

      <circle cx="38" cy="54" r="6.5" fill="var(--logo-wordmark)" />
      <path
        d="M26 70 C31 64, 39 64, 46 61 L52 55 C54 53, 56 55, 54 58 L47 68 L53 79 C54 81, 51 83, 49 81 L41 74 L33 85 C31 87, 28 85, 30 82 L35 71 L28 73 C25 74, 24 71, 26 70 Z"
        fill="var(--logo-wordmark)"
      />

      <path
        d="M62 34 L65 41 L72 44 L65 47 L62 54 L59 47 L52 44 L59 41 Z"
        fill="var(--logo-step-4)"
      />

      <path
        d="M196 14 L228 24 L260 14 V44 L228 53 L196 44 V14 Z"
        fill="var(--logo-step-1)"
      />
      <path
        d="M200 10 L227 21 V51 L200 41 V10 Z"
        fill="var(--logo-step-3)"
      />
      <path
        d="M256 10 L229 21 V51 L256 41 V10 Z"
        fill="var(--logo-step-2)"
      />

      <text
        x="134"
        y="118"
        fill="var(--logo-wordmark)"
        fontFamily="var(--font-body)"
        fontWeight="800"
        fontSize="64"
        letterSpacing="2"
      >
        STEP
      </text>

      {!compact && (
        <text
          x="167"
          y="152"
          textAnchor="middle"
          fill="var(--logo-tagline)"
          fontFamily="var(--font-body)"
          fontWeight="600"
          fontSize="16.5"
        >
          Segmented Teaching for Every Person
        </text>
      )}
    </svg>
  )
}