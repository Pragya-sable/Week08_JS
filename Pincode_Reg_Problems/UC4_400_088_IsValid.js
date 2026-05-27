function validatePinCode(pin) {
  const pinPattern = /^\d{3} ?\d{3}$/;
  return pinPattern.test(pin);
}

// Test cases
console.log(validatePinCode("400088"));
console.log(validatePinCode("400 088"));
console.log(validatePinCode("A400088"));
console.log(validatePinCode("400088B"));
console.log(validatePinCode("400 08A"));

// ...existing code...
// // Click Contact Us section/accordion if form is hidden behind it (TWH sites)
// const clickContactUsSection = async (page) => {
//   const formSelector =
//     '#contactUs-inquiryType, select[name="inquiryType"], input#email, textarea#comments';

//   const isFormVisible = () =>
//     page
//       .locator(formSelector)
//       .first()
//       .isVisible({ timeout: 2000 })
//       .catch(() => false);

//   if (await isFormVisible()) return;

//   // Scroll to middle of page to reveal lazy-loaded content, then back to top
//   await page.evaluate(() => window.scrollBy(0, 600));
//   await page.waitForTimeout(600);
//   await page.evaluate(() => window.scrollTo(0, 0));
//   await page.waitForTimeout(400);

//   if (await isFormVisible()) return;

//   const contactKeywords =
//     /consumer support|consumer service|consumer help|consumer assistance|customer support|customer service|contact us online|write to us|send us a message|get in touch|contact form|email us|send a message|online contact/i;

//   // Use JS to find and click the correct element — avoids Playwright selector mismatch
//   // This handles custom dropdowns (like Ben & Jerry's) that are NOT standard Bootstrap
//   const clicked = await page.evaluate((regex) => {
//     // Walk all visible elements, find one whose trimmed text matches contact keywords
//     const candidates = Array.from(
//       document.querySelectorAll(
//         'button, summary, [role="button"], [role="tab"], li, dt, .accordion-header, .accordion-title, .panel-title, .faq-question, [class*="accordion"], [class*="collapse-trigger"], [class*="dropdown-toggle"], [class*="section-header"]'
//       )
//     );

//     for (const el of candidates) {
//       const text = (el.innerText || el.textContent || "").trim();
//       if (!new RegExp(regex).test(text)) continue;

//       const style = window.getComputedStyle(el);
//       if (style.display === "none" || style.visibility === "hidden") continue;

//       // Scroll into view first
//       el.scrollIntoView({ behavior: "instant", block: "center" });

//       // Try clicking the element itself, or its closest interactive ancestor
//       const clickTarget =
//         el.closest('button, summary, [role="button"], [role="tab"], a, li') ||
//         el;
//       clickTarget.click();
//       return true;
//     }
//     return false;
//   }, contactKeywords.source);

//   if (clicked) {
//     await page.waitForTimeout(800);
//     if (await isFormVisible()) return;
//   }

//   // Fallback: try Playwright locator with exact text match for common labels
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
//       const el = page
//         .locator(`text=${label}`)
//         .first();
//       if (!(await el.isVisible({ timeout: 1500 }).catch(() => false))) continue;

//       await el.scrollIntoViewIfNeeded();
//       await el.click({ force: true });
//       await page.waitForTimeout(800);

//       if (await isFormVisible()) return;
//     } catch (e) {
//       // try next label
//     }
//   }
// };

// const waitForForm = async (page) => {
//   const formSelector =
//     '#contactUs-inquiryType, select[name="inquiryType"], input#email, textarea#comments';

//   await page.waitForLoadState("domcontentloaded");
//   await dismissCookieBanner(page);
//   await clickContactUsSection(page);

//   // Final wait — form must be visible now
//   await page
//     .locator(formSelector)
//     .first()
//     .waitFor({ state: "visible", timeout: 15000 });
// };
