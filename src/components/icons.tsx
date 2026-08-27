function base(children: React.ReactNode) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      {children}
    </svg>
  );
}

export function HomeIcon() {
  return base(
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </>
  );
}

export function StationIcon() {
  return base(
    <>
      <path d="M4 9 5.5 4.5h13L20 9" />
      <path d="M4 9v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
      <path d="M4 9h16" />
      <path d="M10 19v-5h4v5" />
    </>
  );
}

export function BlockIcon() {
  return base(
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="1.5" />
      <path d="M8 3.5v3M16 3.5v3M4 10h16" />
    </>
  );
}

export function SearchIcon() {
  return base(
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15.5 15.5 20 20" />
    </>
  );
}

export function LogoutIcon() {
  return base(
    <>
      <path d="M13 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
      <path d="M9 8l-4 4 4 4" />
      <path d="M5 12h11" />
    </>
  );
}
