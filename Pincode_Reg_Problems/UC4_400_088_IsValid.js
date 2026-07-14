const errorsList = lastResult?.errors || [];
const rawMsg =
  errorsList[0]?.message ||
  lastResult?.error?.message ||
  "No error message available";

let failure = rawMsg
  .replace(/\u001b\[[\d;]*[a-zA-Z]/g, "")
  .replace(/\\n/g, "\n")
  .split("\n")[0]
  .replace(/^Error:\s*/i, "")
  .trim();
