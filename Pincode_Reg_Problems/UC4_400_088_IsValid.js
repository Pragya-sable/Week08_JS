const { contactUsHCDVUrls } = require("../config/hcdvUrl");
const contactUsSAASUrls = require("../config/saasUrl");
const { contactUsWPUrls } = require("../config/wpUrl");
const { contactUsTWHUrls } = require("../config/twhUrl");
const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "report-template.html");

module.exports = async function globalTeardown() {
  const resultsPath = process.argv[2] || "./test-results/results.json";

  let allSuites = [];

  if (fs.existsSync(resultsPath) && fs.lstatSync(resultsPath).isDirectory()) {
    // GitHub Actions
    const folders = fs.readdirSync(resultsPath);

    for (const folder of folders) {
      const jsonFile = path.join(resultsPath, folder, "results.json");

      if (!fs.existsSync(jsonFile)) continue;

      const report = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

      if (report.suites) {
        allSuites.push(...report.suites);
      }
    }
  } else {
    // Local
    if (!fs.existsSync(resultsPath)) {
      // console.log("⚠ results.json not found.");
      return;
    }

    const r = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
    allSuites = r.suites || [];
  }

  const platformSummary = {};
  const failedTests = [];
  const allTests = [];

  let totalPlatforms = new Set();
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  let submissionFailed = 0;
  let linkFailed = 0;

  for (const suite of allSuites) {
    // Platform derive from file name
    const fileName = suite.file || "";

    let platform = "Unknown";
    if (fileName.includes("WP")) platform = "WP";
    else if (fileName.includes("SAAS")) platform = "SAAS";
    else if (fileName.includes("HCDV")) platform = "HCDV";
    else if (fileName.includes("TWH")) platform = "TWH";

    let platformUrls = [];

    const allSAASUrls = [
      ...contactUsSAASUrls.contactUsSAASUrls1,
      ...contactUsSAASUrls.contactUsSAASUrls2,
      ...contactUsSAASUrls.contactUsSAASUrls3,
      ...contactUsSAASUrls.contactUsSAASUrls4,
    ];

    if (platform === "WP") platformUrls = contactUsWPUrls;
    else if (platform === "SAAS") platformUrls = allSAASUrls;
    else if (platform === "HCDV") platformUrls = contactUsHCDVUrls;
    else if (platform === "TWH") platformUrls = contactUsTWHUrls;

    totalPlatforms.add(platform);

    if (!platformSummary[platform]) {
      platformSummary[platform] = {
        totalSites: platformUrls.length,
        total: 0,
        passed: 0,
        failed: 0,
        privacyFailed: 0,
        cookieFailed: 0,
        legalFailed: 0,
        submissonFailed: 0,
      };
    }

    for (const spec of suite.specs || []) {
      const parts = spec.title.split(" - ");

      const siteName = parts[0] || "Unknown";

      const siteInfo = platformUrls.find(
        (item) => item.name?.trim() === siteName?.trim()
      );

      const siteUrl = siteInfo?.url || "";
      // console.log("Site:", siteName);
      // console.log("URL:", siteUrl);

      for (const test of spec.tests || []) {
        totalTests++;

        const lastResult = test.results?.[test.results.length - 1];
        // test.status: "expected"=passed, "flaky"=passed on retry, "unexpected"=failed
        const passed = test.status === "expected" || test.status === "flaky";
        const title = spec.title || "";
        const isPrivacy = title.includes("Privacy");
        const isCookie = title.includes("Cookie");
        const isLegal = title.includes("Legal");

        platformSummary[platform].total++;

        if (passed) {
          platformSummary[platform].passed++;
          totalPassed++;
          allTests.push({
            platform,
            siteName,
            testName: spec.title,
            siteUrl,
            status: "passed",
            isPrivacy,
            isCookie,
            isLegal,
            isSubmission: title.includes("Successful form submission"),
            reason: "",
          });
        } else {
          platformSummary[platform].failed++;
          totalFailed++;
          if (title.includes("Successful form submission")) {
            platformSummary[platform].submissonFailed =
              (platformSummary[platform].submissonFailed || 0) + 1;
          }

          if (isPrivacy) platformSummary[platform].privacyFailed++;
          if (isCookie) platformSummary[platform].cookieFailed++;
          if (isLegal) platformSummary[platform].legalFailed++;

          let failure =
            lastResult?.error?.message || "No error message available";

          failure = failure.replace(/\x1B\[[0-9;]*m/g, "");
          const match = failure.match(/Timeout.*|Error:.*/);
          failure = match ? match[0] : failure.split("\n")[0].trim();
          // console.log("Platform:", platform);
          // console.log("Site Name:", siteName);
          // console.log("failure:", failure);

          //screen shot
          // const screenshotAttachment = test.results.flatMap(r => r.attachments || []).find(a =>a.contentType === 'image/png');
          const failedEntry = {
            platform,
            siteName,
            testName: spec.title,
            siteUrl,
            status: "failed",
            isPrivacy,
            isCookie,
            isLegal,
            isSubmission: title.includes("Successful form submission"),
            reason: failure,
            // screenshot: screenshotAttachment ? screenshotAttachment.path : ""
          };
          failedTests.push(failedEntry);
          allTests.push(failedEntry);
        }
      }
    }
  }

  // Group tests by platform + siteName + siteUrl (one row per site)
  const groupedMap = {};
  for (const test of allTests) {
    const key = `${test.platform}||${test.siteName}||${test.siteUrl}`;
    if (!groupedMap[key]) {
      groupedMap[key] = {
        platform: test.platform,
        siteName: test.siteName,
        siteUrl: test.siteUrl,
        submission: null,
        privacy: null,
        cookie: null,
        legal: null,
        reasons: [],
      };
    }

    const entry = groupedMap[key];
    // const isNA =
    //   test.status !== "passed" &&
    //   ((test.isPrivacy && test.reason.includes("Privacy notice link")) ||
    //   (test.isCookie && test.reason.includes("Cookies notice link")) ||
    //   (test.isLegal && test.reason.includes("Legal notice link")));
    const statusIcon = test.status === "passed" ? "✅" : "❌";
    const cellState = test.status === "passed" ? "pass" : "fail";

    if (test.isPrivacy)
      entry.privacy = {
        icon: statusIcon,
        state: cellState,
        reason: test.reason,
        // screenshot: test.screenshot,
      };
    if (test.isCookie)
      entry.cookie = {
        icon: statusIcon,
        state: cellState,
        reason: test.reason,
        // screenshot: test.screenshot,
      };
    if (test.isLegal)
      entry.legal = { icon: statusIcon, state: cellState, reason: test.reason };
    if (test.isSubmission)
      entry.submission = {
        icon: statusIcon,
        state: cellState,
        reason: test.reason,
        // screenshot: test.screenshot,
      };
    if (test.reason) entry.reasons.push(test.reason);
  }

  // Group entries by platform for dropdown
  const groupedByPlatform = {};
  for (const entry of Object.values(groupedMap)) {
    if (!groupedByPlatform[entry.platform])
      groupedByPlatform[entry.platform] = [];
    groupedByPlatform[entry.platform].push(entry);
  }

  let platformRows = "";

  for (const [platform, data] of Object.entries(platformSummary)) {
    const detailEntries = groupedByPlatform[platform] || [];

    const cellText = (t) => {
      if (!t) return `<td style="text-align:center" class="text-na">NA</td>`;
      if (t.state === "pass")
        return `<td style="text-align:center" class="text-pass">Passed</td>`;
      if (t.state === "na")
        return `<td style="text-align:center" class="text-na">NA</td>`;
      return `<td style="text-align:center" class="text-fail">Failed</td>`;
    };

    let detailRows = "";
    for (const entry of detailEntries) {
      const anyFailed = [
        entry.privacy,
        entry.cookie,
        entry.legal,
        entry.submission,
      ].some((t) => t && t.state !== "pass");
      const failReasons = [
        entry.privacy,
        entry.cookie,
        entry.legal,
        entry.submission,
      ]
        .filter((t) => t && t.reason)
        .map((t) => t.reason)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join("\n");

      detailRows += `
        <tr class="${anyFailed ? "row-fail" : "row-pass"}">
          <td>${entry.siteName}</td>
          <td>${
            entry.siteUrl
              ? `<a href="${entry.siteUrl}" target="_blank" class="url-link">${entry.siteUrl}</a>`
              : entry.siteName
          }</td>
          ${cellText(entry.privacy)}
          ${cellText(entry.cookie)}
          ${cellText(entry.legal)}
          ${cellText(entry.submission)}
          <td class="reason-cell">${failReasons || "—"}</td>
        </tr>`;
    }

    platformRows += `
      <tr class="${
        data.failed === 0 ? "row-pass" : "row-fail"
      } expandable" onclick="toggleDetail('${platform}')">
        <td><b>▶ ${platform}</b></td>
        <td style="text-align:center">${data.total}</td>
        <td style="text-align:center" class="text-pass">${data.passed}</td>
        <td style="text-align:center" class="${
          data.failed > 0 ? "text-fail" : ""
        }">${data.failed}</td>
        <td style="text-align:center" class="${
          data.privacyFailed > 0 ? "text-fail" : ""
        }">${data.privacyFailed || 0}</td>
        <td style="text-align:center" class="${
          data.cookieFailed > 0 ? "text-fail" : ""
        }">${data.cookieFailed || 0}</td>
        <td style="text-align:center" class="${
          data.legalFailed > 0 ? "text-fail" : ""
        }">${data.legalFailed || 0}</td>
        <td style="text-align:center" class="${
          data.submissonFailed > 0 ? "text-fail" : ""
        }">${data.submissonFailed || 0}</td>
      </tr>
      <tr class="detail-row" id="detail-${platform}">
        <td colspan="8" style="padding:0;">
          <table class="detail-table">
            <thead>
              <tr>
                <th>Site Name</th><th>URL</th><th>Privacy</th><th>Cookie</th><th>Legal</th><th>Submission</th><th>Failure Reason</th>
              </tr>
            </thead>
            <tbody>${detailRows}</tbody>
          </table>
        </td>
      </tr>`;
  }

  const overall =
    totalFailed === 0 ? "All Tests Passed" : "Test Failures Found";
  const date = new Date().toLocaleString();

  const template = fs.readFileSync(templatePath, "utf8");
  const html = template
    .replace("{{DATE}}", date)
    .replace("{{STATUS_CLASS}}", totalFailed === 0 ? "pass" : "fail")
    .replace("{{OVERALL}}", overall)
    .replace("{{PLATFORM_ROWS}}", platformRows);
  fs.writeFileSync("custom-report.html", html);

  console.log("📋 Report generated: custom-report.html");
};

if (require.main === module) {
  module.exports();
}
