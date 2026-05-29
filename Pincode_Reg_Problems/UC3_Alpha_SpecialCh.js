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

//  // Generic dismissal via direct DOM text scan
//   await page.evaluate(() => {
//     const dismissTexts = [
//       "NO, GRACIAS", "No, gracias", "No Thanks", "No thanks",
//       "Aceptar todas las cookies", "Accept All", "Reject All",
//       "×", "✕", "✖",
//     ];
//     Array.from(document.querySelectorAll("button, a, [role='button']")).forEach((btn) => {
//       const text = btn.innerText?.trim();
//       if (!text) return;
//       const s = window.getComputedStyle(btn);
//       const r = btn.getBoundingClientRect();
//       if (
//         s.display !== "none" && s.visibility !== "hidden" && s.opacity !== "0" &&
//         r.width > 0 && r.height > 0 && dismissTexts.includes(text)
//       ) btn.click();
//     });
//   });
//   await page.waitForTimeout(400);
// };
