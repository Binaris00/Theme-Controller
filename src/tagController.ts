import { App, CachedMetadata, getAllTags, Notice, TFile } from "obsidian";
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
    }

    
    onFileOpen(file: TFile): boolean{
        let frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    
        if (frontmatter === undefined) {
            return false;
        }

        let tags = frontmatter.tags;
        let bestMatch: { theme: string; color: boolean } | null = null;
    
        for (let tag of tags) {
            for (let config of this.settings.tagThemesArr) {
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
                    ? "obsidian"
                    : "moonstone"
            );
            return true;
        }
        return false;
    }
}

export function getUniqueTags(currentCache: CachedMetadata): string[] {
    let currentTags: string[] = [];
    const tags = getAllTags(currentCache);
    if (tags) {
        currentTags = tags;
    }
    currentTags = currentTags.map((tag) => tag.slice(1));
    // remove duplicate tags in file
    currentTags = Array.from(new Set(currentTags));
    return currentTags;
}

export function getTags(app: App): string[] {
    const tagsCache: string[] = [];

    for (const tfile of app.vault.getMarkdownFiles()) {
        let currentCache!: CachedMetadata;
        const cache = app.metadataCache.getFileCache(tfile);
        if (cache) {
            currentCache = cache;
        }
        
        const currentTags: string[] = getUniqueTags(currentCache);
        if (currentTags.length !== 0) {
            for (let tag of currentTags) {
                if (!tagsCache.contains(tag)) tagsCache.push(tag);
            }
        }
    }

    return tagsCache;
}
