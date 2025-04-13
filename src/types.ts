import * as vscode from 'vscode';
import { TranslationFile } from './TranslationFile';

export declare type readResxFilesCallback = (combinedFiles: ITranslationFile[], selectedPath: string | undefined, currentPanel: vscode.WebviewPanel | undefined) => void;

export interface resxJson {
    [key: string]: string
}

export interface ITranslationFile {
    addTranslations(translationFile: TranslationFile): unknown;
    "path": vscode.Uri,
    "name": string, 
    "languageCodes": string[],
    "translations": ITranslation[],
    "checked": boolean
}

export interface ITranslation {
    added: boolean;
    key: string, 
    specificTranslations: ISpecificTranslation[]
}

export interface ISpecificTranslation {
    "language": string, 
    "value": string,
    "comment": string
}