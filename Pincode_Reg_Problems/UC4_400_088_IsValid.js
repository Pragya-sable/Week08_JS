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
// // ...existing code...
// // Helper: find a locator either on main page or inside any child frame
// const findLocatorAcrossFrames = async (page, selector) => {
//   // main page first
//   try {
//     const mainCount = await page.locator(selector).first().count().catch(() => 0);
//     if (mainCount > 0) return { context: page, locator: page.locator(selector) };
//   } catch (e) {
//     // ignore
//   }

//   // then frames
//   for (const frame of page.frames()) {
//     try {
//       const c = await frame.locator(selector).first().count().catch(() => 0);
//       if (c > 0) return { context: frame, locator: frame.locator(selector) };
//     } catch (e) {
//       // ignore cross-origin/access issues
//     }
//   }

//   // not found
//   return { context: page, locator: page.locator(selector) };
// };

// // Update clickSubmit to search across frames
// const clickSubmit = async (pageOrFrame) => {
//   // pageOrFrame is expected to be the top-level page when called from tests
//   const { context, locator } = await findLocatorAcrossFrames(pageOrFrame, "#submitButton");
//   if ((await locator.count().catch(() => 0)) > 0 && (await locator.isVisible({ timeout: 2000 }).catch(() => false))) {
//     await safeScrollIntoView(context, locator);
//     await locator.click({ force: true });
//     return;
//   }

//   // fallback: any submit button across frames
//   const fallbackSel = 'button[type="submit"]';
//   const found = await findLocatorAcrossFrames(pageOrFrame, fallbackSel);
//   if ((await found.locator.count().catch(() => 0)) > 0) {
//     await safeScrollIntoView(found.context, found.locator);
//     await found.locator.click({ force: true });
//   }
// };

// // Update fillAndSubmitForm to use cross-frame locator resolution
// const fillAndSubmitForm = async (
//   page, // keep 'page' param so existing tests don't need changes
//   {
//     inquiryType = "Question",
//     subject = "Business",
//     checkAge = true,
//     submit = false,
//     partialFill = false,
//     url = "",
//   } = {}
// ) => {
//   // NOTE: dismissCookieBanner should be called by caller before this function
//   // Resolve inquiry type selector (may be inside a frame)
//   const inquiry = await findLocatorAcrossFrames(page, "#contactUs-inquiryType");
//   await safeScrollIntoView(inquiry.context, inquiry.locator);
//   await inquiry.locator.selectOption(inquiryType).catch(() => {});

//   const subj = await findLocatorAcrossFrames(page, "#contactUs-inquirySubj");
//   await subj.locator.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
//   await safeScrollIntoView(subj.context, subj.locator);
//   await subj.locator.selectOption(subject).catch(() => {});

//   if (!partialFill) {
//     const given = await findLocatorAcrossFrames(page, "#givenName");
//     await safeScrollIntoView(given.context, given.locator);
//     await given.locator.fill("Test").catch(() => {});

//     const family = await findLocatorAcrossFrames(page, "#familyName");
//     await safeScrollIntoView(family.context, family.locator);
//     await family.locator.fill("User").catch(() => {});

//     const emailInput = await findLocatorAcrossFrames(page, "#email");
//     await safeScrollIntoView(emailInput.context, emailInput.locator);
//     await emailInput.locator.fill("test@example.com").catch(() => {});

//     const phoneContainer = await findLocatorAcrossFrames(page, "#phoneContainer input");
//     let phoneTargetLocator = phoneContainer.locator;
//     const inputsCount = await phoneTargetLocator.count().catch(() => 0);
//     if (inputsCount > 1) {
//       phoneTargetLocator = phoneTargetLocator.nth(inputsCount - 1);
//     } else if (inputsCount === 0) {
//       // fallback to container itself
//       const fallback = await findLocatorAcrossFrames(page, "#phoneContainer");
//       phoneTargetLocator = fallback.locator;
//     }

//     if ((await phoneTargetLocator.count().catch(() => 0)) > 0 && (await phoneTargetLocator.isVisible({ timeout: 2000 }).catch(() => false))) {
//       // find context for phoneTargetLocator: try phoneContainer first, else fallback to main page
//       const phoneCtx = (phoneContainer.context || page);
//       await safeScrollIntoView(phoneCtx, phoneTargetLocator);
//       const localPhone = getLocalPhoneNumberForCountry(url);
//       if (localPhone) {
//         await phoneTargetLocator.fill(localPhone).catch(() => {});
//       }
//     }

//     const comments = await findLocatorAcrossFrames(page, "#comments");
//     await safeScrollIntoView(comments.context, comments.locator);
//     await comments.locator.fill("This is a test message").catch(() => {});

//     if (checkAge) {
//       const age = await findLocatorAcrossFrames(page, "#contact-legalAgeConfirmation");
//       const ageLabel = await findLocatorAcrossFrames(page, 'label[for="contact-legalAgeConfirmation"]');

//       const exists = await age.locator.waitFor({ state: "attached", timeout: 5000 }).then(() => true).catch(() => false);
//       if (exists) {
//         const isChecked = await age.locator.isChecked().catch(() => false);
//         if (!isChecked) {
//           await safeScrollIntoView(ageLabel.context, ageLabel.locator);
//           await ageLabel.locator.click({ force: true }).catch(() => {});
//         }
//         await expect(age.locator).toBeChecked();
//       }
//     }
//   }

//   if (submit) await clickSubmit(page);
// };
// ...existing code...
