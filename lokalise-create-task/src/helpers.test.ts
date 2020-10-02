import { getTaskDescription } from "./helpers";

describe("getTaskDescription", () => {
  test("return default case", async () => {
    const description = `
      <!--- LOKALIZE CONTEXT FOR TRANSLATORS -->Hello, it is special text<!--- LOKALIZE CONTEXT FOR TRANSLATORS -->
      Clubhouse Story: [ch-44690](https://app.clubhouse.io/pleo/story/44690/the-process-when-translations-are-not-required-before-for-product-web)

      https://user-images.githubusercontent.com/32882870/94275757-0b48ac00-ff50-11ea-8ce2-854158cac82c.png
      https://user-images.githubusercontent.com/32882870/94275757-0b48ac00-ff50-11ea-8ce2-854158cac82c.png
      https://user-images.githubusercontent.com/32882870/94275757-0b48ac00-ff50-11ea-8ce2-854158cac82c.png

      Some text
      `;
    const expected = `Clubhouse Story: [ch-44690](https://app.clubhouse.io/pleo/story/44690/the-process-when-translations-are-not-required-before-for-product-web)
Hello, it is special text
screenshot: https://user-images.githubusercontent.com/32882870/94275757-0b48ac00-ff50-11ea-8ce2-854158cac82c.png
screenshot: https://user-images.githubusercontent.com/32882870/94275757-0b48ac00-ff50-11ea-8ce2-854158cac82c.png
screenshot: https://user-images.githubusercontent.com/32882870/94275757-0b48ac00-ff50-11ea-8ce2-854158cac82c.png`;
    expect(getTaskDescription(description)).toBe(expected);
  });

  test("return localise context when comments with /n", async () => {
    const description = `
      <!--- LOKALIZE CONTEXT FOR TRANSLATORS -->
      Hello, it is special text
      <!--- LOKALIZE CONTEXT FOR TRANSLATORS -->
      `;
    const expected = `Hello, it is special text`;
    expect(getTaskDescription(description)).toBe(expected);
  });

  test("return unproccesed description when no context is provided", async () => {
    const description = `
    Clubhouse Story: [ch-44690](https://app.clubhouse.io/pleo/story/44690/the-process-when-translations-are-not-required-before-for-product-web)

    https://user-images.githubusercontent.com/32882870/94275757-0b48ac00-ff50-11ea-8ce2-854158cac82c.png
    https://user-images.githubusercontent.com/32882870/94275757-0b48ac00-ff50-11ea-8ce2-854158cac82c.png
    https://user-images.githubusercontent.com/32882870/94275757-0b48ac00-ff50-11ea-8ce2-854158cac82c.png
    Hello
      `;
    expect(getTaskDescription(description)).toBe(description);
  });
});
