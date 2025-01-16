import { AbstractInputSuggest, App } from "obsidian";
import { getUniqueTags } from "src/tagController";


export class TagSuggester extends AbstractInputSuggest<string> {
    constructor(app: App, textInputEl: HTMLInputElement) {
        super(app, textInputEl);
    }

      getSuggestions(inputStr: string): string[] {
        const tagsCache: string[] = [];

        for (const tfile of this.app.vault.getMarkdownFiles()) {
            const cache = this.app.metadataCache.getFileCache(tfile);
            if (cache) {
                const currentTags: string[] = getUniqueTags(cache);
                for (const tag of currentTags) {
                    if (!tagsCache.contains(tag)) {
                        tagsCache.push(tag);
                    }
                }
            }
        }

        const lowerInput = inputStr.toLowerCase();
        return tagsCache.filter(tag => tag.toLowerCase().includes(lowerInput));
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        el.setText(value);
    }
}