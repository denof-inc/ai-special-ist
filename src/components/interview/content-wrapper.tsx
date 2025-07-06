interface ContentWrapperProps {
  children: React.ReactNode
}

export function ContentWrapper({ children }: ContentWrapperProps): JSX.Element {
  return (
    <div className="interview-content relative">
      {/* Floating gradient accent - toned down */}
      <div className="absolute -left-4 top-20 h-20 w-20 rounded-full bg-gradient-primary opacity-5 blur-xl"></div>
      <div className="absolute -right-4 top-60 h-24 w-24 rounded-full bg-gradient-accent opacity-5 blur-xl"></div>

      {children}
    </div>
  )
}
