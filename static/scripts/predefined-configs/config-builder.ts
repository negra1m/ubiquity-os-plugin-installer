/**
 * Builds a YAML plugin config string from a premade config JSON string.
 *
 * Each entry in the JSON must have a `yamlConfig` string property containing
 * the indented YAML snippet for that plugin (starting with `- `).
 *
 * Example input:
 * ```json
 * { "my-plugin": { "yamlConfig": "- uses:\n    - plugin: ...\n      with: ..." } }
 * ```
 *
 * Example output:
 * ```yaml
 * plugins:
 *   - uses:
 *       - plugin: ...
 *         with: ...
 * ```
 */
export function buildPredefinedConfig(configJson: string): string {
  const obj = JSON.parse(configJson) as Record<string, { yamlConfig?: string }>;
  const parts = Object.values(obj).map((value) => {
    return `\n  ${typeof value === "object" && value && "yamlConfig" in value && value.yamlConfig ? value.yamlConfig : ""}`;
  });
  return `plugins:${parts.join("")}`;
}
