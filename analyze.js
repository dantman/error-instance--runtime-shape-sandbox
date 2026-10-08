//#region Implementation
// 1. This is the error instance we are going to analyze for its shape
const error = new Error("This is a test error");

// 2. Get the property descriptors for both the error instance itself and its prototype
const ownPropertyDescriptors = Object.getOwnPropertyDescriptors(error);
const prototypePropertyDescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(error));

// 3. Collect the error information into a structured format and stringify it for easier logging and exporting
const errorInfo = JSON.stringify(
  {
    name: error.name,
    message: error.message,
    stack: formatStack(error.stack),
    own: {
      name: ownPropertyDescriptors.hasOwnProperty("name"),
      message: ownPropertyDescriptors.hasOwnProperty("message"),
      stack: ownPropertyDescriptors.hasOwnProperty("stack"),
    },
    accessor: {
      name: descriptorType(ownPropertyDescriptors.name ?? prototypePropertyDescriptors.name),
      message: descriptorType(
        ownPropertyDescriptors.message ?? prototypePropertyDescriptors.message,
      ),
      stack: descriptorType(ownPropertyDescriptors.stack ?? prototypePropertyDescriptors.stack),
    },
    descriptors: {
      own: ownPropertyDescriptors,
      prototype: prototypePropertyDescriptors,
    },
  },
  replacer,
  2,
);

// 4. Log the error information to the console for runtimes with a console we can view
if (typeof console !== "undefined" && typeof console.log === "function") {
  console.log(errorInfo);
}

// 5. Export the error information for runtimes that need to display the error details in a user interface or return it from a handler function
export { errorInfo };
//#endregion

//#region Helper Functions
/**
 * Gets the type of the property descriptor (data, accessor, or unknown).
 *
 * @param {PropertyDescriptor} descriptor - The property descriptor to analyze.
 * @returns {'data' | 'accessor' | 'unknown'}
 */
function descriptorType(descriptor) {
  if ("value" in descriptor) return "data";
  if ("get" in descriptor || "set" in descriptor) return "accessor";
  return "unknown";
}

/**
 * Formats the stack trace of an error into a more readable form.
 *
 * If the stack is a string, it removes directory paths and splits it into an array of lines.
 * Otherwise, it returns the raw stack as an object with a `$raw` property.
 * If the stack cannot be stringified to JSON, it will instead be returned as an object with a `$unknown` property containing the string representation of the stack.
 *
 * @param {*} stack - The stack trace to format.
 * @returns {string[] | { $raw: * } | { $unknown: string }} - The formatted stack trace as an array of lines, the raw stack wrapped in an object if it is not a string, or an object with a `$unknown` property if it cannot be stringified.
 */
function formatStack(stack) {
  if (typeof stack === "string") {
    return (
      stack
        // Remove the directory paths from the stack trace lines so only the file names remain
        // This runtime check is going to run in all sorts of JavaScript environments,
        // including those that live on the filesystem and may have a cwd personal to the user
        // This ensures that the stack trace is more portable/private and less dependent on the local filesystem structure
        .replace(/(?:[^\\/]+\/)*([^\\/]+.m?js)/g, "$1")
        // This will probably leave a leading protocol in browser environments (e.g., "http://")
        // Remove the leading protocol and domain, leaving only the path and file name
        .replace(/[a-z]+:\/\/(?=[^\\/]+\.m?js)/g, "")
        // Split the stack trace into individual lines so the JSON output is more readable
        .split("\n")
    );
  } else {
    try {
      // If the stack is not a string but is JSON stringifiable, we return it as-is wrapped in an object with a `$raw` property.
      JSON.stringify(stack); // Attempt to stringify to check if it's JSON stringifiable
      return { $raw: stack };
    } catch {
      // If the stack is not JSON stringifiable, we return an object with a `$unknown` property containing the string representation of the stack.
      return { $unknown: String(stack) };
    }
  }
}

/**
 * Custom replacer function for JSON.stringify to replace functions with a string representation.
 *
 * @param {*} key - The key of the property being stringified.
 * @param {*} value - The value of the property being stringified.
 * @returns {*} - The value to be used in the JSON stringification. Functions are replaced with a string representation.
 */
function replacer(key, value) {
  if (typeof value === "function") {
    if ("name" in value && value.name != null) {
      return `[Function: ${value.name}]`;
    }
    return `[Function]`;
  }
  return value;
}
//#endregion
