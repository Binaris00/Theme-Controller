import { App, Plugin } from 'obsidian';
import { IThControlSettings, DEFAULT_SETTINGS } from './settings/settings';
import ThControl from './main';

export class ColorStatusBar {
    private app: App;
    private plugin: Plugin;
    private settings: IThControlSettings;
    public DARK_MODE_THEME_KEY: string = "obsidian";
    public LIGHT_MODE_THEME_KEY: string = "moonstone";
    currentColorStatus: string;

    constructor(plugin: ThControl) {
        this.plugin = plugin;
        this.app = plugin.app;
        this.settings = plugin.settings;

        this.loadColorStatusIcon();
    }

    loadColorStatusIcon(): void {
        this.reloadColorStatus();

        const themePickerStatusBarItem: HTMLElement = this.plugin.addStatusBarItem();

        // Toggle icon
        if(!this.settings.enableColorStatusBarIcon) return;

        const changeThemeButton: HTMLElement = themePickerStatusBarItem.createDiv({
            cls: "status-bar-item mod-clickable",
            text: this.currentColorStatus
        });

        changeThemeButton.addEventListener("click", () => {
            this.toggleColorScheme();
        });

        this.plugin.registerEvent(
            this.app.workspace.on("css-change", () => {
                this.reloadColorStatus();
                changeThemeButton.textContent = this.currentColorStatus;
            })
        );
    }

    reloadColorStatus(): void {
        if (this.settings.darkModeStringStatus.replace(/\s/g, "") === "") {
            this.settings.darkModeStringStatus = DEFAULT_SETTINGS.darkModeStringStatus;
        }
        if (this.settings.lightModeStringStatus.replace(/\s/g, "") === "") {
            this.settings.lightModeStringStatus = DEFAULT_SETTINGS.lightModeStringStatus;
        }

        this.currentColorStatus = this.isDarkMode()
            ? this.settings.lightModeStringStatus
            : this.settings.darkModeStringStatus;
    }

    isDarkMode(): boolean {
        //@ts-ignore
        return this.app.vault.getConfig("theme") === this.DARK_MODE_THEME_KEY;
    }

    toggleColorScheme(): void {
        let colorSchemeKey;

        if (this.isDarkMode()) {
            colorSchemeKey = this.LIGHT_MODE_THEME_KEY;
            this.currentColorStatus = this.settings.lightModeStringStatus;
        } else {
            colorSchemeKey = this.DARK_MODE_THEME_KEY;
            this.currentColorStatus = this.settings.darkModeStringStatus;
        }

        //@ts-ignore
        this.app.changeTheme(colorSchemeKey);
    }
}
