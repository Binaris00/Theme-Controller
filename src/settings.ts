import { PluginSettingTab, App, Setting } from "obsidian";
import ThControl from "./main";

export interface IThControlSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: IThControlSettings = {
	mySetting: 'default'
};

export class ThControlSettingTab extends PluginSettingTab {
	plugin: ThControl;

	constructor(app: App, plugin: ThControl) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}

