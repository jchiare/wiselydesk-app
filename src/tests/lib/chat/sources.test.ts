import { buildSources } from "@/lib/chat/sources";

describe("buildSources function", () => {
  const sources = ["source1", "source2", "source3"];

  it("returns all sources when shouldCreateInlineSources is false", () => {
    const fullResponse =
      "This is a test response containing source1 and source3";
    const result = buildSources(fullResponse, sources, false);
    expect(result).toEqual(sources);
  });

  it("returns filtered and sorted sources when shouldCreateInlineSources is true", () => {
    const fullResponse =
      "This is a test response containing source3 and source1";
    const expected = ["source3", "source1"]; // source2 is not in fullResponse
    const result = buildSources(fullResponse, sources, true);
    expect(result).toEqual(expected);
    // Additionally, check for the order based on appearance in fullResponse
    expect(result[0]).toBe("source3");
    expect(result[1]).toBe("source1");
  });

  it("returns an empty array if no sources are present in the response when shouldCreateInlineSources is true", () => {
    const fullResponse = "This is a test response with no mentioned sources";
    const result = buildSources(fullResponse, sources, true);
    expect(result).toEqual([]);
  });
});
