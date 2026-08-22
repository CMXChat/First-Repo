const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

const authority = read("docs/DOCUMENTATION-AUTHORITY.md");
const frontend = read("docs/continuum-frontend-CURRENT.md");
const ai = read("docs/AI-START-HERE.md");
const repoReadme = read("README.md");
const docsReadme = read("docs/README.md");
const routes = JSON.parse(read("assets/cmx-routes.json"));

expect(!exists("docs/PROJECT-STATUS-CURRENT.md"), "First-Repo must not keep a duplicated project/backend status authority");

for (const word of ["LIVE UI", "WIRED", "PREVIEW", "LEGACY"]) {
  expect(authority.includes(`**${word}**`), `frontend documentation authority must define ${word}`);
}

for (const route of ["/checkin/", "/directory/", "/library/", "/automations/", "/email/", "/requests/", "/control/", "/spaces/", "/doc/"]) {
  expect(frontend.includes(`\`${route}\``), `frontend authority must classify ${route}`);
  expect(routes.routes.some((entry) => entry.path === route), `route registry must include ${route}`);
}

expect(!frontend.includes("canonical `/lab/automations/`"), "frontend authority must not restore the retired Lab route as canonical");
expect(routes.version >= 39, "route registry must remain at documentation-consolidation version 39+");
expect(routes.routes.every((entry) => !entry.path.startsWith("/lab/")), "registered product routes must not return to /lab/*");

expect(repoReadme.includes("CMXChat/jay-app"), "root README must name jay-app as backend/project authority");
expect(repoReadme.includes("PROJECT-STATUS-CURRENT.md"), "root README must point backend questions to jay-app project status");
expect(docsReadme.includes("CMXChat/jay-app/PROJECT-STATUS-CURRENT.md"), "docs index must point backend questions to jay-app");
expect(ai.includes("jay-app is the only project/backend status authority") || ai.includes("`jay-app` is the only project/backend status authority"), "AI entrypoint must make jay-app the sole backend/project authority");
expect(authority.includes("A filename containing `CURRENT` is not automatically global authority"), "authority policy must prevent filename-only precedence");

for (const text of [repoReadme, docsReadme, ai, frontend, authority]) {
  expect(!text.includes("c0d1e2f3a4b5"), "First-Repo authority docs must not duplicate backend migration heads");
  expect(!text.includes("170 backend tests"), "First-Repo authority docs must not duplicate backend validation counts");
  expect(!text.includes("PR #24"), "First-Repo authority docs must not duplicate active backend PR status");
}

const control = routes.routes.find((entry) => entry.path === "/control/");
const library = routes.routes.find((entry) => entry.path === "/library/");
const requests = routes.routes.find((entry) => entry.path === "/requests/");
expect(/Runtime receipt\/history/i.test(control.description), "Control registry description must mention protected Runtime history");
expect(/ContentAsset/i.test(library.description) && /immutable Version/i.test(library.description), "Library registry description must reflect the protected content/version lane");
expect(/Email safe simulation/i.test(requests.description), "Requests registry description must reflect the current Email operation mode");

console.log("Continuum frontend documentation authority contract passed.");