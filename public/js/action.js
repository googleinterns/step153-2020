/**
 * This class is used as a wrapper for Google Assistant Canvas Action class
 * along with its callbacks.
 */
export class Action {
    /**
     * @param {*} scene which serves as a container of all visual elements
     */
    constructor(scene) {
        this.canvas = window.interactiveCanvas;
        this.scene = scene;
        this.commands = {
            // AOG Education Global Commands
            AOG_MAIN_MENU_SELECTION: (data) => {
                if (data.selection == "geography") {
                    this.scene.openGeography();
                } else if (data.selection == "language") {
                    this.scene.openLanguage();
                } else if (data.selection == "reading") {
                    this.scene.openReading();
                }
            },
            // AOG Education Geography Commands
            // AOG Education Language Commands
            LANG_MENU: (data) => {
                this.scene.langOpenLanguageMenu();
            },
            LANG_START_ONE_PIC: (data) => {
                console.log("Starting One Pic");
                this.scene.langStartOnePicOneWord(data);
            },
            LANG_ONE_PIC_SHOW_ENGLISH: (data) => {
                this.scene.langOnePicOneWordShowEnglish(data);
            },
            LANG_ONE_PIC_SHOW_SPANISH: (data) => {
                this.scene.langOnePicOneWordShowSpanish(data);
            },
            // AOG Education Reading Commands
        };
        this.commands.AOG_MAIN_MENU_SELECTION.bind(this);
        // AOG Education Geography Commands
        // AOG Education Language Commands
        this.commands.LANG_START_ONE_PIC.bind(this);
        this.commands.LANG_ONE_PIC_SHOW_ENGLISH.bind(this);
        this.commands.LANG_ONE_PIC_SHOW_SPANISH.bind(this);
        this.commands.LANG_MENU.bind(this);
        // AOG Education Reading Commands
    }
    /**
     * Register all callbacks used by Interactive Canvas
     * executed during scene creation time.
     *
     */
    setCallbacks() {
        // declare Interactive Canvas callbacks
        const callbacks = {
            onUpdate: (data) => {
                try {
                    this.commands[data[0].command.toUpperCase()](data[0]);
                } catch (e) {
                    // do nothing, when no command is sent or found
                }
            },
        };
        callbacks.onUpdate.bind(this);
        // called by the Interactive Canvas web app once web app has loaded to
        // register callbacks
        this.canvas.ready(callbacks);
    }
}
