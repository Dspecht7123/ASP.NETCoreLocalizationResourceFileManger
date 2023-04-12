import { Uri } from "vscode";
import { translation, ITranslationFile, resxJson } from "./types";



export class TranslationFile implements ITranslationFile {
    public path: Uri
    public fullName: string
    public name: string
    public languageCodes: string[] = []
    public translations: translation[]
    public checked: boolean = false;

    constructor(path: Uri, name: string, content: resxJson[]) {
        this.path = path;
        this.fullName = name;
        this.name = name.substring(0, name.indexOf("."));
        this.translations = this.getTranslationsObject(content, this.getLanguageCode(name));
        this.languageCodes.push(this.getLanguageCode(name));
    }

    private getLanguageCode(fileName: string): string {
        return fileName.substring(fileName.indexOf(".") + 1, fileName.indexOf(".", fileName.indexOf(".") + 1))
    }

    private getTranslationsObject(object: resxJson[], language: string): translation[] {
        let translations: any[] = [];
        for (var key in object) {
            let translation: translation = {
                "key": key,
                "specificTranslations": [{
                    "language": language,
                    "value": object[key]
                }]
            };
            translations.push(translation);
        }
        return translations;
    }

    public addTranslations(x:ITranslationFile){
        for (const index1 in this.translations) {
            for (const index2 in x.translations) {
                if (this.translations[index1].key === x.translations[index2].key) {
                    this.translations[index1].specificTranslations.push(x.translations[index2].specificTranslations[0]);
                }
            }
        }
        this.languageCodes.push.apply(this.languageCodes, x.languageCodes);
    }
}