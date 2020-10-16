"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getContext = (text) => {
    const foundText = text.match(/<!--- LOKALIZE CONTEXT FOR TRANSLATORS -->((.|\n|\r|\t)*)<!--- LOKALIZE CONTEXT FOR TRANSLATORS -->/);
    return foundText ? foundText[1] : "";
};
const getClubhouseLink = (text) => {
    const clubhouseLink = text.match(/Clubhouse Story: (.*)/);
    return clubhouseLink ? clubhouseLink[0] : "";
};
const getAllImages = (text) => {
    const listOfImages = text.match(/(http|ftp|https):\/\/(user-images.githubusercontent.com)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/g);
    return listOfImages || [];
};
exports.getTaskDescription = (description) => {
    if (description) {
        const contextText = getContext(description).trim();
        if (!contextText) {
            return description;
        }
        const clubhouseLink = getClubhouseLink(description);
        const allImages = getAllImages(description);
        return `${clubhouseLink ? `${clubhouseLink}\n` : ""}${contextText}${allImages && allImages.length > 0
            ? `\n${allImages.map((path) => `screenshot: ${path}`).join("\n")}`
            : ""}`;
    }
    return "";
};
