import { App, Notice } from "obsidian";
import ThControl from "./main";
import { IThControlSettings } from "./settings/settings";
import { isPathInside } from "./theme_utils";

export class PathController {
    private app: App;
    private plugin: ThControl;
    private settings: IThControlSettings;

    constructor(plugin: ThControl) {
        this.plugin = plugin;
        this.app = plugin.app;
        this.settings = plugin.settings;
        this.load();
    }

    load() {
        this.plugin.registerEvent(
            this.app.workspace.on("file-open", async (file) => {
                if (file?.path === undefined) return;

                let bestMatch: { theme: string; color: boolean } | null = null;
                let maxDepth = 0;

                for (let value of this.settings.pathThemesArr) {
                    const depth = isPathInside(value.internalContent, file.path);
                    if (depth > maxDepth) {
                        maxDepth = depth;
                        bestMatch = value;
                    }
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
                    //new Notice("No matching theme found for: " + file.path);
                }
            })
        );
    }
}
