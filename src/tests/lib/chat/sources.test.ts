import { buildSources } from "@/lib/chat/sources";

describe("buildSources function", () => {
  const sources = ["source1", "source2", "source3"];
  const fullSourcesExpected = sources.join(", ");

  it("returns all sources when shouldCreateInlineSources is false", () => {
    const fullResponse =
      "This is a test response containing source1 and source3";
    const result = buildSources(fullResponse, sources, false);
    expect(result).toEqual(fullSourcesExpected);
  });

  it("returns filtered and sorted sources when shouldCreateInlineSources is true", () => {
    const fullResponse =
      "This is a test response containing source1 and source3";
    const expected = ["source1", "source3"]; // source2 is not in fullResponse
    const result = buildSources(fullResponse, sources, true);
    expect(result).toEqual(expected.join(", "));
    // Additionally, check for the order based on appearance in fullResponse
    expect(result).toBe("source1, source3");
  });

  it("returns an empty array if no sources are present in the response when shouldCreateInlineSources is true", () => {
    const fullResponse = "This is a test response with no mentioned sources";
    const result = buildSources(fullResponse, sources, true);
    expect(result).toEqual(null);
  });
});
