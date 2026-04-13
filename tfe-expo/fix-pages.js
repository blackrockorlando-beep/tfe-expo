const fs = require("fs");
const path = require("path");

function findClientPages(dir) {
  const results = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...findClientPages(full));
    else if (item.name === "page.tsx") {
      const content = fs.readFileSync(full, "utf8");
      if (content.trimStart().startsWith('"use client"') || content.trimStart().startsWith("'use client'")) {
        results.push(full);
      }
    }
  }
  return results;
}

const pages = findClientPages("app");
for (const p of pages) {
  const dir = path.dirname(p);
  const newFile = path.join(dir, "ClientPage.tsx");
  fs.renameSync(p, newFile);
  const wrapper = `import { Suspense } from "react";
import ClientPage from "./ClientPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return <Suspense><ClientPage /></Suspense>;
}
`;
  fs.writeFileSync(p, wrapper);
  let content = fs.readFileSync(newFile, "utf8");
  content = content.replace(/export default function \w+/, "export default function ClientPage");
  fs.writeFileSync(newFile, content);
  console.log("Fixed: " + p);
}
console.log("Done. Fixed " + pages.length + " pages.");