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
//   const formSelectors = [
//     "#contactUs-inquiryType",
//     'select[name="inquiryType"]',
//     "#email",
//     "#comments",
//   ];

//   // Helper: check if any form field is ACTUALLY visible
//   const isFormVisible = async () => {
//     return await page
//       .waitForFunction((selectors) => {
//         return selectors.some((selector) => {
//           const el = document.querySelector(selector);

//           if (!el) return false;

//           const style = window.getComputedStyle(el);

//           return (
//             style.display !== "none" &&
//             style.visibility !== "hidden" &&
//             el.offsetHeight > 0 &&
//             el.getBoundingClientRect().height > 0
//           );
//         });
//       }, formSelectors, { timeout: 3000 })
//       .then(() => true)
//       .catch(() => false);
//   };

//   // Fast exit if form already visible
//   if (await isFormVisible()) return;

//   const patterns = [
//     "consumer support",
//     "customer support",
//     "contact us online",
//     "consumer help",
//     "consumer service",
//     "consumer assistance",
//     "write to us",
//     "send us a message",
//     "get in touch",
//     "contact form",
//     "email us",
//   ];

//   for (const pattern of patterns) {
//     try {
//       console.log(`Trying pattern: ${pattern}`);

//       const re = new RegExp(pattern, "i");

//       // All possible clickable accordion/button elements
//       const candidates = page
//         .locator(
//           `
//           button,
//           summary,
//           [role="button"],
//           a,
//           .accordion-button,
//           h2,
//           h3,
//           h4,
//           div
//         `
//         )
//         .filter({ hasText: re });

//       const count = await candidates.count().catch(() => 0);

//       console.log(`Candidates found: ${count}`);

//       for (let i = 0; i < count; i++) {
//         const el = candidates.nth(i);

//         const visible = await el
//           .isVisible({ timeout: 1500 })
//           .catch(() => false);

//         if (!visible) continue;

//         await safeScrollIntoView(page, el);

//         await page.waitForTimeout(500);

//         // Highlight for debugging
//         await el.highlight().catch(() => {});

//         // Click via JS closest clickable ancestor
//         const handle = await el.elementHandle();

//         if (handle) {
//           await page
//             .evaluate((node) => {
//               const clickable = node.closest(`
//                 button,
//                 summary,
//                 [role="button"],
//                 a,
//                 .accordion-button
//               `);

//               if (clickable) {
//                 clickable.click();
//               } else {
//                 node.click();
//               }
//             }, handle)
//             .catch(() => {});
//         } else {
//           await el.click({ force: true }).catch(() => {});
//         }

//         console.log(`Clicked pattern: ${pattern}`);

//         // Wait for accordion animation + lazy render
//         await page.waitForTimeout(2500);

//         // Wait for bootstrap collapse if exists
//         await page
//           .waitForSelector(
//             `
//             .collapse.show,
//             [aria-expanded="true"]
//           `,
//             { timeout: 4000 }
//           )
//           .catch(() => {});

//         // Final visibility check
//         const appeared = await isFormVisible();

//         console.log(`Form visible: ${appeared}`);

//         if (appeared) {
//           console.log(`SUCCESS WITH: ${pattern}`);
//           return;
//         }
//       }
//     } catch (e) {
//       console.log(`FAILED PATTERN: ${pattern}`);
//       console.log(e);
//     }
//   }

//   // Generic bootstrap fallback
//   try {
//     await page.evaluate(() => {
//       const accordions = Array.from(
//         document.querySelectorAll(`
//           .accordion-button.collapsed,
//           [data-bs-toggle="collapse"].collapsed
//         `)
//       );

//       for (let i = 0; i < Math.min(accordions.length, 3); i++) {
//         try {
//           accordions[i].click();
//         } catch (e) {}
//       }
//     });

//     await page.waitForTimeout(2500);

//     if (await isFormVisible()) return;
//   } catch (e) {}

//   // Final hard wait
//   await page.waitForFunction((selectors) => {
//     return selectors.some((selector) => {
//       const el = document.querySelector(selector);

//       if (!el) return false;

//       const style = window.getComputedStyle(el);

//       return (
//         style.display !== "none" &&
//         style.visibility !== "hidden" &&
//         el.offsetHeight > 0
//       );
//     });
//   }, formSelectors, { timeout: 20000 });
// };
