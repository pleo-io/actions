const getLokaliseSpecificText = (text: string): string => {
  const foundText = text.match(
    /<!--- LOKALIZE CONTEXT FOR TRANSLATORS -->(\n| )*((.|\n)*)(\n| )*<!--- LOKALIZE CONTEXT FOR TRANSLATORS -->/
  );
  return foundText ? foundText[2] : "";
};

const getClubhouseLink = (text: string): string => {
  const clubhouseLink = text.match(/Clubhouse Story: (.*)/);
  return clubhouseLink ? clubhouseLink[0] : "";
};

const getAllImages = (text: string): string[] => {
  const listOfImages = text.match(
    /(http|ftp|https):\/\/(user-images.githubusercontent.com)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/g
  );
  return listOfImages || [];
};

export const getTaskDescription = (description: string): string => {
  if (description) {
    const specificText = getLokaliseSpecificText(description);
    if (!specificText) {
      return description;
    }
    const clubhouseLink = getClubhouseLink(description);
    const allImages = getAllImages(description);
    return `${clubhouseLink}\n${specificText}\n${allImages
      .map((path) => `screenshot: ${path}`)
      .join("\n")}`;
  }
  return "";
};
