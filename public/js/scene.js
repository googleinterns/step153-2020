import { AogMainMenu } from "./global/aog-main-menu.js";
import { GeographyCity } from "./geography/geography-city.js";
import { GeographyMain } from "./geography/geography-main.js";
import { GeographyMap } from "./geography/geography-map.js";
import { GeographyQuestion } from "./geography/geography-question.js";
import { GeographyResults } from "./geography/geography-results.js";
import { LanguageMain } from "./language/language-main.js";
import { ReadingMain } from "./reading/ReadingMain.js";
import { OnePicOneWord } from "./language/one_pic_one_word.js";
import { OnePicMultipleWords } from "./language/one_pic_multiple_words.js";
import { Conversation } from "./language/conversation.js";
import { Vocabulary } from "./language/vocab.js";

export class Scene {
    menu = new AogMainMenu();

    geography = new GeographyMain();
    geography_city = new GeographyCity();
    geography_map = new GeographyMap();
    geography_question = new GeographyQuestion();
    geography_results = new GeographyResults();

    language = new LanguageMain();
    onePicOneWord = new OnePicOneWord();
    onePicMultipleWords = new OnePicMultipleWords();
    conversation = new Conversation();
    vocabulary = new Vocabulary();

    reading = new ReadingMain();

    game = document.getElementById("game");

    constructor() {
        this.game.appendChild(this.menu.getMenu());
        this.createAnimation();
    }

    aogOpenMainMenu() {
        while(this.game.firstChild){
            this.game.removeChild(this.game.lastChild);
        }
        this.game.appendChild(this.menu.getMenu());
        this.createAnimation();
    }

    openGeography() {
        this.game.removeChild(document.getElementById("animation-canvas"));
        this.game.removeChild(this.menu.getMenu());
        this.game.appendChild(this.geography.getElement());
    }

    openLanguage() {
        document.getElementById("animation-canvas").style.visibility = "visible";
        this.game.removeChild(this.menu.getMenu());
        this.game.appendChild(this.language.getLanguageElement());
    }

    openReading() {
        this.game.removeChild(document.getElementById("animation-canvas"));
        this.game.removeChild(this.menu.getMenu());
        this.game.appendChild(this.reading.getReadingElement());
    }

    /**
     * Geography Section
     */

    geoMenu() {
        this.geoRemoveResults();
        this.geoRemoveCityMenu();
        this.game.appendChild(this.geography.getElement());
    }

    /**
     * Displays capital question.
     * @param {*} data contains name of state or country in question
     */
    geoCapital = async (data) => {
        this.geoRemoveElement();
        await this.geoRemoveQuestion();
        this.game.appendChild(this.geography_question.getQuestion(data.name, data.answer));
    };

    /**
     * Loads map corresponding to state question.
     * @param {*} data stores the coordinates of the state
     */
    geoLoadStateMap(data) {
        this.geoRemoveElement();
        this.geoOpenMap("states");
        this.geography_map.loadStateMap(data);
    }

    /**
     * Loads map corresponding to country question.
     * @param {*} data stores the country and M49 region
     */
    geoLoadCountryMap(data) {
        this.geoRemoveElement();
        this.geoOpenMap("countries");
        this.geography_map.loadCountryMap(data);
    }

    /**
     * Displays results of the questions the user answered.
     * @param {*} data stores the number of questions answered correctly and incorrectly.
     */
    async geoShowResults(data) {
        await this.geoRemoveQuestion();
        this.geoRemoveMap();
        this.game.appendChild(this.geography_results.setResults(data.correct, data.incorrect));
    }

    /**
     * Loads page which allows the user to choose a city to visit.
     * @param {*} data stores the list of available cities.
     */
    geoChooseCity(data) {
        this.geoRemoveElement();
        this.geoRemoveMap();
        this.game.appendChild(this.geography_city.getCityMenu(data.cities));
    }

    /**
     * Loads city street view map.
     * @param {*} data stores latitude and longitude
     */
    geoCity(data) {
        this.geoRemoveCityMenu();
        this.geoOpenMap("city");
        this.geography_map.loadCityMap(data, game);
    }

    geoForward() {
        this.geography_map.move(1);
    }

    geoBackward() {
        this.geography_map.move(-1);
    }

    geoLeft() {
        this.geography_map.left();
    }

    geoRight() {
        this.geography_map.right();
    }

    geoUp() {
        this.geography_map.up();
    }

    geoDown() {
        this.geography_map.down();
    }

    geoOpenMap(map) {
        if (!this.game.contains(this.geography_map.getMap())) {
            this.game.appendChild(this.geography_map.getMap(map));
        }
    }

    geoRemoveMap() {
        if (this.game.contains(this.geography_map.getMap())) {
            this.game.removeChild(this.geography_map.getMap());
        }
    }

    geoRemoveCityMenu() {
        if (this.game.contains(this.geography_city.getCityMenu())) {
            this.game.removeChild(this.geography_city.getCityMenu());
        }
    }

    geoRemoveElement() {
        if (this.game.contains(this.geography.getElement())) {
            this.game.removeChild(this.geography.getElement());
        }
    }

    geoRemoveResults() {
        if (this.game.contains(this.geography_results.getResults())) {
            this.game.removeChild(this.geography_results.getResults());
        }
    }

    async geoRemoveQuestion() {
        if (this.game.contains(this.geography_question.getQuestion())) {
            // Flip card to reveal answer, then wait for 2.5 seconds.
            this.geography_question.flipCard();
            await new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 2500);
            });

            this.game.removeChild(this.geography_question.getQuestion());

            // Flip card again to return to the front side.
            this.geography_question.flipCard();
        }
    }

    /**
     * Language Section
     */

    /**
     * Removes the menu and shows the one pic one game question
     * @param {*} data stores the english word, image url and attempts left over
     */
    startOnePicOneWord(data) {
        if (this.game.contains(this.language.getLanguageElement()))
            this.game.removeChild(this.language.getLanguageElement());

        const analysisWord = String(data.word);
        this.onePicOneWord.setImageURL(data.url);
        this.onePicOneWord.setWord(analysisWord, "ENGLISH");
        this.onePicOneWord.setAttempts(data.attempts);
        this.game.appendChild(this.onePicOneWord.getQuestion());
    }

    /**
     * Shows the english word after the user guesses it correctly
     * @param {*} data stores the correct english word and its translation
     */
    onePicOneWordShowEnglish(data) {
        var englishWord = `${data.word}`;
        this.onePicOneWord.setWordValue(englishWord, "english-word");

        this.onePicOneWord.showSpanishWord();
        this.onePicOneWord.setWord(data.spanish, "SPANISH");
        
        if (data.attempts != undefined) {
            this.onePicOneWord.setAttempts(data.attempts);
        }
    }

    /**
     * Shows the spanish word after the user guesses it correctly
     * @param {*} data stores the spanish word
     */
    onePicOneWordShowSpanish(data) {
        const translatedWord = String(data.word);
        this.onePicOneWord.showSpanishWord();
        this.onePicOneWord.setWordValue(translatedWord, "spanish-word");

        if (data.attempts != undefined) {
            this.onePicOneWord.setAttempts(data.attempts);
        }
    }

    /**
     * Updates the attempts left in the current game session
     * @param {*} data stores the attempts left
     */
    updateOnePicAttempts(data) {
        this.onePicOneWord.setAttempts(data);
    }

    /**
     * Provides a hint to the user in the form of a letter
     * @param {*} data stores the information to be updated on the screen
     */
    onePicShowHint(data) {
        this.onePicOneWord.setAttempts(data.attempts);
        if (data.scene == "lang_one_pic") {
            this.onePicOneWord.setWordValue(data.word, "english-word");
        } else if (data.scene == "lang_one_pic_translation") {
            this.onePicOneWord.setWordValue(data.word, "spanish-word");
        }
    }

    /**
     * Shows the answer after the attempts have ran out
     * @param {*} data stores the correct english and spanish word
     */
    showOnePicAnswer(data) {
        this.onePicOneWord.setAttempts(0);
        this.onePicOneWord.setWordValue(data.english, "english-word");
        this.onePicOneWord.showSpanishWord();
        this.onePicOneWord.setWordValue(data.spanish, "spanish-word");
    }

    /**
     * Removes the main menu and starts the one pic multiple words game session
     * @param {*} data stores the url, words and attempts left over
     */
    startOnePicMultipleWords(data) {
        if (this.game.contains(this.language.getLanguageElement()))
            this.game.removeChild(this.language.getLanguageElement());

        this.onePicMultipleWords.setImageURL(data.url);
        this.onePicMultipleWords.setWords(data.words, "ENGLISH");
        this.onePicMultipleWords.setWords(data.wordsTranslated, "SPANISH");
        this.onePicMultipleWords.setAttempts(data.attempts);
        this.game.appendChild(this.onePicMultipleWords.getQuestion());
        this.onePicMultipleWords.hideSpanishWords();
    }

    /**
     * Shows the english word after the user guesses it correctly
     * @param {*} data stores the correct english word and its index to be shown.
     * Also tells us if the user has guessed all english words so that the spanish
     * section can be shown.
     */
    onePicMultipleWordShowEnglish(data) {
        this.onePicMultipleWords.setWord(data.word, "english", data.index);
        if (data.showSpanish) {
            this.onePicMultipleWords.showSpanishWords();
        }
    }

    /**
     * Shows the spanish word after the user guesses it correctly
     * @param {*} data stores the correct spanish word and its index to be shown.
     */
    onePicMultipleWordShowSpanish(data) {
        this.onePicOneWord.showSpanishWord();
        this.onePicMultipleWords.setWord(data.word, "spanish", data.index);
    }

    /**
     * Updates the attempts left in the current game session
     * @param {*} data stores the attempts left
     */
    updateMultipleWordsAttempts(data) {
        this.onePicMultipleWords.setAttempts(data);
    }

    /**
     * Shows the answer after the attempts have ran out
     * @param {*} data stores the correct english and spanish words
     */
    showMultipleWordsAnswer(data) {
        this.onePicMultipleWords.setAttempts(0);
        this.onePicMultipleWords.showSpanishWords();
        for (var i = 0; i < 3; i++) {
            this.onePicMultipleWords.setWord(data.english[i], "english", i);
            this.onePicMultipleWords.setWord(data.spanish[i], "spanish", i);
        }
    }

    /**
     * Removes the menu and adds the conversation element
     * @param {*} data stores the message information to be shown at the start
     */
    startConversation(data) {
        if (this.game.contains(this.language.getLanguageElement()))
            this.game.removeChild(this.language.getLanguageElement());

        this.game.appendChild(this.conversation.getConversation());
        this.conversation.appendMessage(data.sender, data.text);
    }

    /**
     * Adds a regular message to the conversation
     * @param {*} data stores the message information to be shown 
     */
    addConversationMessage(data) {
        this.conversation.appendMessage(
            false,
            data.receiverMessage,
            data.receiverImage
        );
        this.conversation.appendMessage(true, data.senderMessage);
    }

    /**
     * Adds a what the user has searched to the conversation
     * @param {*} data stores the message information to be shown 
     */
    addConversationSearchMessage(data) {
        this.conversation.appendMessage(
            false,
            data.receiverMessage,
            data.receiverImage
        );
        this.conversation.appendSearchMessage(data.results, data.senderMessage);
    }

    /**
     * Opens the list of words that the user has translated
     * @param {*} data stores the words to be shown
     */
    openVocab(data) {
        if (this.game.contains(this.language.getLanguageElement()))
            this.game.removeChild(this.language.getLanguageElement());

        this.game.appendChild(this.vocabulary.getWords());
        this.vocabulary.setWords(data);
    }

    /**
     * Returns to the main menu from the current game session
     * @param {*} scene so that the correct session can be removed before
     * showing the menu
     */
    langOpenLanguageMenu(scene) {
        if (scene == "lang_one_pic" || scene == "lang_one_pic_translation") {
            this.game.removeChild(this.onePicOneWord.getQuestion());
        } else if (
            scene == "lang_multiple_words" ||
            scene == "lang_multiple_words_translation"
        ) {
            this.game.removeChild(this.onePicMultipleWords.getQuestion());
        } else if (scene == "lang_conversation") {
            this.game.removeChild(this.conversation.getConversation());
        } else if (scene == "lang_vocab") {
            this.game.removeChild(this.vocabulary.getWords());
        }
        this.game.appendChild(this.language.getLanguageElement());
    }

    /**
     * Creates the background animation
     */
    createAnimation() {
        // initialize rendering and set correct sizing
        this.ratio = window.devicePixelRatio;
        this.renderer = PIXI.autoDetectRenderer({
            transparent: true,
            antialias: true,
            resolution: this.ratio,
            width: this.game.clientWidth,
            height: this.game.clientHeight,
        });
        this.element = this.renderer.view;
        this.element.style.width = `${this.renderer.width / this.ratio}px`;
        this.element.style.height = `${this.renderer.height / this.ratio}px`;
        this.element.id = "animation-canvas"
        this.game.appendChild(this.element);

        // center stage and normalize scaling for all resolutions
        this.stage = new PIXI.Container();
        this.stage.position.set(
            this.game.clientWidth / 2,
            this.game.clientHeight / 2
        );
        this.stage.scale.set(
            Math.max(this.renderer.width, this.renderer.height) / 1024
        );

        var boxes = [];
        boxes.push(this.drawShape("rect", "0x4285F4", -280, -150, 200, 200));
        boxes.push(this.drawShape("circle", "0xDB4437", 280, -180, 110, 0));
        boxes.push(this.drawShape("rect", "0x0F9D58", 230, 120, 220, 140));
        boxes.push(this.drawShape("line", "0xF4B400", -240, 70, 125, 90));

        let last = performance.now();
        // frame-by-frame animation function
        const frame = () => {
            // calculate time differences for smooth animations
            const now = performance.now();
            const delta = now - last;

            for (var index = 0; index < boxes.length; index++) {
                index % 2 == 0
                    ? (boxes[index].rotation -= delta / 1000)
                    : (boxes[index].rotation += delta / 1000);
            }

            last = now;

            this.renderer.render(this.stage);
            requestAnimationFrame(frame);
        };
        frame();
    }

    /**
     *
     * @param {*} type of shape to be drawn
     * @param {*} color of the shape's fill
     * @param {*} x coordinate of the shape
     * @param {*} y coordinate of the shape
     * @param {*} width of the shape
     * @param {*} height of the shape
     */
    drawShape(type, color, x, y, width, height) {
        var shape = new PIXI.Graphics();
        shape.beginFill(color);
        if (type == "circle") {
            shape.drawCircle(50, 50, width);
        } else if (type == "rect") {
            shape.drawRect(0, 0, width, height);
        } else if (type == "ellipse") {
            shape.drawEllipse(25, 25, width, height);
        } else if (type == "line") {
            shape.lineStyle(10, color, 1);
            shape.moveTo(5, 0);
            shape.lineTo(5, 250);
        }

        shape.endFill();
        shape.x = x;
        shape.y = y;
        this.stage.addChild(shape);

        return shape;
    }
}
