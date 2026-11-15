const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pickReviewChanges, belongsToSessionUser } = require("../security/permissions");

test("ownership accepts matching IDs but not missing or unrelated users", () => {
  assert.equal(belongsToSessionUser(4, "4"), true);
  for (const owner of [null, undefined, 0, 5, "something"]) {
    assert.equal(belongsToSessionUser(owner, 4), false);
  }
  assert.equal(belongsToSessionUser(4, undefined), false);
});

test("review edits cannot override IDs or internal timestamps", () => {
  assert.deepEqual(pickReviewChanges({
    content: "Clean enough", rating: 4, UserId: 999, BathroomId: 7,
    id: 2, createdAt: "forged", photo: "test.jpg", unexpected: true
  }), { content: "Clean enough", rating: 4, photo: "test.jpg" });
  assert.deepEqual(pickReviewChanges(null), {});
});

test("legacy unauthenticated delete route stays absent", () => {
  const server = fs.readFileSync(path.join(__dirname, "..", "server.js"), "utf8");
  assert.doesNotMatch(server, /app\.delete\(["']\/adminbathrooms/);
  assert.match(server, /app\.patch\(["']\/bathrooms\/:bathroomId["'], authenticateUser/);
  assert.match(server, /attributes:\s*\["id", "name", "photo"\]/);
  assert.match(server, /pickReviewChanges\(req\.body\)/);
});
