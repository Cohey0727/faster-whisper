interface MicIconProps {
  readonly recording: boolean
}

export function MicIcon({ recording }: MicIconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={recording ? "#fff" : "rgba(255,255,255,0.8)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="1" width="6" height="12" rx="3" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}
