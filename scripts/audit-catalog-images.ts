import { auditCatalogImages } from "../lib/catalog-audit";

const issues = auditCatalogImages();
const errors = issues.filter((i) => i.severity === "error");

for (const i of issues) {
  console.log(`${i.severity.toUpperCase()} ${i.code}  ${i.slug}  (${i.name})`);
  console.log(`  ${i.image}`);
  console.log(`  ${i.detail}`);
}

console.log(`\n${errors.length} error(s), ${issues.length} issue(s) across live catalog.`);
if (errors.length) process.exit(1);
