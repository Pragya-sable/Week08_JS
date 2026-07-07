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
      <tr style="background:${color}">
        <td>${platform}</td>
        <td>${data.total}</td>
        <td>${data.passed}</td>
        <td>${data.failed}</td>
        <td>${data.submissonFailed || 0}</td>
        <td>${data.linkFailed || 0}</td>
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
        .filter((t) => t && t.reason && t.state === "fail")
        .map((t) => t.reason)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join("\n");

      const cellStyle = (t) => {
        if (!t)
          return `style="text-align:center;background:#f0f0f0;color:#999;"`;
        if (t.state === "pass")
          return `style="text-align:center;background:#c3e6cb;color:#155724;font-weight:bold;"`;
        if (t.state === "na")
          return `style="text-align:center;background:#f8d7da;color:#721c24;font-weight:bold;"`;
        return `style="text-align:center;background:#f8d7da;color:#721c24;font-weight:bold;"`;
      };

      allTestRows += `
        <tr style="background:${rowBg}">
          <td>${entry.platform}</td>
          <td>${entry.siteName}</td>
          <td>
            ${
              entry.siteUrl
                ? `<a href="${entry.siteUrl}" target="_blank" style="color:#0066cc;text-decoration:none;font-size:10px;">${entry.siteUrl}</a>`
                : entry.siteName
            }
          </td>
          <td ${cellStyle(entry.submission)}>${
        entry.submission ? entry.submission.icon : "-"
      }</td>
          <td ${cellStyle(entry.privacy)}>${
        entry.privacy ? entry.privacy.icon : "-"
      }</td>
          <td ${cellStyle(entry.cookie)}>${
        entry.cookie ? entry.cookie.icon : "-"
      }</td>
          <td ${cellStyle(entry.legal)}>${
        entry.legal ? entry.legal.icon : "-"
      }</td>
          <td style="white-space:pre-wrap;font-size:10px;">${
            failReasons || "—"
          }</td>
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

// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <title>Playwright Test Report</title>
// <style>
// body{font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;color:#333;margin:20px;font-size:11px;line-height:1.3;}
// .container{max-width:1100px;margin:auto;background:#fff;padding:20px;border:1px solid #ddd;}
// h1{font-size:22px;margin:0 0 10px;color:#1f2937;}
// h2{font-size:16px;margin:20px 0 10px;}
// .summary{margin-bottom:20px;}
// .summary p{margin:3px 0;font-size:11px;}
// table{width:100%;border-collapse:collapse;margin-top:10px;margin-bottom:20px;font-size:11px;}
// th{background:#1f2937;color:#fff;padding:7px;border:1px solid #ccc;text-align:left;font-size:11px;}
// td{border:1px solid #ccc;padding:6px;font-size:11px;vertical-align:top;word-break:break-word;}
// .success{background:#d9f2d9;}
// .failed{background:#f8d7da;}
// .no-fail{text-align:center;font-style:italic;}
// .footer{margin-top:40px;}
// .status-pass{color:green;}
// .status-fail{color:red;}
// </style>
// </head>
// <body>
// <div class="container">

// <h1>Playwright Test Report ({{DATE}})</h1>

// <p>
//   <b>Status :</b>
//   <span class="status-{{STATUS_CLASS}}" style="font-size:12px;font-weight:bold;">{{OVERALL}}</span>
// </p>

// <div class="section">
// <h2>Platform Summary</h2>
// <table>
// <thead>
// <tr>
// <th>Platform</th>
// <th>Total Test Cases</th>
// <th>Passed</th>
// <th>Failed</th>
// <th>Submission Failed</th>
// <th>Privacy/Cookie/Legal Link Failed</th>
// </tr>
// </thead>
// <tbody>
// {{PLATFORM_ROWS}}
// </tbody>
// </table>
// </div>

// <div class="section">
// <h2>All Test Details</h2>
// <table>
// <thead>
// <tr>
// <th>Platform</th>
// <th>Site Name</th>
// <th>URL</th>
// <th>Submission</th>
// <th>Privacy</th>
// <th>Cookie</th>
// <th>Legal</th>
// <th>Failure Reason</th>
// </tr>
// </thead>
// <tbody>
// {{ALL_TEST_ROWS}}
// </tbody>
// </table>
// </div>

// <hr style="margin-top:40px;">
// <p style="text-align:center;font-size:10px;color:#777;">Generated automatically by Playwright Automation Framework</p>

// </div>
// </body>
// </html>
