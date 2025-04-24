interface SynergySquaresLogoProps {
  className?: string
}

export default function SynergySquaresLogo({ className = "h-6 w-6" }: SynergySquaresLogoProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" className="text-accent/10" />
      <path
        d="M16.5 8.5C16.5 8.5 14.5 7 12 7C9.5 7 8 8.5 8 10.5C8 12.5 9.5 13.5 12 13.5C14.5 13.5 16 14.5 16 16.5C16 18.5 14.5 20 12 20C9.5 20 7.5 18.5 7.5 18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-accent"
        transform="translate(0, 0.5)" /* Adjusted to center the S vertically */
      />
    </svg>
  )
}
