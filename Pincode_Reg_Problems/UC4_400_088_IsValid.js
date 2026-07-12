const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function sendToSalesforce() {
  // Step 1: Report file check
  const reportPath = path.join(__dirname, "custom-report.html");
  if (!fs.existsSync(reportPath)) {
    console.error("[ERROR] custom-report.html not found at:", reportPath);
    process.exit(1);
  }
  const htmlContent = fs.readFileSync(reportPath, "utf-8");
  console.log(
    "[INFO] custom-report.html found, size:",
    htmlContent.length,
    "chars"
  );

  // Step 2: Salesforce login
  console.log("[INFO] Attempting Salesforce login...");
  let access_token, instance_url;
  try {
    const loginResponse = await axios.post(
      `${process.env.SF_INSTANCE_URL}/services/oauth2/token`,
      null,
      {
        params: {
          grant_type: "client_credentials",
          client_id: process.env.SF_CLIENT_ID,
          client_secret: process.env.SF_CLIENT_SECRET,
        },
      }
    );
    ({ access_token, instance_url } = loginResponse.data);
    console.log(
      "[INFO] Salesforce login successful, instance_url:",
      instance_url
    );
  } catch (err) {
    console.error(
      "[ERROR] Salesforce login failed:",
      err.response?.data || err.message
    );
    process.exit(1);
  }

  // Step 3: Send email via Apex
  const endpointUrl = `${instance_url}/services/apexrest/sendPlaywrightReport/`;
  console.log("[INFO] Calling Apex endpoint:", endpointUrl);
  try {
    const emailResponse = await axios.post(
      endpointUrl,
      {
        subject: "Playwright Automation Status: 600 Sites Monitored",
        htmlBody: htmlContent,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "[INFO] Email sent successfully. Salesforce response:",
      emailResponse.data
    );
  } catch (err) {
    console.error(
      "[ERROR] Apex endpoint call failed:",
      err.response?.data || err.message
    );
    process.exit(1);
  }
}

sendToSalesforce().catch((err) => {
  console.error("[ERROR] Unexpected error:", err.message);
  process.exit(1);
});
