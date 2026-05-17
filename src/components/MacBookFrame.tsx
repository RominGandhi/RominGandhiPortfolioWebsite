import type { ReactNode } from 'react'

export function MacBookFrame({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`macbook ${className}`.trim()}>
      <div className="macbook__shell">
        <div className="macbook__display">
          <div className="macbook__bezel">
            <div className="macbook__screen">{children}</div>
          </div>
        </div>

        <div className="macbook__hinge" aria-hidden="true" />

        <div className="macbook__base" aria-hidden="true">
          <div className="macbook__keyboard" />
          <div className="macbook__trackpad" />
        </div>
      </div>
      <div className="macbook__shadow" aria-hidden="true" />
    </div>
  )
}
