import {
  removeSupportButton,
  formatMarkdownLinks
} from "@/lib/shared/services/render-message"; // Adjust the import path as needed

describe("removeSupportButton", () => {
  it("should remove the support button HTML and return true if found", () => {
    const input =
      "Here is a message with a button<button create>support</button create>";
    const expectedOutput = ["Here is a message with a button", true];
    expect(removeSupportButton(input)).toEqual(expectedOutput);
  });

  it("should return the original text and false if no support button HTML is found", () => {
    const input = "No button here.";
    const expectedOutput = [input, false];
    expect(removeSupportButton(input)).toEqual(expectedOutput);
  });
});

describe("formatMarkdownLinks", () => {
  it("should convert markdown link to HTML a element", () => {
    const input = "This is a [test link](http://example.com).";
    const expectedOutput =
      'This is a <a style="text-decoration:underline;" rel="noopener noreferrer" target="_blank" href="http://example.com">test link</a>.';
    expect(formatMarkdownLinks(input)).toEqual(expectedOutput);
  });

  it("should convert markdown link with a number to superscript", () => {
    const input = "Refer to [1](http://example.com/source1).";
    const expectedOutput =
      'Refer to <sup><a rel="noopener noreferrer" target="_blank" style="text-decoration:none;" href="http://example.com/source1"> 1</a></sup>.';
    expect(formatMarkdownLinks(input)).toEqual(expectedOutput);
  });

  it("half is hidden", () => {
    const input = "Refer to [1](http://example.com/source1.";
    const expectedOutput =
      'Refer to <sup><a rel="noopener noreferrer" target="_blank" style="text-decoration:none;""> 1</a></sup>';
    expect(formatMarkdownLinks(input)).toEqual(expectedOutput);
  });
});
