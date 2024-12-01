import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, IThControlSettings, ThControlSettingTab } from './settings';

export default class ThControl extends Plugin {
	settings: IThControlSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new ThControlSettingTab(this.app, this));
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
