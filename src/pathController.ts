import { App, Notice } from "obsidian";
import ThControl from "./main";
import { IThControlSettings } from "./settings/settings";
import * as path from "path";

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
                    const depth = this.isPathInside(value.internalContent, file.path);
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

    getThemes(): any[] {
        //@ts-ignore
        return ["None", ...Object.keys(this.app.customCss.themes), ...this.app.customCss.oldThemes];
    }

    isPathInside(basePath: string, targetPath: string): number {
        const normalizedBase = path.resolve(basePath);
        const normalizedTarget = path.resolve(targetPath);

        if (normalizedTarget.startsWith(normalizedBase + path.sep)) {
            const baseParts = normalizedBase.split(path.sep);
            const targetParts = normalizedTarget.split(path.sep);

            let depth = 0;
            for (let i = 0; i < baseParts.length; i++) {
                if (baseParts[i] === targetParts[i]) {
                    depth++;
                } else {
                    break;
                }
            }
            return depth;
        }

        return 0;
    }

}

export class ThemeValues {
    internalContent: string;
    theme: string;
    // I mean, this is obvius but... true: light and false: dark
    color: boolean;

    constructor(internalContent: string, theme: string, color: boolean) {
        this.internalContent = internalContent;
        this.theme = theme;
        this.color = color;
    }
}
