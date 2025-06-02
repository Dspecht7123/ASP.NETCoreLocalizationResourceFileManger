import * as vscode from 'vscode';
import { retrieveKeyValuePairFromWorkspaceState } from './WorkspaceState';
const resx = require('./resx/lib/index.js')

export async function addTranslation(context: vscode.ExtensionContext) {
    const editor = vscode.window.activeTextEditor;
    if (editor != undefined) {
        const selection = editor.selection;
        let stringLiteral = editor.document.getText(selection);
    
        const key = await vscode.window.showInputBox({ prompt: 'Enter the translation key' });
        if (!key) {
            vscode.window.showErrorMessage('Translation key is required.');
            return;
        }
    
        const value = await vscode.window.showInputBox({ prompt: 'Enter the translation value', value: stringLiteral });
        if (!value) {
            vscode.window.showErrorMessage('Translation value is required.');
            return;
        }
    
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
        }
    
        const resxFilePath = retrieveKeyValuePairFromWorkspaceState(context, 'selectedPath');
        if (!resxFilePath) {
            vscode.window.showErrorMessage('No standard path selected. Run command Resource Manager to set a default path.');
            return;
        }
    
        addTranslationToResx(resxFilePath, key, value);
    } else {
        vscode.window.showErrorMessage('Editor undefined');
    }
}

async function addTranslationToResx(filePath: string, key: string, value: string) {

	let readFilePromise = vscode.workspace.fs.readFile(vscode.Uri.file(filePath + '.resx'));
	let fileUint8Array = await readFilePromise;
	let resx2jsPromise = await resx.resx2js(fileUint8Array.toString(), true);
	let content = await resx2jsPromise;

	if(content[key] != null) {
		vscode.window.showErrorMessage(`Key ${key} already exists in file ${filePath}`);
		return;
	}

	content[key] = {value: value};

	try {
		let newContent = await resx.js2resx(content);
		let uint8 = new TextEncoder().encode(newContent);
		vscode.workspace.fs.writeFile(vscode.Uri.file(filePath + '.resx'), uint8);
		vscode.window.showInformationMessage(`Translation added: ${key} = ${value}`);
	} catch (e: any) {
		vscode.window.showErrorMessage(`Failed to write to .resx file on path: ${filePath}`);
	}
}