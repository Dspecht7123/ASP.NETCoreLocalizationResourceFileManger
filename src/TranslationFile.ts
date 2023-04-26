import { Uri } from "vscode";
import { ITranslation, ITranslationFile, resxJson } from "./types";

export class TranslationFile implements ITranslationFile {
    public path: Uri
    public fullName: string
    public name: string
    public languageCodes: string[] = []
    public translations: ITranslation[]
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

    private getTranslationsObject(object: any[], language: string): ITranslation[] {
        let translations: any[] = [];
        for (const [key, value] of Object.entries(object)) {
            let translation: ITranslation = {
                "key": key,
                "added": false,
                "specificTranslations": [{
                    "language": language,
                    "value": value
                }]
            };
            translations.push(translation);
        }
        return translations;
    }

    public addTranslations(x:ITranslationFile){
        if(this.translations.length == 0)
        {
            this.translations = x.translations;
        }else{
            let translationAdded = false;
            for (const index1 in this.translations) {
                for (const index2 in x.translations) {
                    if (this.translations[index1].key === x.translations[index2].key) {
                        this.translations[index1].specificTranslations.push(x.translations[index2].specificTranslations[0]);
                        x.translations[index2].added = true;
                    }
                }
            }
            for(const index2 in x.translations){
                if(x.translations[index2].added === false){
                    this.translations.push(x.translations[index2]);
                }
            }
        }
        this.languageCodes.push.apply(this.languageCodes, x.languageCodes);
    }
}