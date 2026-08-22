const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

const authority = read("docs/DOCUMENTATION-AUTHORITY.md");
const status = read("docs/PROJECT-STATUS-CURRENT.md");
const frontend = read("docs/continuum-frontend-CURRENT.md");
const ai = read("docs/AI-START-HERE.md");
const repoReadme = read("README.md");
const docsReadme = read("docs/README.md");
const routes = JSON.parse(read("assets/cmx-routes.json"));

for (const word of ["LIVE", "WIRED", "STACKED", "PREVIEW", "PLANNED"]) {
  expect(authority.includes(`**${word}**`), `documentation authority must define ${word}`);
  expect(status.includes(word), `project status must use ${word}`);
}

expect(status.includes("de55627926316581808337f8e9c10d26e7d64588"), "project status must retain current production release truth");
expect(status.includes("c41f9b8d2e70"), "project status must retain current production migration truth");
expect(status.includes("PR #24"), "project status must name the active stacked backend PR");
expect(status.includes("c0d1e2f3a4b5"), "project status must name the current stacked migration head");

for (const route of ["/checkin/", "/directory/", "/library/", "/automations/", "/email/", "/requests/", "/control/", "/spaces/", "/doc/"]) {
  expect(frontend.includes(`\`${route}\``), `frontend authority must classify ${route}`);
  expect(routes.routes.some((entry) => entry.path === route), `route registry must include ${route}`);
}

expect(!frontend.includes("canonical `/lab/automations/`"), "frontend authority must not restore the retired Lab route as canonical");
expect(!status.includes("canonical `/lab/automations/`"), "project status must not restore the retired Lab route as canonical");
expect(routes.version >= 39, "route registry must be at documentation-consolidation version 39+");
expect(routes.routes.every((entry) => !entry.path.startsWith("/lab/")), "registered product routes must not return to /lab/*");

expect(repoReadme.includes("docs/AI-START-HERE.md"), "root README must point new contexts to AI-START-HERE");
expect(docsReadme.includes("PROJECT-STATUS-CURRENT.md"), "docs index must point to project status authority");
expect(ai.includes("do not reconstruct truth from chat history"), "AI entrypoint must explicitly prefer GitHub truth");
expect(authority.includes("A filename containing `CURRENT` is not automatically global authority"), "authority policy must prevent filename-only precedence");

const control = routes.routes.find((entry) => entry.path === "/control/");
const library = routes.routes.find((entry) => entry.path === "/library/");
const requests = routes.routes.find((entry) => entry.path === "/requests/");
expect(/Runtime receipt\/history/i.test(control.description), "Control registry description must mention protected Runtime history");
expect(/ContentAsset/i.test(library.description) && /immutable Version/i.test(library.description), "Library registry description must reflect the protected content/version lane");
expect(/Email safe simulation/i.test(requests.description), "Requests registry description must reflect the current Email operation mode");

console.log("Continuum documentation authority contract passed.");
