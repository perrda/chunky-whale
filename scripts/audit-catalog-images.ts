import { auditCatalogImages } from "../lib/catalog-audit";

async function main() {
  const issues = await auditCatalogImages();
  const errors = issues.filter((i) => i.severity === "error");

  for (const i of issues) {
    console.log(`${i.severity.toUpperCase()} ${i.code}  ${i.slug}  (${i.name})`);
    console.log(`  ${i.image}`);
    console.log(`  ${i.detail}`);
  }

  console.log(`\n${errors.length} error(s), ${issues.length} issue(s) across live catalog.`);
  if (errors.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
