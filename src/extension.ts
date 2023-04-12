// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Panel } from './panels/Panel';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const helloCommand = vscode.commands.registerCommand("resxhelper.helloWorld", () => {
	  Panel.render(context.extensionUri);
	});
  
	context.subscriptions.push(helloCommand);
  }

// This method is called when your extension is deactivated
export function deactivate() {}
