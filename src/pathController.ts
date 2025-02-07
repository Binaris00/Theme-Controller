import { App, TFile, Plugin } from 'obsidian';
import ThControl from "./main";
import { IThControlSettings } from "./settings/settings";
import * as path from 'path-browserify';

export class PathController {
    private app: App;
    private plugin: ThControl;
    private settings: IThControlSettings;

    constructor(plugin: ThControl) {
        this.plugin = plugin;
        this.app = plugin.app;
        this.settings = plugin.settings;
    }

    onFileOpen(file: TFile): boolean {
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
                    ? "obsidian"
                    : "moonstone"
            );
            return true;
        }

        return false;
    }
}


export function isPathInside(basePath: string, targetPath: string): number {
    let normalizedBase = basePath
    let normalizedTarget = targetPath

    if(!app.isMobile){
        normalizedBase = path.resolve(basePath);
        normalizedTarget = path.resolve(targetPath);    
    }
    
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

