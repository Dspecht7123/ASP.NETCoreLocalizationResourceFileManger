import { Uri } from "vscode";
import { ITranslation, ITranslationFile, resxJson } from "./types";

export class TranslationFile implements ITranslationFile {
    public path: Uri
    public fullName: string
    public name: string
    public languageCodes: string[] = []
    public translations: ITranslation[]
    public checked: boolean = false;
    private customLanguages: string[]

    constructor(path: Uri, name: string, content: resxJson[], customLanguages: string[]) {
        this.path = path;
        this.fullName = name;
        this.customLanguages = customLanguages;
        this.name = this.getName(name);
        this.translations = this.getTranslationsObject(content, this.getLanguageCode(name));
        this.languageCodes.push(this.getLanguageCode(name));
    }

    private getName(fileName: string): string {
        fileName = fileName.replace('.resx', '');
        let lastDotIndex = fileName.lastIndexOf('.');
        if(lastDotIndex === -1){
            return fileName;
        }else{
            let language = fileName.substring(lastDotIndex + 1, fileName.length);
            if(language.length === 2 || (language.length === 5 && language.includes('-')) || this.customLanguages.includes(language)){
                return fileName.substring(0, lastDotIndex);;
            }else{
                return fileName;
            }
        }
    }

    private getLanguageCode(fileName: string): string {
        fileName = fileName.replace('.resx', '');
        let lastDotIndex = fileName.lastIndexOf('.');
        if(lastDotIndex === -1){
            return 'natural';
        }else{
            let language = fileName.substring(lastDotIndex + 1, fileName.length);
            if(language.length === 2 || (language.length === 5 && language.includes('-')) || this.customLanguages.includes(language)){
                return language;
            }else{
                return 'natural';
            }
        }
    }

    private getTranslationsObject(object: any[], language: string): ITranslation[] {
        let translations: any[] = [];
        for (const [key, value] of Object.entries(object)) {
            let translation: ITranslation = {
                "key": key,
                "added": false,
                "specificTranslations": [{
                    "language": language,
                    "value": value.value,
                    "comment": value.comment
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