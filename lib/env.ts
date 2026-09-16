/**
 * Helper to safely retrieve environment variables with explicit runtime validation.
 * Throws a descriptive error if the variable is undefined, empty, or whitespace.
 */
export function getEnvVar(name: string, fallback?: string): string {
  const val = process.env[name];
  if (val && val.trim().length > 0) {
    return val.trim();
  }
  if (fallback !== undefined && fallback.trim().length > 0) {
    return fallback.trim();
  }
  throw new Error(`Missing required environment variable: "${name}". Please check your server environment configuration.`);
}

/**
 * Helper to resolve an API key from either user input (FormData) or server environment variable.
 * Validates that at least one valid non-empty key is present.
 */
export function resolveApiKey(userInputKey?: string | null, envVarName: string = 'OPENROUTER_API_KEY'): string {
  if (userInputKey && userInputKey.trim().length > 0) {
    return userInputKey.trim();
  }
  return getEnvVar(envVarName);
}
