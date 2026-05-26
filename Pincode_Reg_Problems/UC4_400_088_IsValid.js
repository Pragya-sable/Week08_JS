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
// const clickContactUsSection = async (page) => {
//   const formSelector =
//     '#contactUs-inquiryType, select[name="inquiryType"], input#email, textarea#comments';

//   // If form already visible, nothing to do
//   const formVisible = await page
//     .locator(formSelector)
//     .first()
//     .isVisible({ timeout: 2500 })
//     .catch(() => false);
//   if (formVisible) return;

//   const patterns = [
//     "consumer support",
//     "contact us online",
//     "consumer help",
//     "consumer service office",
//     "consumer service",
//     "consumer assistance",
//     "customer support",
//     "customer service",
//     "write to us",
//     "send us a message",
//     "get in touch",
//     "online contact",
//     "contact form",
//     "contact online",
//     "email us",
//     "send a message",
//   ];

//   // Try role-based first, then robust locator hits, then JS fallbacks
//   for (const pattern of patterns) {
//     const re = new RegExp(pattern, "i");

//     try {
//       // 1) Accessible button by role + name
//       const roleBtn = page.getByRole("button", { name: re }).first();
//       if ((await roleBtn.count().catch(() => 0)) > 0 && (await roleBtn.isVisible({ timeout: 1200 }).catch(() => false))) {
//         await safeScrollIntoView(page, roleBtn);
//         await roleBtn.click({ force: true }).catch(() => {});
//         await page.waitForTimeout(600);
//         if (await page.locator(formSelector).first().isVisible({ timeout: 4000 }).catch(() => false)) return;
//       }

//       // 2) Candidate elements (button/summary/a/[role=button]/.accordion-button)
//       const candidates = page.locator('button, summary, [role="button"], a, .accordion-button').filter({ hasText: re });
//       const count = await candidates.count().catch(() => 0);
//       for (let i = 0; i < count; i++) {
//         const el = candidates.nth(i);
//         if (!(await el.isVisible({ timeout: 1200 }).catch(() => false))) continue;
//         await safeScrollIntoView(page, el);
//         await page.waitForTimeout(250);

//         // Click closest clickable ancestor via JS (more reliable for nested text nodes)
//         const clicked = await el.elementHandle().then(async (h) => {
//           if (!h) return false;
//           return page.evaluate((node) => {
//             const btn = node.closest('button, summary, [role="button"], a, .accordion-button');
//             try {
//               if (btn) { btn.click(); return true; }
//               node.click(); return true;
//             } catch (e) { return false; }
//           }, h).catch(() => false);
//         });

//         await page.waitForTimeout(800);

//         // If element had a collapse target, wait a bit for it to open
//         const target = await el.getAttribute("data-bs-target") || (await el.getAttribute("aria-controls"));
//         if (target) {
//           const id = target.replace(/^#/, "");
//           await page.locator(`#${id}`).first().waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
//         }

//         if (await page.locator(formSelector).first().isVisible({ timeout: 4000 }).catch(() => false)) return;
//       }

//       // 3) Global JS text search fallback - click first matching element's closest clickable ancestor
//       const found = await page.evaluate((pat) => {
//         const re = new RegExp(pat, "i");
//         const nodes = Array.from(document.querySelectorAll("button, summary, [role='button'], a, .accordion-button, h2, h3, h4, div"));
//         for (const n of nodes) {
//           if (n.innerText && re.test(n.innerText)) {
//             try {
//               const btn = n.closest("button, summary, [role='button'], a, .accordion-button");
//               if (btn) { btn.click(); return true; }
//               n.click(); return true;
//             } catch (e) {}
//           }
//         }
//         return false;
//       }, pattern).catch(() => false);

//       if (found) {
//         await page.waitForTimeout(800);
//         if (await page.locator(formSelector).first().isVisible({ timeout: 4000 }).catch(() => false)) return;
//       }
//     } catch (e) {
//       // ignore and try next pattern
//     }
//   }

//   // Final generic attempt: click a few collapsed accordion buttons on the page (common bootstrap pattern)
//   try {
//     await page.evaluate(() => {
//       const collapsed = Array.from(document.querySelectorAll(".accordion-button.collapsed, [data-bs-toggle='collapse'].collapsed"));
//       for (let i = 0; i < Math.min(collapsed.length, 3); i++) {
//         try { collapsed[i].click(); } catch (e) {}
//       }
//     });
//     await page.waitForTimeout(900);
//     if (await page.locator(formSelector).first().isVisible({ timeout: 4000 }).catch(() => false)) return;
//   } catch (e) {
//     // ignore
//   }
// };
