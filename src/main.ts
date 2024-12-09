import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, IThControlSettings, ThControlSettingTab } from './settings/settings';
import { ColorStatusBar } from './colorStatusBar';
import { PathController } from './pathController';
import { TagController } from './tagController';

export default class ThControl extends Plugin {
    settings: IThControlSettings;

    colorStatusBar: ColorStatusBar;
    pathController: PathController;
    tagController: TagController;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new ThControlSettingTab(this.app, this));

        this.colorStatusBar = new ColorStatusBar(this);
        this.pathController = new PathController(this);
        this.tagController = new TagController(this);
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