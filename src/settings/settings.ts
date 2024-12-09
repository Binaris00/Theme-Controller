import { PluginSettingTab, App, Setting, Notice, TFolder } from "obsidian";
import ThControl from "../main";
import { getTags, ThemeValues } from 'src/theme_utils';
import { GenericTextSuggester } from "./suggesters/genericTextSuggester";
import { PathThemeModal, TagThemeModal } from "src/components/modals";
import { getThemes } from "src/theme_utils";

export interface IThControlSettings {
	enableColorStatusBarIcon: boolean;
	darkModeStringStatus: string;
	lightModeStringStatus: string;

	pathThemesArr: Array<ThemeValues>
	pathFolderDummy: string;
	pathThemeDummy: string;
	pathColorDummy: boolean;

	tagThemesArr: Array<ThemeValues>
	tagStrDummy: string;
	tagThemeDummy: string;
	tagColorDummy: boolean;
}

export const DEFAULT_SETTINGS: IThControlSettings = {
	enableColorStatusBarIcon: true,
	darkModeStringStatus: '🌕',
	lightModeStringStatus: '🔆',
	pathThemesArr: [new ThemeValues("ExampleFolder/InsideFolder/", "None", true)],
	pathFolderDummy: '',
	pathThemeDummy: '',
	pathColorDummy: true,

	tagThemesArr: [new ThemeValues("Example", "None", true)],
    tagStrDummy: '',
    tagThemeDummy: '',
    tagColorDummy: true,
};

export class ThControlSettingTab extends PluginSettingTab {
	plugin: ThControl;

	constructor(app: App, plugin: ThControl) {
		super(app, plugin);
		this.plugin = plugin;
	}

	public display(): void {
		const { containerEl } = this;

		containerEl.empty();

		this.statusBarIcon(containerEl);
		this.pathControl(containerEl);
		this.renderPathThemeList(containerEl, this.plugin.settings)
		this.tagControl(containerEl);
		this.renderTagThemeList(containerEl, this.plugin.settings)
	}


	statusBarIcon(container: HTMLElement): void{
		new Setting(container)
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
			
		new Setting(container)
			.setName('Dark Mode String Status')
			.setDesc('Set any text-emoji to display the dark status! Need to enable Color Status Bar Icon')
			.addText(text => text
				.setPlaceholder('🌕')
				.setValue(this.plugin.settings.darkModeStringStatus)
				.onChange(async (value) => {
					this.plugin.settings.darkModeStringStatus = value;
					await this.plugin.saveSettings();
				}));
		

		new Setting(container)
			.setName('Light Mode String Status')
			.setDesc('Set any text-emoji to display the light status! Need to enable Color Status Bar Icon')
			.addText(text => text
				.setPlaceholder('🔆')
				.setValue(this.plugin.settings.lightModeStringStatus)
				.onChange(async (value) => {
					this.plugin.settings.lightModeStringStatus = value;
					await this.plugin.saveSettings();
				})
			);
	}


	pathControl(container: HTMLElement): void{
		new Setting(container).setHeading().setName("Theme by Path").setDesc("This option has lower priority than the Tag Controller");

		let themes: string[] = getThemes();

		let settingAdd = new Setting(container).setName('Add a new path').setDesc('set the path, theme and color scheme, after that, select the add button');
		settingAdd.addText((text) => {
			text.setPlaceholder('ExampleFolder/InsideFolder/')
			text.onChange(async (value) => {
				this.plugin.settings.pathFolderDummy = value;
				await this.plugin.saveSettings();
			})

			new GenericTextSuggester(
				this.app,
				text.inputEl,
				this.app.vault
					.getAllLoadedFiles()
					.filter((f) => f instanceof TFolder && f.path !== "/")
					.map((f) => f.path)
			);
		})


		settingAdd.addDropdown((dropDown) => {
			for(let theme of themes){
				dropDown.addOption(theme, theme);
			}
			dropDown.setValue(" ");

			dropDown.onChange(async (value) => {
				this.plugin.settings.pathThemeDummy = value;
				await this.plugin.saveSettings();
			})
		})

		settingAdd.addDropdown(dropDown => dropDown
			.addOption("Light", "Light")
			.addOption("Dark", "Dark")
			.setValue("Dark")
			.onChange(async (value) => {
				this.plugin.settings.pathColorDummy = value.toLowerCase() === "dark" ? true : false
				await this.plugin.saveSettings();
			})
		)

		settingAdd.addButton(button => button
			.setButtonText("Add")
			.onClick(async () => {
				if(this.plugin.settings.pathFolderDummy.replace(/\s/g, "") !== "" 
				&& this.plugin.settings.pathThemeDummy.replace(/\s/g, "") !== ""){
					this.plugin.settings.pathThemesArr.push(new ThemeValues(
						this.plugin.settings.pathFolderDummy,
						this.plugin.settings.pathThemeDummy,
						this.plugin.settings.pathColorDummy
					))
					new Notice("Added successfully")

					this.plugin.settings.pathFolderDummy, this.plugin.settings.pathThemeDummy = ''
					this.plugin.settings.pathColorDummy = true;
					await this.plugin.saveSettings();
					this.display();
				} else {
					new Notice("Please fill in all fields");
				}
			})
		)
	}



	private renderPathThemeList(element: HTMLElement, settings: IThControlSettings): void {
		const list = element.createEl('ul', { cls: ('thcontrol-theme-list'), attr: { 'data-index': -1 } });

		settings.pathThemesArr.forEach(value => {
			const groupItem = list.createEl('li', {
				cls: [('thcontrol-li-list')]
			});

			this.renderElementPathTheme(groupItem, value);
		})
	  }

	  private renderElementPathTheme(element: HTMLElement, value: ThemeValues){
		const listInfo = element.createDiv({ cls: ('thcontrol-theme-info') });
		listInfo.createSpan({ text: value.internalContent, cls: ('thcontrol-info-left') });

		listInfo.createSpan({ text: value.theme, cls: ('thcontrol-info-center') });

		listInfo.createSpan({ text: value.color === true ? "Dark" : "Light", cls: ('path-theme-info-center') });


		const buttonsDiv = listInfo.createDiv();

		let buttons = new Setting(buttonsDiv)
		buttons.addButton((button) => {
		  button.setIcon("settings")
		  button.onClick(async () =>{
			let modal = new PathThemeModal(this.app, this.plugin, value);
			const newCallback = () => {
				this.display();
			}
			modal.callback = newCallback;
			modal.open();
		  })
		})

		buttons.addButton((button) => {
		  button.setIcon("trash-2")
		  button.onClick(async () =>{
			this.plugin.settings.pathThemesArr.remove(value);
			await this.plugin.saveSettings();
			this.display();
		  })
		})
	}

	private tagControl(container: HTMLElement): void {
		new Setting(container).setHeading().setName("Theme by Tag").setDesc("This option has more priority than the Path Controller")

		let themes: string[] = getThemes();

		let settingAdd = new Setting(container).setName('Add a new tag').setDesc('set the tag, theme and color scheme, after that, select the add button');
		settingAdd.addText((text) => {
			text.setPlaceholder('ExampleTag')
			text.onChange(async (value) => {
				this.plugin.settings.tagStrDummy = value;
				await this.plugin.saveSettings();
			})

			new GenericTextSuggester(
				this.app,
				text.inputEl,
				getTags(this.app),
			);
		})


		settingAdd.addDropdown((dropDown) => {
			for(let theme of themes){
				dropDown.addOption(theme, theme);
			}
			dropDown.setValue(" ");

			dropDown.onChange(async (value) => {
				this.plugin.settings.tagThemeDummy = value;
				await this.plugin.saveSettings();
			})
		})

		settingAdd.addDropdown(dropDown => dropDown
			.addOption("Light", "Light")
			.addOption("Dark", "Dark")
			.setValue("Dark")
			.onChange(async (value) => {
				this.plugin.settings.tagColorDummy = value.toLowerCase() === "dark" ? true : false
				await this.plugin.saveSettings();
			})
		)

		settingAdd.addButton(button => button
			.setButtonText("Add")
			.onClick(async () => {
				if(this.plugin.settings.tagStrDummy.replace(/\s/g, "") !== "" 
				&& this.plugin.settings.tagThemeDummy.replace(/\s/g, "") !== ""){
					this.plugin.settings.tagThemesArr.push(new ThemeValues(
						this.plugin.settings.tagStrDummy,
						this.plugin.settings.tagThemeDummy,
						this.plugin.settings.tagColorDummy
					))
					new Notice("Added successfully")

					this.plugin.settings.tagStrDummy, this.plugin.settings.tagThemeDummy = ''
					this.plugin.settings.tagColorDummy = true;
					await this.plugin.saveSettings();
					this.display();
				} else {
					new Notice("Please fill in all fields");
				}
			})
		)
	}

	private renderTagThemeList(element: HTMLElement, settings: IThControlSettings): void {
		const list = element.createEl('ul', { cls: ('thcontrol-theme-list'), attr: { 'data-index': -1 } });

		settings.tagThemesArr.forEach(value => {
			const groupItem = list.createEl('li', {
				cls: [('thcontrol-li-list')]
			});

			this.renderElementTagTheme(groupItem, value);
		})
	  }

	  private renderElementTagTheme(element: HTMLElement, value: ThemeValues){
		const listInfo = element.createDiv({ cls: ('thcontrol-theme-info') });
		listInfo.createSpan({ text: value.internalContent, cls: ('thcontrol-info-left') });

		listInfo.createSpan({ text: value.theme, cls: ('thcontrol-info-center') });

		listInfo.createSpan({ text: value.color === true ? "Dark" : "Light", cls: ('path-theme-info-center') });


		const buttonsDiv = listInfo.createDiv();

		let buttons = new Setting(buttonsDiv)
		buttons.addButton((button) => {
		  button.setIcon("settings")
		  button.onClick(async () =>{
			let modal = new TagThemeModal(this.app, this.plugin, value);
			const newCallback = () => {
				this.display();
			}
			modal.callback = newCallback;
			modal.open();
		  })
		})

		buttons.addButton((button) => {
		  button.setIcon("trash-2")
		  button.onClick(async () =>{
			this.plugin.settings.tagThemesArr.remove(value);
			await this.plugin.saveSettings();
			this.display();
		  })
		})
	}
}

