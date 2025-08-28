export function getFeatureFlag(key: string): boolean {
  // Simple feature-flag source for demo. Use env var or localStorage.
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    if (url.searchParams.has(key)) return url.searchParams.get(key) === 'true'
    const stored = localStorage.getItem('feature:' + key)
    if (stored) return stored === 'true'
  }
  // Fallback to build-time env var (Vite uses import.meta.env)
  // @ts-ignore
  return Boolean(import.meta.env[`VITE_FLAG_${key.toUpperCase()}`])
}
