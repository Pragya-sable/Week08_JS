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
      console.log("⚠ results.json not found.");
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
        total: 0,
        passed: 0,
        failed: 0,
        submissonFailed: 0,
        linkFailed: 0,
      };
    }

    for (const spec of suite.specs || []) {
      const parts = spec.title.split(" - ");

      const siteName = parts[0] || "Unknown";

      const siteInfo = platformUrls.find(
        (item) => item.name?.trim() === siteName?.trim()
      );

      const siteUrl = siteInfo?.url || "";
      console.log("Site:", siteName);
      console.log("URL:", siteUrl);

      for (const test of spec.tests || []) {
        totalTests++;

        const passed =
          test.results &&
          test.results.every(
            (r) => r.status === "passed" || r.status === "skipped"
          );
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
          if (isPrivacy || isCookie || isLegal) {
            platformSummary[platform].linkFailed++;
          }
          if (title.includes("Successful form submission")) {
            platformSummary[platform].submissonFailed =
              (platformSummary[platform].submissonFailed || 0) + 1;
          }

          let failure =
            test.results.find((r) => r.error)?.error?.message ||
            "No error message available";

          failure = failure.replace(/\x1B\[[0-9;]*m/g, "");
          const match = failure.match(/Timeout.*|Error:.*/);
          failure = match ? match[0] : failure.split("\n")[0].trim();
          console.log("Platform:", platform);
          console.log("Site Name:", siteName);
          console.log("failure:", failure);
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
          };
          failedTests.push(failedEntry);
          allTests.push(failedEntry);
        }
      }
    }
  }

  let platformRows = "";

  for (const [platform, data] of Object.entries(platformSummary)) {
    const remark =
      data.failed === 0 ? "All Pass" : `${data.failed} Test(s) Failed`;

    const color = data.failed === 0 ? "#d4edda" : "#f8d7da";

    platformRows += `
      <tr class="${data.failed === 0 ? "row-pass" : "row-fail"}">
        <td><b>${platform}</b></td>
        <td style="text-align:center">${data.total}</td>
        <td style="text-align:center" class="text-pass">${data.passed}</td>
        <td style="text-align:center" class="${
          data.failed > 0 ? "text-fail" : ""
        }">${data.failed}</td>
        <td style="text-align:center" class="${
          data.submissonFailed > 0 ? "text-fail" : ""
        }">${data.submissonFailed || 0}</td>
        <td style="text-align:center" class="${
          data.linkFailed > 0 ? "text-fail" : ""
        }">${data.linkFailed || 0}</td>
      </tr>`;
  }

  // Group tests by platform + siteUrl (one row per URL)
  const groupedMap = {};
  for (const test of allTests) {
    const key = `${test.platform}||${test.siteUrl || test.siteName}`;
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
    const isNA =
      test.status !== "passed" &&
      ((test.isPrivacy && test.reason.includes("Privacy notice link")) ||
        (test.isCookie && test.reason.includes("Cookies notice link")) ||
        (test.isLegal && test.reason.includes("Legal notice link")));
    const statusIcon = test.status === "passed" ? "✅" : isNA ? "NA" : "❌";
    const cellState = test.status === "passed" ? "pass" : isNA ? "na" : "fail";
    if (test.isSubmission)
      entry.submission = {
        icon: statusIcon,
        state: cellState,
        reason: test.reason,
      };
    if (test.isPrivacy)
      entry.privacy = {
        icon: statusIcon,
        state: cellState,
        reason: test.reason,
      };
    if (test.isCookie)
      entry.cookie = {
        icon: statusIcon,
        state: cellState,
        reason: test.reason,
      };
    if (test.isLegal)
      entry.legal = { icon: statusIcon, state: cellState, reason: test.reason };
    if (test.reason && !isNA) entry.reasons.push(test.reason);
  }

  let allTestRows = "";

  if (Object.keys(groupedMap).length === 0) {
    allTestRows = `
      <tr>
        <td colspan="7" style="text-align:center;background:#d4edda;font-weight:bold;">
          No test cases found.
        </td>
      </tr>`;
  } else {
    for (const entry of Object.values(groupedMap)) {
      const anyFailed = [
        entry.submission,
        entry.privacy,
        entry.cookie,
        entry.legal,
      ].some((t) => t && t.state !== "pass");
      const rowBg = anyFailed ? "#fdecea" : "#d9f2d9";
      const failReasons = [
        entry.submission,
        entry.privacy,
        entry.cookie,
        entry.legal,
      ]
        .filter((t) => t && t.reason)
        .map((t) => t.reason)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join("\n");

      const rowClass = anyFailed ? "row-fail" : "row-pass";
      const cellText = (t) => {
        if (!t) return `<td style="text-align:center;color:#9ca3af;">-</td>`;
        if (t.state === "pass")
          return `<td style="text-align:center" class="text-pass">Passed</td>`;
        if (t.state === "na")
          return `<td style="text-align:center" class="text-na">NA</td>`;
        return `<td style="text-align:center" class="text-fail">Failed</td>`;
      };

      allTestRows += `
        <tr class="${rowClass}">
          <td>${entry.platform}</td>
          <td>${entry.siteName}</td>
          <td>
            ${
              entry.siteUrl
                ? `<a href="${entry.siteUrl}" target="_blank" class="url-link">${entry.siteUrl}</a>`
                : entry.siteName
            }
          </td>
          ${cellText(entry.submission)}
          ${cellText(entry.privacy)}
          ${cellText(entry.cookie)}
          ${cellText(entry.legal)}
          <td class="reason-cell">${failReasons || "—"}</td>
        </tr>`;
    }
  }

  const overall =
    totalFailed === 0 ? "All Tests Passed" : "Test Failures Found";
  const date = new Date().toLocaleString();

  const template = fs.readFileSync(templatePath, "utf8");
  const html = template
    .replace("{{DATE}}", date)
    .replace("{{STATUS_CLASS}}", totalFailed === 0 ? "pass" : "fail")
    .replace("{{OVERALL}}", overall)
    .replace("{{PLATFORM_ROWS}}", platformRows)
    .replace("{{ALL_TEST_ROWS}}", allTestRows);
  fs.writeFileSync("custom-report.html", html);

  console.log("📋 Report generated: custom-report.html");
};

if (require.main === module) {
  module.exports();
}
