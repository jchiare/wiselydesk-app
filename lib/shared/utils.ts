export function concatClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
