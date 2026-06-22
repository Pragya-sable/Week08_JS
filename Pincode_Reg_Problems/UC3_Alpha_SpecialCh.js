function validatePinCode(pin) {
  const pinPattern = /^[0-9]{6}$/;
  return pinPattern.test(pin);
}

// Test cases
console.log(validatePinCode("400088"));
console.log(validatePinCode("A400088"));
console.log(validatePinCode("400088B"));
console.log(validatePinCode("40008A"));
console.log(validatePinCode("400088 "));
console.log(validatePinCode("1234@6"));
console.log(validatePinCode("4000887"));

// name: Contact Us Playwright Tests

// on:
//   push:
//     branches:
//       - copilot/create-playwright-test-structure

//   workflow_dispatch:

// permissions:
//   contents: read
//   actions: read

// jobs:
//   test:
//     name: "${{ matrix.suite }} Tests"
//     runs-on: ubuntu-latest
//     timeout-minutes: ${{ matrix.timeout }}

//     strategy:
//       fail-fast: false
//       matrix:
//         include:
//           - suite: SAAS_1
//             spec: tests/SAASContactUsForm.spec.js
//             grep: "Axe|Algida|Andrelon|Baba|Bestfoods|Calve|Carte|Citra|Clear|Close|Colman|Continental|Degree|Dove|Duschdas|Ego|Eskimo|Zwit"
//             timeout: 180

//           - suite: SAAS_2
//             spec: tests/SAASContactUsForm.spec.js
//             grep: "Gelartier|GROM|HB|Hellmann|Ingman|Kibon|Kissan|Klondike|Knorr|Lux|Lipton|Langnese|Club|Lifebuoy|Lynx|Liquid|Lusso|Maizen"
//             timeout: 180

//           - suite: SAAS_3
//             spec: tests/SAASContactUsForm.spec.js
//             grep: "Montadent|Nexxus|Neutral|Parogency1|PS|Pond|Pepsodent|Pears|Pinguino|Signal|Prodent|Pot Noodle|Regenerate|Royco|Rexona|S"
//             timeout: 180

//           - suite: SAAS_4
//             spec: tests/SAASContactUsForm.spec.js
//             grep: "Sure|Vegetarian|Talenti|TRESemme|Vaseline|Unox|AllThings|Walls|Yasso|Zendium|Zwitsal|Portuguese Close|Breyers|Humor|Dawn"
//             timeout: 180

//           - suite: HCDV
//             spec: tests/HCDVContactUsForm.spec.js
//             timeout: 180

//           - suite: TWH
//             spec: tests/TWHContactUsForm.spec.js
//             timeout: 180

//           - suite: WP
//             spec: tests/WPContactUSForm.spec.js
//             timeout: 180

//     steps:
//       - name: Checkout repository
//         uses: actions/checkout@v4

//       - name: Set up Node.js
//         uses: actions/setup-node@v4
//         with:
//           node-version: "20"
//           cache: "npm"

//       - name: Install dependencies
//         run: npm ci

//       - name: Install Playwright browsers
//         run: npx playwright install --with-deps chromium

//       - name: Run ${{ matrix.suite }} tests
//         id: run_tests
//         run: npx playwright test ${{ matrix.spec }} --grep "${{ matrix.grep || '.*' }}" --reporter=list,html,json
//         env:
//           CI: true
//           PLAYWRIGHT_JSON_OUTPUT_NAME: test-results/results.json

//       - name: Save suite result
//         if: always()
//         run: |
//           node << 'EOF'
//           const fs = require('fs');
//           let rows = [];
//           try {
//             const r = JSON.parse(fs.readFileSync('./test-results/results.json', 'utf8'));
//             const siteMap = {};
//             for (const suite of r.suites || []) {
//               for (const spec of suite.specs || []) {
//                 const parts = spec.title.split(' - ');
//                 const siteName = parts[0] || 'Unknown';
//                 if (!siteMap[siteName]) siteMap[siteName] = { passed: 0, failed: 0 };
//                 for (const test of spec.tests || []) {
//                   const ok = test.results.every(res => res.status === 'passed' || res.status === 'skipped');
//                   if (ok) siteMap[siteName].passed++;
//                   else siteMap[siteName].failed++;
//                 }
//               }
//             }
//             rows = Object.entries(siteMap).map(([name, d]) => {
//               const remark = d.failed === 0 ? 'All Pass' : d.failed + ' test(s) failed';
//               return name + '|' + d.passed + '|' + d.failed + '|' + remark;
//             });
//           } catch(e) {
//             rows = ['Error|0|0|Could not parse results'];
//           }
//           fs.writeFileSync('suite-result-${{ matrix.suite }}.txt', rows.join('\n'));
//           EOF

//       - name: Upload suite result
//         if: always()
//         uses: actions/upload-artifact@v4
//         with:
//           name: suite-result-${{ matrix.suite }}
//           path: suite-result-${{ matrix.suite }}.txt
//           retention-days: 1

//       - name: Upload screenshots ${{ matrix.suite }}
//         if: failure()
//         uses: actions/upload-artifact@v4
//         with:
//           name: test-screenshots-${{ matrix.suite }}
//           path: test-results/
//           retention-days: 30

//       - name: Upload Playwright report ${{ matrix.suite }}
//         if: always()
//         uses: actions/upload-artifact@v4
//         with:
//           name: playwright-report-${{ matrix.suite }}
//           path: playwright-report/
//           retention-days: 30

//   notify:
//     name: Send Email Report
//     runs-on: ubuntu-latest
//     needs: test
//     if: always()
//     steps:
//       - name: Download all suite results
//         uses: actions/download-artifact@v4
//         with:
//           pattern: suite-result-*
//           merge-multiple: true
//           path: suite-results/

//       - name: Build email body
//         id: build_email
//         run: |
//           node << 'EOF'
//           const fs = require('fs');
//           const path = require('path');
//           const dir = 'suite-results';
//           let totalPass = 0, totalFail = 0, rows = '';

//           const files = fs.readdirSync(dir).filter(f => f.endsWith('.txt'));
//           for (const file of files) {
//             const suite = file.replace('suite-result-', '').replace('.txt', '');
//             const lines = fs.readFileSync(path.join(dir, file), 'utf8').trim().split('\n');
//             for (const line of lines) {
//               const [siteName, passed, failed, remark] = line.split('|');
//               const p = parseInt(passed) || 0;
//               const f = parseInt(failed) || 0;
//               totalPass += p;
//               totalFail += f;
//               const color = f > 0 ? '#ffcccc' : '#ccffcc';
//               rows += `<tr style="background:${color}"><td>${siteName}</td><td>${suite}</td><td>${p}</td><td>${f}</td><td>${remark}</td></tr>`;
//             }
//           }

//           const runUrl = `https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}`;
//           const overall = totalFail === 0 ? '✅ All Tests Passed' : `❌ ${totalFail} Test(s) Failed`;

//           const body = `
//           <h2>Playwright Test Report - Run #${{ github.run_number }}</h2>
//           <p><b>Branch:</b> ${{ github.ref_name }} &nbsp;|&nbsp; <b>Status:</b> ${overall} &nbsp;|&nbsp; <a href="${runUrl}">View Full Report</a></p>
//           <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
//             <thead style="background:#333;color:#fff;">
//               <tr>
//                 <th>Site Name</th>
//                 <th>Suite</th>
//                 <th>Test Cases Passed</th>
//                 <th>Test Cases Failed</th>
//                 <th>Remark</th>
//               </tr>
//             </thead>
//             <tbody>${rows}</tbody>
//             <tfoot>
//               <tr style="background:#eee;font-weight:bold;">
//                 <td colspan="2">Total</td>
//                 <td>${totalPass}</td>
//                 <td>${totalFail}</td>
//                 <td>${totalFail === 0 ? 'All Pass' : totalFail + ' failure(s)'}</td>
//               </tr>
//             </tfoot>
//           </table>`;

//           let out = `body<<EOF\n${body}\nEOF\n`;
//           fs.appendFileSync(process.env.GITHUB_OUTPUT, out);
//           EOF

//       - name: Send email
//         uses: dawidd6/action-send-mail@v3
//         with:
//           server_address: smtp.gmail.com
//           server_port: 465
//           username: ${{ secrets.MAIL_USERNAME }}
//           password: ${{ secrets.MAIL_PASSWORD }}
//           subject: "Playwright Test Report - Run #${{ github.run_number }} | ${{ github.ref_name }}"
//           to: ${{ secrets.MAIL_RECIPIENTS }}
//           from: ${{ secrets.MAIL_USERNAME }}
//           html_body: ${{ steps.build_email.outputs.body }}
