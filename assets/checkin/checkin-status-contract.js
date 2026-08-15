(function exposeCheckInStatusContract(root, factory) {
  const contract = factory();
  if (typeof module === "object" && module.exports) module.exports = contract;
  else root.CheckInStatusContract = contract;
})(globalThis, () => {
  "use strict";

  const COUNT_FIELDS = ["document_count", "contact_count", "organization_count", "update_revision_count", "trigger_action_count"];

  function isCount(value) {
    const number = Number(value);
    return Number.isFinite(number) && Number.isInteger(number) && number >= 0;
  }

  function count(value) {
    return isCount(value) ? Number(value) : 0;
  }

  function normalize(data = {}) {
    const interval = Number(data.interval_hours);
    const grace = Number(data.grace_hours);
    return {
      schemaCompatible: interval === 72 && COUNT_FIELDS.every(field => isCount(data[field])),
      intervalHours: 72,
      graceHours: Number.isFinite(grace) && grace >= 0 ? grace : 24,
      documentCount: count(data.document_count),
      contactCount: count(data.contact_count),
      organizationCount: count(data.organization_count),
      updateRevisionCount: count(data.update_revision_count),
      actionCount: count(data.trigger_action_count),
    };
  }

  return { normalize };
});
