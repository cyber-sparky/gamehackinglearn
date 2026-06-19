const CPP_KEYWORDS = new Set([
  "auto",
  "bool",
  "break",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "delete",
  "do",
  "double",
  "else",
  "enum",
  "extern",
  "false",
  "float",
  "for",
  "goto",
  "if",
  "inline",
  "int",
  "long",
  "namespace",
  "new",
  "nullptr",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "signed",
  "sizeof",
  "static",
  "struct",
  "switch",
  "template",
  "this",
  "throw",
  "true",
  "try",
  "typedef",
  "typename",
  "uint32_t",
  "uint64_t",
  "uintptr_t",
  "unsigned",
  "using",
  "virtual",
  "void",
  "volatile",
  "while",
]);

const CSHARP_KEYWORDS = new Set([
  ...CPP_KEYWORDS,
  "async",
  "await",
  "base",
  "byte",
  "decimal",
  "delegate",
  "dynamic",
  "event",
  "finally",
  "fixed",
  "foreach",
  "get",
  "interface",
  "internal",
  "is",
  "lock",
  "object",
  "override",
  "params",
  "readonly",
  "ref",
  "sealed",
  "set",
  "string",
  "uint",
  "ulong",
  "unsafe",
  "var",
  "yield",
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function keywordsForLanguage(language: string): Set<string> {
  const lang = language.toLowerCase();
  if (lang.includes("c#") || lang.includes("csharp")) return CSHARP_KEYWORDS;
  return CPP_KEYWORDS;
}

export function highlightCode(code: string, language: string): string {
  const keywords = keywordsForLanguage(language);
  const tokenPattern =
    /(\/\/.*$|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_][\w]*\b|\d+\.?\d*(?:[eE][+-]?\d+)?[uUlLfF]*|#[^\n]*)/gm;

  return escapeHtml(code).replace(tokenPattern, (raw) => {
    if (raw.startsWith("//") || raw.startsWith("/*") || raw.startsWith("#")) {
      return `<span class="text-muted">${raw}</span>`;
    }
    if (
      (raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))
    ) {
      return `<span class="text-success">${raw}</span>`;
    }
    if (/^\d/.test(raw)) {
      return `<span class="text-warning">${raw}</span>`;
    }
    if (keywords.has(raw)) {
      return `<span class="text-accent">${raw}</span>`;
    }
    return raw;
  });
}
