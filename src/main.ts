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

        this.registerEvent(
            this.app.workspace.on("file-open", async (file) => {
                if (file === null) return;
                
                let path = this.pathController.onFileOpen(file);
                let tag = this.tagController.onFileOpen(file);

                if(!path && !tag) 
                    this.defaultThemeCheck();
            })
        );
        
    }

    defaultThemeCheck(){
        if(this.settings.defaultTheme.replace(/\s/g, "") !== "" && this.settings.defaultEnabled){
            //@ts-ignore
            this.app.customCss.setTheme(this.settings.defaultTheme);
            
            //@ts-ignore
            this.app.changeTheme(
                this.settings.defaultColor
                   ? "obsidian"
                    : "moonstone"
            );
        }
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