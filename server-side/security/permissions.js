"use strict";

// The browser may edit review fields, but it must never assign record ownership.
// These fields are intentionally explicit, so adding a model column does not
// automatically make that column writable through a public endpoint.
const REVIEW_EDITABLE_FIELDS = new Set([
  "content", "rating", "photo", "wheelchair", "unisex", "emergencyCord",
  "emergencyButton", "petFriendly", "requiresKey", "handDryer",
  "feminineProducts", "toiletCovers", "bidet", "singleStall",
  "multipleStall", "changingTable", "trashCan", "goodFlooring",
  "airFreshener", "automatic", "coatHook", "brailleSign", "hotWater",
  "firstAid", "sharpsDisposal",
]);

function pickReviewChanges(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => REVIEW_EDITABLE_FIELDS.has(key))
  );
}

function belongsToSessionUser(ownerId, sessionUserId) {
  return Number.isSafeInteger(Number(ownerId)) &&
    ownerId != null &&
    Number.isSafeInteger(Number(sessionUserId)) &&
    sessionUserId != null &&
    Number(ownerId) === Number(sessionUserId);
}

module.exports = { pickReviewChanges, belongsToSessionUser };
