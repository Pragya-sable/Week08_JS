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

// const { test, expect } = require("@playwright/test");
// const { contactUsTWHUrls } = require("../config/urls");

// // CEC sites:  #contactUs-inquiryType / #contactUs-inquirySubj / #contact-legalAgeConfirmation
// // TWH sites (Ben & Jerry's etc): #inquiryType / #inquirySubject / input[name="legalAgeConfirmation"]
// const formSelector =
//   '#contactUs-inquiryType, #inquiryType, select[name="enquiryType"], input#email, textarea#comments';

// const resolveSelectors = async (page) => {
//   const isCEC = (await page.locator("#contactUs-inquiryType").count()) > 0;
//   return {
//     inquiryType: isCEC ? "#contactUs-inquiryType" : "#inquiryType",
//     inquirySubj: isCEC ? "#contactUs-inquirySubj" : "#inquirySubject",
//     ageCheckbox: isCEC
//       ? "#contact-legalAgeConfirmation"
//       : "input[name='legalAgeConfirmation']",
//   };
// };

// // Click age checkbox — handles cases where checkbox has no id/label[for]
// const clickAgeCheckbox = async (page, ageSel) => {
//   const checkbox = page.locator(ageSel);
//   const isChecked = await checkbox.isChecked().catch(() => false);
//   if (isChecked) return;

//   await page.evaluate((sel) => {
//     const cb = document.querySelector(sel);
//     if (!cb) return;
//     // Ben & Jerry's: checkbox is inside SPAN.fw-fieldset-label — click the span
//     const clickTarget =
//       cb.closest("label") ||
//       cb.closest(".fw-fieldset-label") ||
//       cb.parentElement;
//     clickTarget.scrollIntoView({ behavior: "instant", block: "center" });
//     clickTarget.click();
//   }, ageSel);
// };

// // Dismiss OneTrust cookie banner if visible
// const dismissCookieBanner = async (page) => {
//   try {
//     await page.waitForSelector("#onetrust-accept-btn-handler", {
//       timeout: 10000,
//     });
//     await page.locator("#onetrust-accept-btn-handler").scrollIntoViewIfNeeded();
//     await page.locator("#onetrust-accept-btn-handler").click({ force: true });
//     await page
//       .locator("#onetrust-accept-btn-handler")
//       .waitFor({ state: "hidden", timeout: 5000 });
//   } catch (e) {
//     // Ignore if not present
//   }

//   const dismissSelectors = [
//     'text="No, gracias"',
//     'text="No Thanks"',
//     "text=/no.*thanks/i",
//     "text=/aceptar todas las cookies/i",
//     "text=/accept all/i",
//     "text=/reject all/i",
//     ".modal-close",
//     ".e_ghostery-background button",
//   ];

//   for (const selector of dismissSelectors) {
//     try {
//       const el = page.locator(selector).first();
//       if (await el.isVisible({ timeout: 2000 })) {
//         await el.scrollIntoViewIfNeeded();
//         await el.click({ force: true });
//         await page.waitForTimeout(500);
//         break;
//       }
//     } catch (e) {
//       // Continue to next selector
//     }
//   }
// };

// // Click Consumer Support accordion button to reveal the contact form
// const clickContactUsSection = async (page) => {
//   const isFormVisible = () =>
//     page
//       .locator(formSelector)
//       .first()
//       .isVisible({ timeout: 2000 })
//       .catch(() => false);

//   if (await isFormVisible()) return;

//   // Scroll down to trigger lazy-loaded content, then back to top
//   await page.evaluate(() => window.scrollBy(0, 600));
//   await page.waitForTimeout(500);
//   await page.evaluate(() => window.scrollTo(0, 0));
//   await page.waitForTimeout(300);

//   if (await isFormVisible()) return;

//   // Use native JS click on accordion buttons only — avoids wrong element match
//   const clicked = await page.evaluate(() => {
//     const keywords =
//       /consumer support|consumer service|consumer help|consumer assistance|customer support|customer service|contact us online|write to us|send us a message|get in touch|contact form|email us|send a message|online contact/i;

//     const buttons = Array.from(
//       document.querySelectorAll(
//         'button.accordion-button, button[data-bs-toggle="collapse"], button[data-toggle="collapse"], summary, button[aria-expanded]'
//       )
//     );

//     for (const btn of buttons) {
//       const ownText =
//         Array.from(btn.childNodes)
//           .filter((n) => n.nodeType === Node.TEXT_NODE)
//           .map((n) => n.textContent)
//           .join(" ")
//           .trim() || btn.innerText.trim();

//       if (!keywords.test(ownText)) continue;

//       const style = window.getComputedStyle(btn);
//       if (style.display === "none" || style.visibility === "hidden") continue;

//       btn.scrollIntoView({ behavior: "instant", block: "center" });
//       btn.click();
//       return true;
//     }
//     return false;
//   });

//   if (clicked) {
//     await page.waitForTimeout(900);
//     if (await isFormVisible()) return;
//   }

//   // Fallback: Playwright button locator with label text
//   const labels = [
//     "Consumer Support",
//     "Consumer Service",
//     "Consumer Help",
//     "Customer Support",
//     "Write To Us",
//     "Contact Us Online",
//     "Send Us A Message",
//     "Get In Touch",
//   ];

//   for (const label of labels) {
//     try {
//       const btn = page.locator("button").filter({ hasText: label }).first();
//       if (!(await btn.isVisible({ timeout: 1500 }).catch(() => false))) continue;
//       await btn.scrollIntoViewIfNeeded();
//       await btn.click({ force: true });
//       await page.waitForTimeout(900);
//       if (await isFormVisible()) return;
//     } catch (e) {
//       // try next
//     }
//   }
// };

// const waitForForm = async (page) => {
//   await page.waitForLoadState("domcontentloaded");
//   await dismissCookieBanner(page);
//   await clickContactUsSection(page);
//   await page
//     .locator(formSelector)
//     .first()
//     .waitFor({ state: "visible", timeout: 15000 });
// };

// const clickSubmit = async (page) => {
//   const submitBtn = page.locator("#submitButton");
//   if (await submitBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
//     await safeScrollIntoView(page, submitBtn);
//     await submitBtn.click({ force: true });
//   } else {
//     const fallback = page.locator('button[type="submit"]').last();
//     await safeScrollIntoView(page, fallback);
//     await fallback.click({ force: true });
//   }
// };

// const safeScrollIntoView = async (page, locator) => {
//   try {
//     const element = await locator.elementHandle();
//     if (!element) return;
//     await page.evaluate((el) => {
//       const topBars = Array.from(document.querySelectorAll("*")).filter(
//         (node) => {
//           const style = window.getComputedStyle(node);
//           if (
//             !node.isConnected ||
//             style.display === "none" ||
//             style.visibility === "hidden" ||
//             style.opacity === "0"
//           )
//             return false;
//           if (style.position !== "fixed" && style.position !== "sticky")
//             return false;
//           const rect = node.getBoundingClientRect();
//           return rect.width > 0 && rect.height > 0 && rect.top <= 10;
//         }
//       );
//       const offset =
//         topBars.reduce(
//           (max, bar) => Math.max(max, bar.getBoundingClientRect().bottom),
//           0
//         ) + 32;
//       const rect = el.getBoundingClientRect();
//       window.scrollTo({
//         top: window.scrollY + rect.top - offset,
//         left: 0,
//         behavior: "instant",
//       });
//     }, element);

//     await page.waitForTimeout(300);
//     const isCovered = await page.evaluate((el) => {
//       const rect = el.getBoundingClientRect();
//       const topElement = document.elementFromPoint(
//         rect.left + rect.width / 2,
//         rect.top + rect.height / 2
//       );
//       return topElement ? !el.contains(topElement) && topElement !== el : false;
//     }, element);

//     if (isCovered) {
//       await page.evaluate(() => window.scrollBy(0, 80));
//       await page.waitForTimeout(200);
//     }
//   } catch (e) {
//     // Ignore scroll issues
//   }
// };

// const getLocalPhoneNumberForCountry = (url) => {
//   const localPhoneNumbers = {
//     "/us/": "4555532342",
//     "/ca/": "9876567895",
//     "/ch/": "791234567",
//     "/mx/": "3456234567",
//     "/br/": "11987654321",
//     "/ar/": "8746327394",
//     "/cl/": "912345678",
//     "/co/": "3001234567",
//     "/uy/": "99123456",
//     "/es/": "612345678",
//     "/fr/": "700500333",
//     "/de/": "15112345678",
//     "/dach/": "301234567",
//     "/at/": "876543256799",
//     "/uk/": "2071234567",
//     "/ie/": "9876543218",
//     "/nl/": "454643277",
//     "/be/": "478123456",
//     "/fi/": "401234567",
//     ".fi/": "401234567",
//     "/no/": "21234567",
//     "/dk/": "21234567",
//     "/se/": "701234567",
//     "/pl/": "123456789",
//     "/gr/": "2101234567",
//     "/it/": "3654789145",
//     "/pt/": "212345678",
//     "/tr/": "2123456789",
//     "/ua/": "441234567",
//     "/ru/": "9991234567",
//     "/in/": "9343292449",
//     "/id/": "87654432111",
//     "/ph/": "99983745824",
//     "/bd/": "1712345678",
//     "/vn/": "999888877",
//     "/th/": "212345678",
//     "/pk/": "2345678900",
//   };

//   for (const [code, phone] of Object.entries(localPhoneNumbers)) {
//     if (url.includes(code)) return phone;
//   }
// };

// const fillAndSubmitForm = async (
//   page,
//   {
//     inquiryType = "Question",
//     subject = "Business",
//     checkAge = true,
//     submit = false,
//     partialFill = false,
//     url = "",
//   } = {}
// ) => {
//   await dismissCookieBanner(page);
//   const { inquiryType: itSel, inquirySubj: isSel, ageCheckbox: ageSel } =
//     await resolveSelectors(page);

//   const inquiryTypeLocator = page.locator(itSel);
//   await safeScrollIntoView(page, inquiryTypeLocator);
//   await page.selectOption(itSel, inquiryType);
//   await page.waitForSelector(isSel, { state: "visible" });
//   const inquirySubjLocator = page.locator(isSel);
//   await safeScrollIntoView(page, inquirySubjLocator);
//   await page.selectOption(isSel, subject);

//   if (!partialFill) {
//     const givenName = page.locator("#givenName");
//     await safeScrollIntoView(page, givenName);
//     await givenName.fill("Test");

//     const familyName = page.locator("#familyName");
//     await safeScrollIntoView(page, familyName);
//     await familyName.fill("User");

//     const emailInput = page.locator("#email");
//     await safeScrollIntoView(page, emailInput);
//     await emailInput.fill("test@example.com");

//     // Phone: try #phoneContainer inputs first, then name="phone"
//     const phoneInputs = page.locator("#phoneContainer input");
//     const inputsCount = await phoneInputs.count().catch(() => 0);
//     let phoneTarget =
//       inputsCount > 1
//         ? phoneInputs.nth(inputsCount - 1)
//         : inputsCount === 1
//         ? phoneInputs.first()
//         : page.locator("input[name='phone']");

//     if (await phoneTarget.isVisible({ timeout: 2000 }).catch(() => false)) {
//       await safeScrollIntoView(page, phoneTarget);
//       const localPhone = getLocalPhoneNumberForCountry(url);
//       if (localPhone) await phoneTarget.fill(localPhone);
//     }

//     const comments = page.locator("#comments");
//     await safeScrollIntoView(page, comments);
//     await comments.fill("This is a test message");

//     if (checkAge) {
//       const ageCheckbox = page.locator(ageSel);
//       const exists = await ageCheckbox
//         .waitFor({ state: "attached", timeout: 5000 })
//         .then(() => true)
//         .catch(() => false);

//       if (exists) {
//         await clickAgeCheckbox(page, ageSel);
//         await expect(ageCheckbox).toBeChecked();
//       }
//     }
//   }

//   if (submit) await clickSubmit(page);
// };

// const clickLinkInNewTab = async (page, selector) => {
//   const link = page.locator(selector).first();
//   const found = await link
//     .waitFor({ state: "attached", timeout: 10000 })
//     .then(() => true)
//     .catch(() => false);
//   if (!found) return null;
//   await dismissCookieBanner(page);
//   await safeScrollIntoView(page, link);
//   await page.waitForTimeout(500);

//   const target = await link.getAttribute("target");
//   if (target === "_blank") {
//     const [newTab] = await Promise.all([
//       page.waitForEvent("popup"),
//       link.click(),
//     ]);
//     try {
//       await newTab.waitForLoadState("load", { timeout: 15000 });
//     } catch (e) {}
//     return newTab;
//   } else {
//     await link.click();
//     try {
//       await page.waitForLoadState("load", { timeout: 15000 });
//     } catch (e) {}
//     return page;
//   }
// };

// test.beforeEach(async ({ page }) => {
//   page.on("dialog", async (dialog) => {
//     console.log(`Dialog detected: ${dialog.type()} - ${dialog.message()}`);
//     await dialog.dismiss();
//   });
//   await dismissCookieBanner(page);
// });

// for (const { name, url } of contactUsTWHUrls) {
//   test(`${name} - Required field validation on empty submit`, async ({
//     page,
//   }) => {
//     await page.goto(url, { timeout: 60000 });
//     await dismissCookieBanner(page);
//     await waitForForm(page);
//     await fillAndSubmitForm(page, { partialFill: true, submit: true, url });

//     await expect(page.locator("#givenName")).toHaveAttribute(
//       "aria-required",
//       "true"
//     );
//     await expect(page.locator("#email")).toHaveAttribute(
//       "aria-required",
//       "true"
//     );
//     await expect(page.locator("#comments")).toHaveAttribute(
//       "aria-required",
//       "true"
//     );
//   });

//   test(`${name} - Invalid email format retained after submit`, async ({
//     page,
//   }) => {
//     await page.goto(url, { timeout: 60000 });
//     await dismissCookieBanner(page);
//     await waitForForm(page);
//     await fillAndSubmitForm(page, { partialFill: true, url });
//     await page.locator("#email").fill("invalidemail");
//     await clickSubmit(page);

//     await expect(page.locator("#email")).not.toHaveValue("");
//   });

//   test(`${name} - Form does not submit without age confirmation`, async ({
//     page,
//   }) => {
//     await page.goto(url, { timeout: 60000 });
//     await dismissCookieBanner(page);
//     await waitForForm(page);

//     const { ageCheckbox: ageSel } = await resolveSelectors(page);
//     const ageCheckbox = page.locator(ageSel);
//     const exists = await ageCheckbox
//       .waitFor({ state: "attached", timeout: 5000 })
//       .then(() => true)
//       .catch(() => false);

//     if (!exists) {
//       console.log(`${name} - Age confirmation checkbox not present, skipping`);
//       return;
//     }

//     // Fill form WITHOUT checking age, then submit
//     await fillAndSubmitForm(page, { checkAge: false, submit: true, url });
//     await expect(ageCheckbox).not.toBeChecked();
//   });

//   test(`${name} - Form resets on page reload`, async ({ page }) => {
//     await page.goto(url, { timeout: 60000 });
//     await dismissCookieBanner(page);
//     await waitForForm(page);
//     const { inquiryType: itSel } = await resolveSelectors(page);
//     await page.selectOption(itSel, "Question");
//     await page.reload();
//     await waitForForm(page);
//     await expect(page.locator(itSel)).toHaveValue("DEFAULT");
//   });

//   test(`${name} - Successful form submission shows confirmation`, async ({
//     page,
//   }) => {
//     await page.goto(url, { timeout: 60000 });
//     await dismissCookieBanner(page);

//     await page.route("**/*", async (route) => {
//       if (route.request().method() === "POST") {
//         await route.fulfill({
//           status: 200,
//           contentType: "application/json",
//           body: JSON.stringify({ status: "success" }),
//         });
//       } else {
//         await route.continue();
//       }
//     });

//     await waitForForm(page);
//     await fillAndSubmitForm(page, { submit: true, url });
//     await dismissCookieBanner(page);

//     const confirmBtn = page.locator("#confirmButton");
//     if (await confirmBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
//       await confirmBtn.click({ force: true });
//     }

//     const successMsg = page.locator("#successMsg");
//     if (await successMsg.isVisible({ timeout: 10000 }).catch(() => false)) {
//       await expect(successMsg).toBeVisible({ timeout: 30000 });
//     } else {
//       const fallbackSuccess = page.locator(
//         "text=/thank you|merci|gracias|we have received|submission received/i"
//       );
//       await expect(fallbackSuccess).toBeVisible({ timeout: 30000 });
//     }
//   });

//   test(`${name} - Legal notice link opens in new tab`, async ({ page }) => {
//     await page.goto(url, { timeout: 60000 });
//     await dismissCookieBanner(page);
//     await waitForForm(page);
//     await fillAndSubmitForm(page, { url });

//     const tab = await clickLinkInNewTab(page, 'a[href*="legal"], a[href*="notice"], a.optInLinks[href*="legal"]');
//     if (!tab) {
//       test.info().annotations.push({
//         type: "info",
//         description: "Legal link not found in form",
//       });
//       return;
//     }
//     await expect(tab).toHaveURL(/legal|privacy|unilever|notices/i);
//     if (tab !== page) await tab.close();
//   });

//   test(`${name} - Privacy notice link opens in new tab`, async ({ page }) => {
//     await page.goto(url, { timeout: 60000 });
//     await dismissCookieBanner(page);
//     await waitForForm(page);
//     await fillAndSubmitForm(page, { url });

//     const tab = await clickLinkInNewTab(page, 'a[href*="privacy"], a.optInLinks[href*="privacy"]');
//     if (!tab) {
//       test.info().annotations.push({
//         type: "info",
//         description: "Privacy link not found in form",
//       });
//       return;
//     }
//     await expect(tab).toHaveURL(/privacy|unilever|notices/i);
//     if (tab !== page) await tab.close();
//   });
// }
