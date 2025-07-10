interface GhostContentProps {
  html: string
  className?: string
}

export function GhostContent({ html, className = "" }: GhostContentProps) {
  return <div className={`ghost-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
