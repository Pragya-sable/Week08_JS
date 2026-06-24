const fs = require("fs");
const path = require("path");

module.exports = async function globalTeardown() {
  const resultsPath = "./test-results/results.json";

  if (!fs.existsSync(resultsPath)) {
    console.log(
      "⚠️ test-results/results.json not found, skipping report generation."
    );
    return;
  }

  const r = JSON.parse(fs.readFileSync(resultsPath, "utf8"));

  const platformSummary = {};
  const failedTests = [];

  let totalPlatforms = new Set();
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;

  for (const suite of r.suites || []) {
    // Platform derive from file name
    const fileName = suite.file || "";

    let platform = "Unknown";

    if (fileName.includes("WP")) platform = "WP";
    else if (fileName.includes("SAAS")) platform = "SAAS";
    else if (fileName.includes("HCDV")) platform = "HCDV";
    else if (fileName.includes("TWH")) platform = "TWH";

    totalPlatforms.add(platform);

    if (!platformSummary[platform]) {
      platformSummary[platform] = {
        total: 0,
        passed: 0,
        failed: 0,
      };
    }

    for (const spec of suite.specs || []) {
      const parts = spec.title.split(" - ");

      const siteName = parts[0] || "Unknown";

      for (const test of spec.tests || []) {
        totalTests++;

        const passed =
          test.results &&
          test.results.every(
            (r) => r.status === "passed" || r.status === "skipped"
          );

        platformSummary[platform].total++;

        if (passed) {
          platformSummary[platform].passed++;
          totalPassed++;
        } else {
          platformSummary[platform].failed++;
          totalFailed++;

          let failure =
            test.results.find((r) => r.error)?.error?.message ||
            "No error message available";

          failure = failure.split("\n")[0];

          failedTests.push({
            platform,
            siteName,
            testName: test.title,
            reason: failure,
          });
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
        <td>${remark}</td>
    </tr>`;
  }

  let failedRows = "";

  if (failedTests.length === 0) {
    failedRows = `
    <tr>
        <td colspan="4" style="text-align:center;background:#d4edda;font-weight:bold;">
            No failed test cases.
        </td>
    </tr>`;
  } else {
    for (const test of failedTests) {
      failedRows += `
        <tr>

            <td>${test.platform}</td>

            <td>${test.siteName}</td>

            <td>${test.testName}</td>

            <td style="white-space:pre-wrap;">
                ${test.reason}
            </td>

        </tr>`;
    }
  }
  const overall =
    totalFailed === 0 ? "✅ All Tests Passed" : "❌ Test Failures Found";

  const date = new Date().toLocaleString();

  const html = `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>Playwright Test Report</title>

<style>
body{
    font-family: Arial, Helvetica, sans-serif;
    background:#f5f5f5;
    color:#333;
    margin:20px;
    font-size:11px;
    line-height:1.3;
}

.container{
    max-width:1100px;
    margin:auto;
    background:#fff;
    padding:20px;
    border:1px solid #ddd;
}

h1{
    font-size:22px;
    margin:0 0 10px;
    color:#1f2937;
}

h2{
    font-size:16px;
    margin:20px 0 10px;
    color:#1f2937;
}

.summary{
    margin-bottom:20px;
}

.summary p{
    margin:3px 0;
    font-size:11px;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
    margin-bottom:20px;
    font-size:11px;
}

th{
    background:#1f2937;
    color:#fff;
    padding:7px;
    border:1px solid #ccc;
    text-align:left;
    font-size:11px;
}

td{
    border:1px solid #ccc;
    padding:6px;
    font-size:11px;
    vertical-align:top;
    word-break:break-word;
}

.success{
    background:#d9f2d9;
}

.failed{
    background:#f8d7da;
}

.no-fail{
    text-align:center;
    font-style:italic;
}

.footer{
    margin-top:10px;
    font-size:10px;
    color:#666;
}
</style>

</head>

<body>

<div class="container">

<h1>Playwright Test Report</h1>

<p><b>Generated :</b> ${date}</p>

<p>

<b>Status :</b>

<span style="font-size:16px;
font-weight:bold;
color:${totalFailed === 0 ? "green" : "red"}">

${overall}

</span>

</p>
<div class="summary">

<table>

<tr>

<td><b>Total Platforms</b></td>
<td>${totalPlatforms.size}</td>

<td><b>Total Test Cases</b></td>
<td>${totalTests}</td>

</tr>

<tr>

<td><b>Passed</b></td>
<td>${totalPassed}</td>

<td><b>Failed</b></td>
<td>${totalFailed}</td>

</tr>

</table>

</div>

<div class="section">

<h2>Platform Summary</h2>

<table>

<thead>

<tr>

<th>Platform</th>

<th>Total Test Cases</th>

<th>Passed</th>

<th>Failed</th>

<th>Remark</th>

</tr>

</thead>

<tbody>

${platformRows}
</tbody>

</table>

</div>

<div class="section">

<h2>Failed Test Details</h2>

<table>

<thead>

<tr>

<th>Platform</th>

<th>Site Name</th>

<th>Test Case Name</th>

<th>Failure Reason</th>

</tr>

</thead>

<tbody>

${failedRows}

</tbody>

</table>

</div>
<tfoot>

<tr style="font-weight:bold;background:#f2f2f2;">

<td>Total</td>

<td>${totalTests}</td>

<td>${totalPassed}</td>

<td>${totalFailed}</td>

<td>${totalFailed === 0 ? "All Pass" : `${totalFailed} Test(s) Failed`}</td>

</tr>

</tfoot>

</table>

</div>

<hr style="margin-top:40px;">

<p style="text-align:center;
font-size:12px;
color:#777;">

Generated automatically by Playwright Automation Framework

</p>

</div>

</body>

</html>
`;
  fs.writeFileSync("custom-report.html", html);

  console.log("✅ Report generated: custom-report.html");
};
