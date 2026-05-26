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
//   const formParts = [
//     "#contactUs-inquiryType",
//     'select[name="inquiryType"]',
//     "input#email",
//     "textarea#comments",
//   ];
//   const formSelector = formParts.join(", ");

//   // quick exit if already visible
//   if (
//     await page
//       .locator(formSelector)
//       .first()
//       .isVisible({ timeout: 1500 })
//       .catch(() => false)
//   )
//     return;

//   await page.evaluate(() => window.scrollBy(0, 300));
//   await page.waitForTimeout(300);

//   const patterns = ["consumer support", "customer support", "contact us online"];

//   for (const p of patterns) {
//     const re = new RegExp(p, "i");
//     try {
//       const btn = page
//         .locator('button, summary, [role="button"], a, .accordion-button')
//         .filter({ hasText: re })
//         .first();

//       if ((await btn.count().catch(() => 0)) === 0) continue;
//       if (!(await btn.isVisible({ timeout: 1500 }).catch(() => false))) continue;

//       await safeScrollIntoView(page, btn);
//       // try normal click first
//       await btn.click({ force: true }).catch(() => {});

//       // if button targets a collapse panel, wait for that panel to show and for the form inside it
//       const targetAttr =
//         (await btn.getAttribute("data-bs-target")) ||
//         (await btn.getAttribute("data-target")) ||
//         (await btn.getAttribute("aria-controls")) ||
//         "";
//       if (targetAttr) {
//         const id = targetAttr.replace(/^#/, "").trim();
//         if (id) {
//           const targetSel = `#${id}`;
//           // Wait for standard bootstrap expansion indicators
//           await page
//             .waitForSelector(`${targetSel}.show, ${targetSel}[aria-expanded="true"]`, {
//               timeout: 5000,
//             })
//             .catch(() => {});
//           // build scoped selectors for the form elements inside the collapse target
//           const scopedFormSel = formParts.map((s) => `${targetSel} ${s}`).join(", ");
//           const appeared = await page
//             .locator(scopedFormSel)
//             .first()
//             .isVisible({ timeout: 4000 })
//             .catch(() => false);
//           if (appeared) return;
//           // also try waiting for any of the form parts inside the panel to be attached/visible
//           await page
//             .locator(scopedFormSel)
//             .first()
//             .waitFor({ state: "visible", timeout: 4000 })
//             .then(() => true)
//             .catch(() => false);
//           if (
//             await page
//               .locator(scopedFormSel)
//               .first()
//               .isVisible({ timeout: 1000 })
//               .catch(() => false)
//           )
//             return;
//         }
//       }

//       // If no explicit target or target didn't reveal the form, wait short for general indicators
//       await page.waitForTimeout(600);
//       const formAppeared = await page
//         .locator(formSelector)
//         .first()
//         .isVisible({ timeout: 3000 })
//         .catch(() => false);
//       if (formAppeared) return;

//       // fallback: try clicking via JS on closest clickable ancestor (handles nested text nodes)
//       const clicked = await btn.elementHandle().then(async (h) => {
//         if (!h) return false;
//         return page
//           .evaluate((n) => {
//             try {
//               const c = n.closest("button, summary, [role='button'], a, .accordion-button");
//               if (c) { c.click(); return true; }
//               n.click(); return true;
//             } catch (e) { return false; }
//           }, h)
//           .catch(() => false);
//       });
//       if (clicked) {
//         await page.waitForTimeout(700);
//         if (
//           await page
//             .locator(formSelector)
//             .first()
//             .isVisible({ timeout: 4000 })
//             .catch(() => false)
//         )
//           return;
//       }
//     } catch (e) {
//       // try next pattern
//     }
//   }

//   // generic fallback: click a few collapsed accordion buttons
//   try {
//     await page.evaluate(() => {
//       const collapsed = Array.from(
//         document.querySelectorAll(
//           ".accordion-button.collapsed, [data-bs-toggle='collapse'].collapsed, [data-toggle='collapse'].collapsed"
//         )
//       );
//       for (let i = 0; i < Math.min(collapsed.length, 4); i++) {
//         try { collapsed[i].click(); } catch (e) {}
//       }
//     });
//     await page.waitForTimeout(900);
//     if (
//       await page
//         .locator(formSelector)
//         .first()
//         .isVisible({ timeout: 3000 })
//         .catch(() => false)
//     )
//       return;
//   } catch (e) {
//     // ignore
//   }

//   // Debug: save small DOM snapshot + screenshot to help root-cause
//   try {
//     console.log("clickContactUsSection: form not visible after attempts, capturing debug artifacts");
//     const snap = await page.evaluate(() => {
//       const el = Array.from(document.querySelectorAll("button, .accordion-button"))
//         .find(n => /consumer support|contact us/i.test(n.innerText || ""));
//       return el ? el.outerHTML.slice(0, 2000) : null;
//     });
//     if (snap) console.log("Matched button outerHTML (truncated):", snap);
//     await page.screenshot({ path: `debug-consumer-support-${Date.now()}.png`, fullPage: true });
//   } catch (e) {}
// };
// ...existing code...
