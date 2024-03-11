export function buildSources(
  fullResponse: string,
  sources: string[],
  shouldCreateInlineSources: boolean
): string[] {
  if (shouldCreateInlineSources) {
    return sources
      .filter(source => fullResponse.includes(source))
      .sort((a, b) => fullResponse.indexOf(a) - fullResponse.indexOf(b));
  }
  return sources;
}
