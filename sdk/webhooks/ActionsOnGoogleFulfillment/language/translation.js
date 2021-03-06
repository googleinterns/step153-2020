const projectId = "step-capstone";

// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate").v2;

// Instantiates a client
const translate = new Translate({ projectId });

/**
 * Translates the english word to spanish
 * @param {*} word to be translated
 */
exports.translateFunction = async function (word) {
    // The target language
    const target = "es";

    // Translates some text into Spanish
    const [translation] = await translate.translate(word, target);
    return translation;
};
