import { App, CachedMetadata, getAllTags } from "obsidian";
import * as path from "path";

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

export function getThemes(): any[] {
    //@ts-ignore
    return ["None", ...Object.keys(this.app.customCss.themes), ...this.app.customCss.oldThemes];
}

export function isPathInside(basePath: string, targetPath: string): number {
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

export function getTags(app: App): string[]{
    const tagsCache: string[] = [];

    for (const tfile of app.vault.getMarkdownFiles()) {
        let currentCache!: CachedMetadata;
        const cache = app.metadataCache.getFileCache(tfile);
        if (cache) {
            currentCache = cache;
        }
        const relativePath: string = tfile.path;
        //let displayName: string = this.app.metadataCache.fileToLinktext(tfile, tfile.path, false);
        const currentTags: string[] = getUniqueTags(currentCache);
        if (currentTags.length !== 0) {
            for(let tag of currentTags){
                if(!tagsCache.contains(tag)) tagsCache.push(tag);
            }
        }
    }

    return tagsCache;
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