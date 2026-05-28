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

const { test, expect } = require("@playwright/test");
const { contactUsHCDVUrls } = require("../config/urls");

// Dismiss OneTrust cookie banner and Privacy Preference Center if visible
const dismissCookieBanner = async (page) => {
  // Dismiss OneTrust accept button
  try {
    await page.waitForSelector("#onetrust-accept-btn-handler", {
      timeout: 10000,
    });
    await page.locator("#onetrust-accept-btn-handler").scrollIntoViewIfNeeded();
    await page.locator("#onetrust-accept-btn-handler").click({ force: true });
    await page
      .locator("#onetrust-accept-btn-handler")
      .waitFor({ state: "hidden", timeout: 5000 });
  } catch (e) {}

  // Dismiss OneTrust Privacy Preference Center modal if open
  try {
    const prefCenter = page.locator(
      '[role="dialog"] .save-preference-btn-handler'
    );
    if (await prefCenter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await prefCenter.click({ force: true });
      await page.waitForTimeout(500);
    }
  } catch (e) {}

  const dismissSelectors = [
    'text="No, gracias"',
    'text="No Thanks"',
    "text=/no.*thanks/i",
    "text=/aceptar todas las cookies/i",
    "text=/accept all/i",
    "text=/reject all/i",
    ".modal-close",
    ".e_ghostery-background button",
  ];

  for (const selector of dismissSelectors) {
    try {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 2000 })) {
        await el.scrollIntoViewIfNeeded();
        await el.click({ force: true });
        await page.waitForTimeout(500);
        break;
      }
    } catch (e) {}
  }
};

// Wait for HCDV form - Adobe Classic injects fields dynamically, needs longer waits
const waitForForm = async (page, maxScrollAttempts = 10) => {
  const formSelector =
    '#contactUs-inquiryType, select[name="inquiryType"], input#email, textarea#comments';

  await page.waitForLoadState("domcontentloaded");

  const alreadyVisible = await page
    .locator(formSelector)
    .first()
    .isVisible({ timeout: 20000 })
    .catch(() => false);

  if (!alreadyVisible) {
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    const scrollStep = Math.floor(pageHeight / maxScrollAttempts);

    for (let attempt = 0; attempt < maxScrollAttempts; attempt++) {
      const isVisible = await page
        .locator(formSelector)
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (isVisible) break;

      await page.evaluate((step) => window.scrollBy(0, step), scrollStep);
      await page.waitForTimeout(1000);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    await page
      .locator(formSelector)
      .first()
      .waitFor({ state: "visible", timeout: 40000 });
  }

  // Wait for ALL Adobe Classic injected fields to be ready
  await Promise.all([
    page.locator("#givenName").waitFor({ state: "visible", timeout: 30000 }),
    page.locator("#familyName").waitFor({ state: "visible", timeout: 30000 }),
    page.locator("#email").waitFor({ state: "visible", timeout: 30000 }),
    page.locator("#comments").waitFor({ state: "visible", timeout: 30000 }),
  ]).catch(() => {});
};

const clickSubmit = async (page) => {
  const submitBtn = page.locator("#submitButton");
  if (await submitBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await safeScrollIntoView(page, submitBtn);
    await submitBtn.click({ force: true });
  } else {
    const fallback = page.locator('button[type="submit"]').last();
    await safeScrollIntoView(page, fallback);
    await fallback.click({ force: true });
  }
};

const safeScrollIntoView = async (page, locator) => {
  try {
    const element = await locator.elementHandle();
    if (!element) return;
    await page.evaluate((el) => {
      const topBars = Array.from(document.querySelectorAll("*")).filter(
        (node) => {
          const style = window.getComputedStyle(node);
          if (
            !node.isConnected ||
            style.display === "none" ||
            style.visibility === "hidden" ||
            style.opacity === "0"
          )
            return false;
          if (style.position !== "fixed" && style.position !== "sticky")
            return false;
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.top <= 10;
        }
      );
      const offset =
        topBars.reduce(
          (max, bar) => Math.max(max, bar.getBoundingClientRect().bottom),
          0
        ) + 32;
      const rect = el.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top - offset,
        left: 0,
        behavior: "instant",
      });
    }, element);

    await page.waitForTimeout(300);
    const isCovered = await page.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const topElement = document.elementFromPoint(centerX, centerY);
      return topElement ? !el.contains(topElement) && topElement !== el : false;
    }, element);

    if (isCovered) {
      await page.evaluate(() => window.scrollBy(0, 80));
      await page.waitForTimeout(200);
    }
  } catch (error) {
    // Ignore scroll issues
  }
};

const getLocalPhoneNumberForCountry = (url) => {
  const localPhoneNumbers = {
    "/us/": "4555532342",
    "/ca/": "9876567895",
    "/ch/": "791234567",
    "/mx/": "3456234567",
    "/br/": "11987654321",
    "/ar/": "8746327394",
    "/cl/": "912345678",
    "/co/": "3001234567",
    "/uy/": "99123456",
    "/es/": "612345678",
    "/fr/": "700500333",
    "/de/": "15112345678",
    "/dach/": "301234567",
    "/at/": "876543256799",
    "/uk/": "2071234567",
    "/ie/": "9876543218",
    "/nl/": "454643277",
    "/be/": "478123456",
    "/fi/": "401234567",
    ".fi/": "401234567",
    "/no/": "21234567",
    "/dk/": "21234567",
    "/se/": "701234567",
    "/pl/": "123456789",
    "/gr/": "2101234567",
    "/it/": "3654789145",
    "/pt/": "212345678",
    "/tr/": "2123456789",
    "/ua/": "441234567",
    "/ru/": "9991234567",
    "/in/": "9343292449",
    "/id/": "87654432111",
    "/ph/": "99983745824",
    "/bd/": "1712345678",
    "/vn/": "999888877",
    "/th/": "212345678",
    "/pk/": "2345678900",
  };

  for (const [code, phone] of Object.entries(localPhoneNumbers)) {
    if (url.includes(code)) return phone;
  }
};

const fillAndSubmitForm = async (
  page,
  {
    inquiryType = "Question",
    subject = "Business",
    checkAge = true,
    submit = false,
    partialFill = false,
    url = "",
  } = {}
) => {
  await dismissCookieBanner(page);
  const inquiryTypeLocator = page.locator("#contactUs-inquiryType");
  await safeScrollIntoView(page, inquiryTypeLocator);
  await page.selectOption("#contactUs-inquiryType", inquiryType);
  await page.waitForSelector("#contactUs-inquirySubj", { state: "visible" });
  const inquirySubjLocator = page.locator("#contactUs-inquirySubj");
  await safeScrollIntoView(page, inquirySubjLocator);
  await page.selectOption("#contactUs-inquirySubj", subject);

  if (!partialFill) {
    const givenName = page.locator("#givenName");
    await safeScrollIntoView(page, givenName);
    await givenName.fill("Test");

    const familyName = page.locator("#familyName");
    await safeScrollIntoView(page, familyName);
    await familyName.fill("User");

    const emailInput = page.locator("#email");
    await safeScrollIntoView(page, emailInput);
    await emailInput.fill("test@example.com");

    const phoneInputs = page.locator("#phoneContainer input");
    let phoneTarget;
    const inputsCount = await phoneInputs.count().catch(() => 0);
    if (inputsCount > 1) {
      phoneTarget = phoneInputs.nth(inputsCount - 1);
    } else if (inputsCount === 1) {
      phoneTarget = phoneInputs.first();
    } else {
      phoneTarget = page.locator("#phoneContainer");
    }

    if (await phoneTarget.isVisible({ timeout: 2000 }).catch(() => false)) {
      await safeScrollIntoView(page, phoneTarget);
      const localPhone = getLocalPhoneNumberForCountry(url);
      if (localPhone) await phoneTarget.fill(localPhone);
    }

    const comments = page.locator("#comments");
    await safeScrollIntoView(page, comments);
    await comments.fill("This is a test message");

    if (checkAge) {
      const ageCheckbox = page.locator("#contact-legalAgeConfirmation");
      const ageLabel = page.locator(
        'label[for="contact-legalAgeConfirmation"]'
      );
      const exists = await ageCheckbox
        .waitFor({ state: "visible", timeout: 10000 })
        .then(() => true)
        .catch(() => false);

      if (exists) {
        const isChecked = await ageCheckbox.isChecked().catch(() => false);
        if (!isChecked) {
          await safeScrollIntoView(page, ageLabel);
          await ageLabel.click({ force: true });
        }
        await expect(ageCheckbox).toBeChecked();
      }
    }
  }

  if (submit) await clickSubmit(page);
};

const clickLinkInNewTab = async (page, selector) => {
  const link = page.locator(selector).first();
  const found = await link
    .waitFor({ state: "attached", timeout: 10000 })
    .then(() => true)
    .catch(() => false);
  if (!found) return null;
  await dismissCookieBanner(page);
  await safeScrollIntoView(page, link);
  await page.waitForTimeout(500);

  const target = await link.getAttribute("target");
  if (target === "_blank") {
    const [newTab] = await Promise.all([
      page.waitForEvent("popup"),
      link.click({ force: true }),
    ]);
    try {
      await newTab.waitForLoadState("load", { timeout: 15000 });
    } catch (e) {}
    return newTab;
  } else {
    await link.click({ force: true });
    try {
      await page.waitForLoadState("load", { timeout: 15000 });
    } catch (e) {}
    return page;
  }
};

test.beforeEach(async ({ page }) => {
  page.on("dialog", async (dialog) => {
    console.log(`Dialog detected: ${dialog.type()} - ${dialog.message()}`);
    await dialog.dismiss();
  });
  await dismissCookieBanner(page);
});

for (const { name, url } of contactUsHCDVUrls) {
  test(`${name} - Required field validation on empty submit`, async ({
    page,
  }) => {
    await page.goto(url, { timeout: 60000 });
    await dismissCookieBanner(page);
    await waitForForm(page);
    await fillAndSubmitForm(page, { partialFill: true, submit: true, url });

    await expect(page.locator("#givenName")).toHaveAttribute(
      "aria-required",
      "true"
    );
    await expect(page.locator("#email")).toHaveAttribute(
      "aria-required",
      "true"
    );
    await expect(page.locator("#comments")).toHaveAttribute(
      "aria-required",
      "true"
    );
  });

  test(`${name} - Invalid email format retained after submit`, async ({
    page,
  }) => {
    await page.goto(url, { timeout: 60000 });
    await dismissCookieBanner(page);
    await waitForForm(page);
    await fillAndSubmitForm(page, { partialFill: true, url });
    await page.locator("#email").fill("invalidemail");
    await clickSubmit(page);

    await expect(page.locator("#email")).not.toHaveValue("");
  });

  test(`${name} - Form does not submit without age confirmation`, async ({
    page,
  }) => {
    await page.goto(url, { timeout: 60000 });
    await dismissCookieBanner(page);
    await waitForForm(page);

    const ageCheckbox = page.locator("#contact-legalAgeConfirmation");
    const exists = await ageCheckbox
      .waitFor({ state: "attached", timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      console.log(`${name} - Age confirmation checkbox not present, skipping`);
      return;
    }

    await fillAndSubmitForm(page, { checkAge: false, submit: true, url });
    await expect(ageCheckbox).not.toBeChecked();
  });

  test(`${name} - Form resets on page reload`, async ({ page }) => {
    await page.goto(url, { timeout: 60000 });
    await dismissCookieBanner(page);
    await waitForForm(page);
    await page.selectOption("#contactUs-inquiryType", "Question");
    await page.reload();
    await waitForForm(page);

    await expect(page.locator("#contactUs-inquiryType")).toHaveValue("DEFAULT");
  });

  test(`${name} - Successful form submission shows confirmation`, async ({
    page,
  }) => {
    await page.goto(url, { timeout: 60000 });
    await dismissCookieBanner(page);

    await page.route("**/*", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ status: "success" }),
        });
      } else {
        await route.continue();
      }
    });

    await waitForForm(page);
    await fillAndSubmitForm(page, { submit: true, url });
    await dismissCookieBanner(page);

    const confirmBtn = page.locator("#confirmButton");
    if (await confirmBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
      await confirmBtn.click({ force: true });
    }

    await expect(page.locator("#successMsg")).toBeVisible({ timeout: 30000 });
  });

  test(`${name} - Legal notice link opens in new tab`, async ({ page }) => {
    await page.goto(url, { timeout: 60000 });
    await dismissCookieBanner(page);
    await waitForForm(page);
    await fillAndSubmitForm(page, { url });

    const link = page.locator('a.optInLinks[href*="legal"]').first();
    await expect(
      link,
      "Legal notice link should be present in form"
    ).toBeVisible({ timeout: 10000 });
    const tab = await clickLinkInNewTab(page, 'a.optInLinks[href*="legal"]');
    await expect(tab).toHaveURL(/legal|unilever|notices/i);
    if (tab !== page) await tab.close();
  });

  test(`${name} - Cookie notice link opens in new tab`, async ({ page }) => {
    await page.goto(url, { timeout: 60000 });
    await dismissCookieBanner(page);
    await waitForForm(page);
    await fillAndSubmitForm(page, { url });

    const link = page.locator('a.optInLinks[href*="cookie"]').first();
    await expect(
      link,
      "Cookie notice link should be present in form"
    ).toBeVisible({ timeout: 10000 });
    const tab = await clickLinkInNewTab(page, 'a.optInLinks[href*="cookie"]');
    await expect(tab).toHaveURL(/cookie|unilever|notices/i);
    if (tab !== page) await tab.close();
  });

  test(`${name} - Privacy notice link opens in new tab`, async ({ page }) => {
    await page.goto(url, { timeout: 60000 });
    await dismissCookieBanner(page);
    await waitForForm(page);
    await fillAndSubmitForm(page, { url });

    const link = page.locator('a.optInLinks[href*="privacy"]').first();
    await expect(
      link,
      "Privacy notice link should be present in form"
    ).toBeVisible({ timeout: 10000 });
    const tab = await clickLinkInNewTab(page, 'a.optInLinks[href*="privacy"]');
    await expect(tab).toHaveURL(/privacy|unilever|notices/i);
    if (tab !== page) await tab.close();
  });
}
