import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const forbid = (layer) => [
  `@/components/${layer}/*`,
  `**/components/${layer}/*`,
  `../${layer}/*`,
  `../../${layer}/*`,
];

const alwaysBanned = [
  {
    group: ["@/lib/cms/*", "**/lib/cms/*"],
    message: "Components must not import the CMS layer.",
  },
  {
    group: ["@/app/*", "**/app/*"],
    message: "Components must not import from app.",
  },
];

const layer = (files, ...upper) => ({
  files,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          ...upper.map((name) => ({
            group: forbid(name),
            message: `This layer must not import ${name}.`,
          })),
          ...alwaysBanned,
        ],
      },
    ],
  },
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  layer(["components/atoms/**"], "molecules", "organisms", "templates"),
  layer(["components/molecules/**"], "organisms", "templates"),
  layer(["components/organisms/**"], "templates"),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
