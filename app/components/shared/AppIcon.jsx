export default function AppIcon({ name, size = 20, stroke = 1.9, filled = false }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  };

  const icons = {
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" {...common} />
        <path d="m16 16 4.25 4.25" {...common} />
      </>
    ),
    arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" {...common} />,
    chevronRight: <path d="m9 5 7 7-7 7" {...common} />,
    plus: <path d="M12 5v14M5 12h14" {...common} />,
    minus: <path d="M5 12h14" {...common} />,
    close: <path d="m6 6 12 12M18 6 6 18" {...common} />,
    back: <path d="m15 5-7 7 7 7M8 12h12" {...common} />,
    home: (
      <>
        <path d="m3.5 10.5 8.5-7 8.5 7" {...common} />
        <path d="M5.5 9.5v9h13v-9M9.5 18.5v-5h5v5" {...common} />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" {...common} />,
    bookmark: (
      <path
        d="M6.5 4.5A2.5 2.5 0 0 1 9 2h6a2.5 2.5 0 0 1 2.5 2.5V21L12 17.5 6.5 21V4.5Z"
        {...common}
        fill={filled ? "currentColor" : "none"}
      />
    ),
    cart: (
      <>
        <path d="M3.5 4h2l1.7 10.2a2 2 0 0 0 2 1.8h7.9a2 2 0 0 0 1.9-1.5L20.5 8H6" {...common} />
        <circle cx="9.2" cy="19" r="1.2" {...common} />
        <circle cx="17.2" cy="19" r="1.2" {...common} />
      </>
    ),
    package: (
      <>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" {...common} />
        <path d="M4 7v10l8 4 8-4V7M12 11v10" {...common} />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" {...common} />
        <path d="M4.5 20c.5-3.5 3.2-5.5 7.5-5.5s7 2 7.5 5.5" {...common} />
      </>
    ),
    heart: (
      <path
        d="M20.4 8.9c0 5.1-8.4 10-8.4 10S3.6 14 3.6 8.9A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.4 2.5Z"
        {...common}
        fill={filled ? "currentColor" : "none"}
      />
    ),
    star: (
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"
        {...common}
        fill="currentColor"
      />
    ),
    eye: (
      <>
        <path d="M2.8 12s3.2-5.2 9.2-5.2 9.2 5.2 9.2 5.2-3.2 5.2-9.2 5.2S2.8 12 2.8 12Z" {...common} />
        <circle cx="12" cy="12" r="2.3" {...common} />
      </>
    ),
    eyeOff: (
      <path d="m3.5 3.5 17 17M10.5 6.9A9.8 9.8 0 0 1 12 6.8c6 0 9.2 5.2 9.2 5.2a15.3 15.3 0 0 1-3.1 3.2M6.2 6.9C3.9 8.6 2.8 12 2.8 12s3.2 5.2 9.2 5.2a9.8 9.8 0 0 0 2.3-.3" {...common} />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" {...common} />
        <path d="M12 7v5l3.3 2" {...common} />
      </>
    ),
    pin: (
      <>
        <path d="M19 10.2c0 5.2-7 10-7 10s-7-4.8-7-10a7 7 0 1 1 14 0Z" {...common} />
        <circle cx="12" cy="10" r="2.3" {...common} />
      </>
    ),
    scooter: (
      <>
        <path d="M5.2 17.5a2.5 2.5 0 1 0 0 0M18.5 17.5a2.5 2.5 0 1 0 0 0" {...common} />
        <path d="M7.6 17.5h5.1l2-6.4h3.5l1.3 1.8M12.7 17.5l-2.8-6.4H7.1M10 11.1h3.5" {...common} />
        <path d="M16.8 7.1h2.3l.9 2.4M17.3 7.1V5.5" {...common} />
      </>
    ),
    utensils: (
      <>
        <path d="M4.5 3v5.5a2.5 2.5 0 0 0 5 0V3M6.2 3v5M7 3v5M7.8 3v5M7 11v10" {...common} />
        <path d="M16.5 3c-2.1 0-3.8 2.4-3.8 5.4s1.7 5.4 3.8 5.4 3.8-2.4 3.8-5.4S18.6 3 16.5 3Z" {...common} />
        <path d="M16.5 13.8V21" {...common} />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.2 4.3L17.5 9l-4.3 1.2L12 14.5l-1.2-4.3L6.5 9l4.3-1.7L12 3Z" {...common} />
        <path d="m19 14 .6 2.4L22 17l-2.4.6L19 20l-.6-2.4L16 17l2.4-.6L19 14ZM5 15l.5 1.5L7 17l-1.5.5L5 19l-.5-1.5L3 17l1.5-.5L5 15Z" {...common} />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" {...common} />
        <path d="m4 7 8 6 8-6" {...common} />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" {...common} />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" {...common} />
      </>
    ),
    logout: <path d="M14 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H14M16 8l4 4-4 4M20 12H9" {...common} />,
    check: <path d="m5 12 4.2 4.2L19.5 6" {...common} />,
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="presentation"
    >
      {icons[name] || icons.sparkles}
    </svg>
  );
}

