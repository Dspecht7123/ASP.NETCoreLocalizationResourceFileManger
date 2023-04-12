import * as vscode from 'vscode';
import { TranslationFile } from './TranslationFile';

export declare type readResxFilesCallback = (combinedFiles: ITranslationFile[], currentPanel: vscode.WebviewPanel | undefined) => void;

export interface resxJson {
    [key: string]: string,
    "value": string
}

export interface ITranslationFile {
    addTranslations(translationFile: TranslationFile): unknown;
    "path": vscode.Uri,
    "name": string, 
    "languageCodes": string[],
    "translations": translation[],
    "checked": boolean
}

export interface translation {
    key: string, 
    specificTranslations: specificTranslation[]
}

export interface specificTranslation {
    "language": string, 
    "value": resxJson
}