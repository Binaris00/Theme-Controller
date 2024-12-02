import { PluginSettingTab, App, Setting } from "obsidian";
import ThControl from "./main";

export interface IThControlSettings {
	enableColorStatusBarIcon: boolean;
	darkModeStringStatus: string;
	lightModeStringStatus: string;
}

export const DEFAULT_SETTINGS: IThControlSettings = {
	enableColorStatusBarIcon: true,
	darkModeStringStatus: '🌕',
	lightModeStringStatus: '🔆',
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
			.setName('Enable Color Status Bar Icon')
			.setDesc('Enable/Disable an icon in your status bar to switch light/dark mode! Need to reload Obsidian or the plugin' )
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.enableColorStatusBarIcon)
                toggle.onChange(async (value) => {
					this.plugin.settings.enableColorStatusBarIcon = value;
					await this.plugin.saveSettings();
                })
			}
		)
			
		new Setting(containerEl)
			.setName('Dark Mode String Status')
			.setDesc('Set any text-emoji to display the dark status! Need to enable Color Status Bar Icon')
			.addText(text => text
				.setPlaceholder('🌕')
				.setValue(this.plugin.settings.darkModeStringStatus)
				.onChange(async (value) => {
					this.plugin.settings.darkModeStringStatus = value;
					await this.plugin.saveSettings();
				}));
		

		new Setting(containerEl)
			.setName('Light Mode String Status')
			.setDesc('Set any text-emoji to display the light status! Need to enable Color Status Bar Icon')
			.addText(text => text
				.setPlaceholder('🔆')
				.setValue(this.plugin.settings.lightModeStringStatus)
				.onChange(async (value) => {
					this.plugin.settings.lightModeStringStatus = value;
					await this.plugin.saveSettings();
				}));
	}
}

