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