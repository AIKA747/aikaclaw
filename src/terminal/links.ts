export const DOCS_ROOT = "";

export function formatDocsLink(path: string, label?: string): string {
  if (label) {
    return label;
  }
  const trimmed = path.trim();
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function formatDocsRootLink(label?: string): string {
  return label ?? "";
}
