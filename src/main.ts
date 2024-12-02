import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, IThControlSettings, ThControlSettingTab } from './settings';
import { ColorStatusBar } from './colorStatusBar';

export default class ThControl extends Plugin {
    settings: IThControlSettings;
    colorStatusBar: ColorStatusBar;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new ThControlSettingTab(this.app, this));

        this.colorStatusBar = new ColorStatusBar(this);
    }

    onunload() {
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
