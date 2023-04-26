import * as vscode from 'vscode';
const resx = require('resx')
import { readResxFilesCallback } from './types';
import { ITranslationFile } from './types';
import { TranslationFile } from './TranslationFile';
import { TextEncoder } from 'util';

export class FileManager {

    private dir: vscode.Uri;
    private resxFiles: TranslationFile[] = [];
    private readResxFilesFinished: readResxFilesCallback = () => { };
    private combinedFiles: ITranslationFile[] = [];
    private currentPanel: vscode.WebviewPanel

    constructor(dir: vscode.Uri, panel: vscode.WebviewPanel) {
        this.dir = dir;
        this.currentPanel = panel;
    }

    public readResxFiles(cb: readResxFilesCallback) {
        this.resxFiles = [];
        this.readResxFilesFinished = cb;
        this.walkFiles(this.dir, 0);
    }

    private async walkFiles(dir: vscode.Uri, index: number) {
        return new Promise(async (resolve, reject) => {
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
                            let resx2jsPromise = await resx.resx2js(fileUint8Array.toString());
                            let content = await resx2jsPromise;
                            let translationFile = new TranslationFile(dir, x[0], content);
                            this.resxFiles.push(translationFile);
                        } catch (e: any) {
                            vscode.window.showErrorMessage(e.message);
                        }

                    }
                }
            }
            resolve("Success!");
            if (index === 0) {
                this.combineFiles();
            }
        });
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
        this.readResxFilesFinished(this.combinedFiles, this.currentPanel);
    }

    public async save(fileString: string) {
        let json = JSON.parse(fileString);
        try {
            for (let languageCode of json.languageCodes) {
                let name = json.name + '.' + languageCode + '.resx';
                let translations: any = {};
                for (let translation of json.translations) {
                    for (let specificTranslation of translation.specificTranslations) {
                        if (specificTranslation.language === languageCode) {
                            translations[translation.key] = specificTranslation.value;
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
