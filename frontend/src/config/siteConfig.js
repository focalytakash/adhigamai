/**
 * CENTRAL SITE DESIGN SETTINGS
 * Change this file to update the logo, fonts, sizes, colours and backgrounds.
 */
const siteConfig = {
  branding: {
    name: "AdhigamAI",
    logo: "/Assets/images/logo/logo.png",
    favicon: "/Assets/images/logo/adhigama.png",
    logoAlt: "AdhigamAI",
    logoWidth: "150px",
    mobileLogoWidth: "120px",
  },

  typography: {
    fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Orbitron:wght@600;700;900&display=swap",
    bodyFont: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
    headingFont: '"Orbitron", "Inter", system-ui, sans-serif',
    monoFont: 'ui-monospace, "Cascadia Code", "Courier New", monospace',
    sizes: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", md: "1.125rem",
      lg: "1.25rem", xl: "1.5rem", "2xl": "1.875rem",
      "3xl": "2.25rem", "4xl": "3rem",
    },
  },

  colors: {
    primary: "#1ba7ff",
    accent: "#ff2daa",
    cta: "#fc2b5a",
    purple: "#7c3aed",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    text: "#061426",
    textStrong: "#111827",
    textMuted: "#3e5876",
    textSubtle: "#64748b",
    textInverse: "#ffffff",
    border: "rgba(4, 25, 45, 0.12)",
    borderStrong: "rgba(4, 25, 45, 0.18)",
  },

  backgrounds: {
    page: "#f5fbff",
    alternate: "#eaf4ff",
    muted: "#f8fafc",
    section: "#f1f5f9",
    surface: "#ffffff",
    surfaceSecondary: "#f1f7ff",
    header: "#ffffff",
    mobileMenu: "#ffffff",
  },
};

const cssVariables = {
  "--foc-font-sans": siteConfig.typography.bodyFont,
  "--foc-font-display": siteConfig.typography.headingFont,
  "--foc-font-mono": siteConfig.typography.monoFont,
  ...Object.fromEntries(Object.entries(siteConfig.typography.sizes).map(
    ([name, size]) => [`--foc-text-${name}`, size]
  )),
  "--foc-cyan": siteConfig.colors.primary,
  "--foc-magenta": siteConfig.colors.accent,
  "--foc-pink": siteConfig.colors.cta,
  "--foc-purple": siteConfig.colors.purple,
  "--foc-color-primary": siteConfig.colors.primary,
  "--foc-color-accent": siteConfig.colors.accent,
  "--foc-color-cta": siteConfig.colors.cta,
  "--foc-color-success": siteConfig.colors.success,
  "--foc-color-warning": siteConfig.colors.warning,
  "--foc-color-error": siteConfig.colors.error,
  "--foc-color-text": siteConfig.colors.text,
  "--foc-color-text-strong": siteConfig.colors.textStrong,
  "--foc-color-text-muted": siteConfig.colors.textMuted,
  "--foc-color-text-subtle": siteConfig.colors.textSubtle,
  "--foc-color-text-inverse": siteConfig.colors.textInverse,
  "--foc-color-border": siteConfig.colors.border,
  "--foc-color-border-strong": siteConfig.colors.borderStrong,
  "--foc-color-bg": siteConfig.backgrounds.page,
  "--foc-color-bg-alt": siteConfig.backgrounds.alternate,
  "--foc-color-bg-muted": siteConfig.backgrounds.muted,
  "--foc-color-bg-section": siteConfig.backgrounds.section,
  "--foc-color-surface": siteConfig.backgrounds.surface,
  "--foc-color-surface-2": siteConfig.backgrounds.surfaceSecondary,
  "--hdr-bg": siteConfig.backgrounds.header,
  "--hdr-mobile-bg": siteConfig.backgrounds.mobileMenu,
  "--hdr-surface": "rgba(255, 255, 255, 0.88)",
  "--hdr-border": "rgba(4, 25, 45, 0.12)",
  "--hdr-text": "#061426",
  "--hdr-link": "#3e5876",
  "--hdr-link-hover": siteConfig.colors.primary,
  "--hdr-accent-1": siteConfig.colors.primary,
  "--hdr-accent-2": siteConfig.colors.accent,
  "--hdr-dropdown-bg": "#ffffff",
  "--hdr-dropdown-border": "rgba(4, 25, 45, 0.12)",
  "--ftr-bg": "#ffffff",
  "--ftr-surface": "#ffffff",
  "--ftr-text": "#061426",
  "--ftr-muted": "#3e5876",
  "--ftr-border": "rgba(4, 25, 45, 0.12)",
  "--ftr-accent-1": siteConfig.colors.primary,
  "--ftr-accent-2": "#2563eb",
  "--site-logo-width": siteConfig.branding.logoWidth,
  "--site-mobile-logo-width": siteConfig.branding.mobileLogoWidth,
};

export function applySiteConfig() {
  const root = document.documentElement;
  Object.entries(cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  root.setAttribute("data-foc-theme", "site-config");

  let faviconLink = document.getElementById("site-favicon");
  if (!faviconLink) {
    faviconLink = document.createElement("link");
    faviconLink.id = "site-favicon";
    faviconLink.rel = "icon";
    faviconLink.type = "image/png";
    document.head.appendChild(faviconLink);
  }
  faviconLink.type = "image/png";
  faviconLink.href = siteConfig.branding.favicon;

  if (siteConfig.typography.fontUrl && !document.getElementById("site-fonts")) {
    const fontLink = document.createElement("link");
    fontLink.id = "site-fonts";
    fontLink.rel = "stylesheet";
    fontLink.href = siteConfig.typography.fontUrl;
    document.head.appendChild(fontLink);
  }
}

export default siteConfig;
