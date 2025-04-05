import * as vscode from 'vscode';
const resx = require('./utilities/resx/lib/index.js')
import { readResxFilesCallback } from './types';
import { ITranslationFile } from './types';
import { TranslationFile } from './TranslationFile';
import { TextEncoder } from 'util';
import { Panel } from './panels/Panel';

export class FileManager {

    private dirs: vscode.Uri[];
    private resxFiles: TranslationFile[] = [];
    private readResxFilesFinished: readResxFilesCallback = () => { };
    private combinedFiles: ITranslationFile[] = [];
    private currentPanel: vscode.WebviewPanel;
    private customLanguages: string[];
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext, dirs: vscode.Uri[], panel: vscode.WebviewPanel, customLanguages: string[]) {
        this.dirs = dirs;
        this.currentPanel = panel;
        this.customLanguages = customLanguages
        this.context = context;
    }

    public readResxFiles(cb: readResxFilesCallback) {
        this.resxFiles = [];
        this.readResxFilesFinished = cb;

        return new Promise(async (resolve, reject) => {
            for(var dir of this.dirs) {
                await this.walkFiles(dir, 0);
            }
            resolve("Success!");
            this.combineFiles();
        });
    }

    private async walkFiles(dir: vscode.Uri, index: number) {
            let readDirectoryPromise = vscode.workspace.fs.readDirectory(dir);
            let fileArray = await readDirectoryPromise;

            for (const x of fileArray) {
                if (x[1] === 2) { // this is a folder
                    await this.walkFiles(vscode.Uri.file(dir.fsPath + '/' + x[0]), index + 1);
                } else {
                    if (RegExp('^.*\.(resx)$').exec(x[0])) {
                        try {
                            let readFilePromise = vscode.workspace.fs.readFile(vscode.Uri.file(dir.fsPath + '/' + x[0]));
                            let fileUint8Array = await readFilePromise;
                            let resx2jsPromise = await resx.resx2js(fileUint8Array.toString(), true);
                            let content = await resx2jsPromise;
                            let translationFile = new TranslationFile(dir, x[0], content, this.customLanguages);
                            this.resxFiles.push(translationFile);
                        } catch (e: any) {
                            vscode.window.showErrorMessage(e.message);
                        }
                    }
                }
            }
    }

    private combineFiles() {
        this.combinedFiles = [];
        for (const x of this.resxFiles) {
            for (const y of this.resxFiles) {
                if (y !== x && x.name === y.name && y.checked === false && x.path.path === y.path.path) {
                    x.addTranslations(y);
                    y.checked = true;
                }
            }
            if (x.checked === false) {
                this.combinedFiles.push(x);
            }
            x.checked = true;
        }
        this.readResxFilesFinished(this.combinedFiles, Panel.retrieveKeyValuePairFromWorkspaceState(this.context, 'selectedPath'), this.currentPanel);
    }

    public async save(fileString: string) {
        let json = JSON.parse(fileString);
        try {
            for (let languageCode of json.languageCodes) {
                let name = '';
                if (languageCode === 'natural') {
                    name = json.name + '.resx';
                } else {
                    name = json.name + '.' + languageCode + '.resx';
                }
                let translations: any = {};
                for (let translation of json.translations) {
                    for (let specificTranslation of translation.specificTranslations) {
                        if (specificTranslation.language === languageCode) {
                            let key: string = translation.key;
                            if(specificTranslation.value !== '' && specificTranslation.comment !== undefined){
                                translations[key] = {
                                    "value": specificTranslation.value,
                                    "comment": specificTranslation.comment
                                }
                            }else if(specificTranslation.value === '' && specificTranslation.comment !== undefined){
                                translations[key] = {
                                    "value": specificTranslation.value,
                                    "comment": specificTranslation.comment
                                }
                            }else if(specificTranslation.value !== '' && specificTranslation.createdByResourceManager){
                                translations[key] = specificTranslation.value;
                            }else if(specificTranslation.value !== '' && !specificTranslation.createdByResourceManager){
                                translations[key] = specificTranslation.value;
                            }else if(specificTranslation.value === '' && !specificTranslation.createdByResourceManager){
                                translations[key] = specificTranslation.value;
                            }
                        };
                    }
                }
                let newContent = await resx.js2resx(translations);
                let uint8 = new TextEncoder().encode(newContent);
                vscode.workspace.fs.writeFile(vscode.Uri.file(json.path.fsPath + '/' + name), uint8);
            }
            vscode.window.showInformationMessage('Saved :-)');
        } catch (e: any) {
            vscode.window.showErrorMessage(e.message);
        }
    }
}
