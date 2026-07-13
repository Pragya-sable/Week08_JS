const cellState = test.status === "passed" ? "pass" : "fail";
if (test.isSubmission)
  entry.submission = {
    state: cellState,
    reason: test.reason,
    screenshot: test.screenshot,
  };
if (test.isPrivacy)
  entry.privacy = {
    state: cellState,
    reason: test.reason,
    screenshot: test.screenshot,
  };
if (test.isCookie)
  entry.cookie = {
    state: cellState,
    reason: test.reason,
    screenshot: test.screenshot,
  };
if (test.isLegal)
  entry.legal = {
    state: cellState,
    reason: test.reason,
    screenshot: test.screenshot,
  };
if (test.reason) entry.reasons.push(test.reason);

<td style="text-align:center">
  $
  {[entry.submission, entry.privacy, entry.cookie, entry.legal]
    .filter((t) => t?.screenshot)
    .map((t) => `<img src="${t.screenshot}" ...>`)
    .join("") || "—"}
</td>;
