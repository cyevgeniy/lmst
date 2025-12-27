export function isTag(s: string): boolean {
  return s.length > 0 && s[0] === '#'
}
