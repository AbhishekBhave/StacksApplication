function redactValue(key: string, value: unknown): unknown {
  if (typeof value !== 'object' || value === null) {
    if (/token|secret|password|access_token|public_token/i.test(key)) {
      return '[REDACTED]';
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'object' && v !== null ? redactObject(v as Record<string, unknown>) : v));
  }
  return redactObject(value as Record<string, unknown>);
}

function redactObject(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (/token|secret|password|access_token|public_token/i.test(k)) {
      out[k] = '[REDACTED]';
    } else if (v !== null && typeof v === 'object') {
      out[k] = redactValue(k, v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** Dev-only console logging with shallow redaction of sensitive keys. */
export function devLog(...args: unknown[]) {
  if (!__DEV__) return;
  const mapped = args.map((a) => {
    if (a !== null && typeof a === 'object' && !Array.isArray(a)) {
      return redactObject(a as Record<string, unknown>);
    }
    return a;
  });
  // eslint-disable-next-line no-console
  console.log(...mapped);
}
