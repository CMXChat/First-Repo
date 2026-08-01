(() => {
  "use strict";

  const data = window.CMX_BACKEND_BLUEPRINT;
  if (!data) return;

  const ep = (method, path, family, phase, access, status, purpose, pages, options = {}) => ({
    id: `${method}-${path}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    method,
    path,
    family,
    phase,
    access,
    status,
    purpose,
    pages,
    database: options.database || "No",
    background: options.background || "No",
    request: options.request || "No request body.",
    response: options.response || { status: "server-defined" },
    dependencies: options.dependencies || ["Python API route", "Typed request and response schema"],
    security: options.security || ["Authenticate", "Validate input", "Return safe errors", "Rate limit"]
  });

  const aiEndpoints = [];
  data.endpoints.push(...aiEndpoints);
})();
