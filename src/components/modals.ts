import { App, Modal, Notice, Setting, TFolder } from "obsidian";
import ThControl from '../main';
import { GenericTextSuggester } from "src/settings/suggesters/genericTextSuggester";
import { ThemeValues } from 'src/theme_utils';
import { getThemes } from "src/theme_utils";

export class PathThemeModal extends Modal {
    private plugin: ThControl

    callback: () => void;

	constructor(app: App, plugin: ThControl, value: ThemeValues) {
		super(app);
        this.plugin = plugin;

        this.plugin.settings.pathFolderDummy = value.internalContent;
        this.plugin.settings.pathThemeDummy = value.theme;
        this.plugin.settings.pathColorDummy = value.color;

        this.renderInputs(value);
        this.renderButtons(value);
	}


	onOpen() {
		const {contentEl} = this;
	}

	onClose() {
		const {contentEl} = this;
        this.callback()
	}


    private renderInputs(value: ThemeValues){
		const {contentEl} = this;
        contentEl.empty();
        
        contentEl.createEl("h2", { text: "Modify the saved content" });

        const path = new Setting(contentEl).setName("Path");
        path.addText((text) => {
            text.setValue(value.internalContent);
            text.onChange(async (text) => {
                this.plugin.settings.pathFolderDummy = text;
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

        const theme = new Setting(contentEl).setName("Theme");
        let themes: string[] = getThemes();

		theme.addDropdown((dropDown) => {
			for(let theme of themes){
				dropDown.addOption(theme, theme);
			}
			dropDown.setValue(value.theme);

			dropDown.onChange(async (value) => {
				this.plugin.settings.pathThemeDummy = value;
				await this.plugin.saveSettings();
			})
		})


        const color = new Setting(contentEl).setName("Color");
        color.addDropdown(dropDown => dropDown
			.addOption("light", "Light")
			.addOption("dark", "Dark")
			.setValue(value.color ? "dark" : "light")
			.onChange(async (value) => {
				this.plugin.settings.pathColorDummy = value.toLowerCase() === "dark" ? true : false
				await this.plugin.saveSettings();
			})
		)
    }

    renderButtons(value: ThemeValues) {
        const { contentEl } = this;

        const buttons = new Setting(contentEl);
        
        buttons.addButton((button) => {
            button.setButtonText('Submit');
            button.setCta();
            button.onClick(async () => {

                if(this.plugin.settings.pathFolderDummy.replace(/\s/g, "") !== "" 
				&& this.plugin.settings.pathThemeDummy.replace(/\s/g, "") !== ""){

                    this.plugin.settings.pathThemesArr.remove(value);
                    this.plugin.settings.pathThemesArr.push(new ThemeValues(
                        this.plugin.settings.pathFolderDummy,
                        this.plugin.settings.pathThemeDummy,
                        this.plugin.settings.pathColorDummy
                    ));
                    await this.plugin.saveSettings();
                    new Notice("Added successfully");
                    this.close();
                } else{
                    new Notice("Please fill in both the path and the theme");
                }
            })
        })

        buttons.addButton((button) => {
            button.setButtonText('Cancel');
            button.setWarning();
            button.onClick(async () => {
                this.plugin.settings.pathFolderDummy, this.plugin.settings.pathThemeDummy = ''
                this.plugin.settings.pathColorDummy = false
                await this.plugin.saveSettings();
                this.close();
            })
        })
    }
}

export class TagThemeModal extends Modal {
    private plugin: ThControl

    callback: () => void;

	constructor(app: App, plugin: ThControl, value: ThemeValues) {
		super(app);
        this.plugin = plugin;

        this.plugin.settings.tagStrDummy = value.internalContent;
        this.plugin.settings.tagThemeDummy = value.theme;
        this.plugin.settings.tagColorDummy = value.color;

        this.renderInputs(value);
        this.renderButtons(value);
	}


	onOpen() {
		const {contentEl} = this;
	}

	onClose() {
		const {contentEl} = this;
        this.callback()
	}


    private renderInputs(value: ThemeValues){
		const {contentEl} = this;
        contentEl.empty();
        
        contentEl.createEl("h2", { text: "Modify the saved content" });

        const path = new Setting(contentEl).setName("Tag");
        path.addText((text) => {
            text.setValue(value.internalContent);
            text.onChange(async (text) => {
                this.plugin.settings.tagStrDummy = text;
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

        const theme = new Setting(contentEl).setName("Theme");
        let themes: string[] = getThemes();

		theme.addDropdown((dropDown) => {
			for(let theme of themes){
				dropDown.addOption(theme, theme);
			}
			dropDown.setValue(value.theme);

			dropDown.onChange(async (value) => {
				this.plugin.settings.tagThemeDummy = value;
				await this.plugin.saveSettings();
			})
		})


        const color = new Setting(contentEl).setName("Color");
        color.addDropdown(dropDown => dropDown
			.addOption("light", "Light")
			.addOption("dark", "Dark")
			.setValue(value.color ? "dark" : "light")
			.onChange(async (value) => {
				this.plugin.settings.tagColorDummy = value.toLowerCase() === "dark" ? true : false
				await this.plugin.saveSettings();
			})
		)
    }

    renderButtons(value: ThemeValues) {
        const { contentEl } = this;

        const buttons = new Setting(contentEl);
        
        buttons.addButton((button) => {
            button.setButtonText('Submit');
            button.setCta();
            button.onClick(async () => {

                if(this.plugin.settings.tagStrDummy.replace(/\s/g, "") !== "" 
				&& this.plugin.settings.tagThemeDummy.replace(/\s/g, "") !== ""){

                    this.plugin.settings.tagThemesArr.remove(value);
                    this.plugin.settings.tagThemesArr.push(new ThemeValues(
                        this.plugin.settings.tagStrDummy,
                        this.plugin.settings.tagThemeDummy,
                        this.plugin.settings.tagColorDummy
                    ));
                    await this.plugin.saveSettings();
                    new Notice("Added successfully");
                    this.close();
                } else{
                    new Notice("Please fill in both the tag and the theme");
                }
            })
        })

        buttons.addButton((button) => {
            button.setButtonText('Cancel');
            button.setWarning();
            button.onClick(async () => {
                this.plugin.settings.tagStrDummy, this.plugin.settings.tagThemeDummy = ''
                this.plugin.settings.tagColorDummy = false
                await this.plugin.saveSettings();
                this.close();
            })
        })
    }

}