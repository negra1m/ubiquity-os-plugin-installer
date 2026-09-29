import { describe, it, expect } from "@jest/globals";
import YAML from "yaml";
import { buildPredefinedConfig } from "../static/scripts/predefined-configs/config-builder";
import minimalConfig from "../static/minimal-predefined.json";
import standardConfig from "../static/standard-predefined.json";

describe("buildPredefinedConfig", () => {
  it("returns a string starting with 'plugins:'", () => {
    const result = buildPredefinedConfig(JSON.stringify(minimalConfig));
    expect(result.startsWith("plugins:")).toBe(true);
  });

  it("produces valid YAML for the minimal config", () => {
    const yaml = buildPredefinedConfig(JSON.stringify(minimalConfig));
    expect(() => YAML.parse(yaml)).not.toThrow();
  });

  it("produces valid YAML for the standard config", () => {
    const yaml = buildPredefinedConfig(JSON.stringify(standardConfig));
    expect(() => YAML.parse(yaml)).not.toThrow();
  });

  it("minimal config YAML contains a plugins array", () => {
    const yaml = buildPredefinedConfig(JSON.stringify(minimalConfig));
    const parsed = YAML.parse(yaml) as { plugins: unknown[] };
    expect(Array.isArray(parsed.plugins)).toBe(true);
    expect(parsed.plugins.length).toBeGreaterThan(0);
  });

  it("standard config YAML contains a plugins array", () => {
    const yaml = buildPredefinedConfig(JSON.stringify(standardConfig));
    const parsed = YAML.parse(yaml) as { plugins: unknown[] };
    expect(Array.isArray(parsed.plugins)).toBe(true);
    expect(parsed.plugins.length).toBeGreaterThan(0);
  });

  it("each entry with a yamlConfig is included in the output", () => {
    const yaml = buildPredefinedConfig(JSON.stringify(standardConfig));
    const parsed = YAML.parse(yaml) as { plugins: unknown[] };
    const expectedPluginCount = Object.keys(standardConfig).length;
    expect(parsed.plugins.length).toBe(expectedPluginCount);
  });

  it("ignores entries without a yamlConfig property", () => {
    const input = JSON.stringify({ "no-yaml": {}, "with-yaml": { yamlConfig: "- uses:\n    - plugin: test@dev" } });
    const yaml = buildPredefinedConfig(input);
    expect(yaml.startsWith("plugins:")).toBe(true);
  });

  it("throws on invalid JSON", () => {
    expect(() => buildPredefinedConfig("not-json")).toThrow();
  });
});
