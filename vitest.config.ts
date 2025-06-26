import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "examples/",
        "vitest.config.ts",
      ],
    },
  },
});
