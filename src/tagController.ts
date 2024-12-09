import { App, Notice } from "obsidian";
import ThControl from "./main";
import { IThControlSettings } from "./settings/settings";

export class TagController {
    private app: App;
    private plugin: ThControl;
    private settings: IThControlSettings;

    constructor(plugin: ThControl) {
        this.plugin = plugin;
        this.app = plugin.app;
        this.settings = plugin.settings;
        this.load();
    }

    load(): void {
        this.plugin.registerEvent(
            this.app.workspace.on("file-open", async (file) => {
                if (file === null) return;
                let frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    
                if (frontmatter === undefined) {
                    new Notice("No frontmatter")
                    return;
                }
    
                let tags = frontmatter.tags;
    
                let bestMatch: { theme: string; color: boolean } | null = null;
    
                
                for (let tag of tags) {
                    for (let config of this.settings.tagThemesArr) {
                        new Notice("Revisando: " + tag + ": " + config.internalContent)
                        if (tag === config.internalContent) {
                            
                            bestMatch = {
                                theme: config.theme,
                                color: config.color
                            };
                            break;
                        }
                    }
                    if (bestMatch) break;
                }
    
                if (bestMatch) {
                    //@ts-ignore
                    this.app.customCss.setTheme(bestMatch.theme);
                    //@ts-ignore
                    this.app.changeTheme(
                        bestMatch.color
                            ? this.plugin.colorStatusBar.DARK_MODE_THEME_KEY
                            : this.plugin.colorStatusBar.LIGHT_MODE_THEME_KEY
                    );
                } else {
                    
                }
            })
        );
    }    
}