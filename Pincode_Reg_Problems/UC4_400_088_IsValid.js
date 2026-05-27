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

// Click Contact Us section/accordion if form is hidden behind it (TWH sites)
// const clickContactUsSection = async (page) => {
//   const formSelector =
//     '#contactUs-inquiryType, select[name="inquiryType"], input#email, textarea#comments';

//   const isFormVisible = () =>
//     page
//       .locator(formSelector)
//       .first()
//       .isVisible({ timeout: 3000 })
//       .catch(() => false);

//   if (await isFormVisible()) return;

//   // Scroll gradually to trigger lazy-loaded accordions
//   for (let i = 0; i < 3; i++) {
//     await page.evaluate(() => window.scrollBy(0, 400));
//     await page.waitForTimeout(500);
//   }
//   await page.evaluate(() => window.scrollTo(0, 0));
//   await page.waitForTimeout(400);

//   if (await isFormVisible()) return;

//   const contactKeywords =
//     /consumer support|consumer service|consumer help|consumer assistance|customer support|customer service|contact us online|contact us|write to us|send us a message|get in touch|contact form|email us|send a message|online contact/i;

//   // Strategy 1: Click collapsed accordion buttons/triggers matching contact keywords
//   const collapsedTriggers = page.locator(
//     'button[aria-expanded="false"], [data-bs-toggle="collapse"][aria-expanded="false"], summary'
//   );
//   const count = await collapsedTriggers.count().catch(() => 0);

//   for (let i = 0; i < count; i++) {
//     try {
//       const el = collapsedTriggers.nth(i);
//       const text = await el.innerText().catch(() => "");
//       if (!contactKeywords.test(text)) continue;

//       await safeScrollIntoView(page, el);
//       await el.click({ force: true });
//       await page.waitForTimeout(800);

//       if (await isFormVisible()) return;
//     } catch (e) {
//       // try next
//     }
//   }

//   // Strategy 2: Broader search — any visible clickable element with contact keywords
//   const candidates = page.locator(
//     'button, summary, [role="button"], a, .accordion-button, [data-bs-toggle]'
//   );
//   const total = await candidates.count().catch(() => 0);

//   for (let i = 0; i < total; i++) {
//     try {
//       const el = candidates.nth(i);
//       const text = await el.innerText().catch(() => "");
//       if (!contactKeywords.test(text)) continue;
//       if (!(await el.isVisible({ timeout: 1000 }).catch(() => false))) continue;

//       await safeScrollIntoView(page, el);
//       // Use evaluate click to ensure Bootstrap collapse event fires
//       const handle = await el.elementHandle();
//       if (handle) {
//         await page
//           .evaluate((n) => {
//             const btn = n.closest(
//               'button, summary, [role="button"], a, .accordion-button'
//             );
//             (btn || n).click();
//           }, handle)
//           .catch(() => {});
//       } else {
//         await el.click({ force: true }).catch(() => {});
//       }

//       await page.waitForTimeout(800);
//       if (await isFormVisible()) return;
//     } catch (e) {
//       // try next
//     }
//   }

//   // Strategy 3: Fallback — click all collapsed accordion buttons (max 5)
//   await page
//     .evaluate(() => {
//       const btns = Array.from(
//         document.querySelectorAll(
//           '.accordion-button.collapsed, [data-bs-toggle="collapse"].collapsed'
//         )
//       );
//       btns.slice(0, 5).forEach((b) => {
//         try {
//           b.click();
//         } catch (e) {}
//       });
//     })
//     .catch(() => {});

//   await page.waitForTimeout(1000);
// };
