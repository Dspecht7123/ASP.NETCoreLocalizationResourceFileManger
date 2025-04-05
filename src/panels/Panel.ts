// file: src/panels/HelloWorldPanel.ts

import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "./getNonce";
import { FileManager } from "../FileManager";
import { ITranslationFile } from "../types";

export class Panel {
  public static currentPanel: Panel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private _context: vscode.ExtensionContext;

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, context.extensionUri);
    this._setWebviewMessageListener(this._panel.webview);
    this._context = context;
  }

  public static render(context: vscode.ExtensionContext) {
    if (Panel.currentPanel) {
      Panel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel("resourcemanager", "Resource Manager", vscode.ViewColumn.One, {
        // Enable javascript in the webview
        enableScripts: true,
        // Restrict the webview to only load resources from the `out` directory
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'out')
        ]
      });

      Panel.currentPanel = new Panel(panel, context);
    }
  }
  public dispose() {
    Panel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "main.js"]);
    const styleUri = getUri(webview, extensionUri, ["out", "style.css"]);
    const codiconsUri = getUri(webview, extensionUri, ["out", "codicon.css"]);
    const nonce = getNonce();
    
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; font-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}'";>
          <link rel="stylesheet" href="${styleUri}">
          <link href="${codiconsUri}" rel="stylesheet" />
        </head>
        <body>
          <h2>Available Paths:</h2>
          <vscode-dropdown id="paths" name="paths">
          </vscode-dropdown>
          <hr>
          <h2>Translations:</h2>
          <vscode-button id="saveButton">Save</vscode-button>
          <div class="tscroll">
            <table id="table">
              <thead>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
          <div class="action-row">
            <vscode-text-field id="keyInputField" placeholder="please enter a key value">Add key:</vscode-text-field>
            <div class="search-box">
              <vscode-text-field type="text" id="searchBox" class="search-box-inner" placeholder="please enter the searched key value">Key Search:</vscode-text-field>
            </div>
          </div>
          <vscode-button id="addKeyButton">Add</vscode-button>
        <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }
  
  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;
        const text = message.text;
        
        let customLanguages = vscode.workspace.getConfiguration('aspNetLocResManager').specialLanguageCodes.split('/');
        let fileManager = new FileManager(this._context, this.getUris(), this._panel, customLanguages);
        switch (command) {
          case "message":
            vscode.window.showInformationMessage(text);
            return;
          case "opened":
            fileManager.readResxFiles(Panel.walkFilesFinished);
            return;
          case "update":
            fileManager.save(message.json);
              return;
          case "pathSelected":
            Panel.saveKeyValuePairToWorkspaceState(this._context, "selectedPath", text)
        }
      },
      undefined,
      this._disposables
    );
  }

  private getUris(): vscode.Uri[] {
    var uris: vscode.Uri[] = [];
    if(vscode.workspace.workspaceFolders != undefined) {
      for(var path of vscode.workspace.workspaceFolders) {
        uris.push(vscode.Uri.file(path.uri.path));
      }
      return uris;
    }
    return uris;
  }

  public static walkFilesFinished(combinedFiles: ITranslationFile[], selectedPath: string | undefined, currentPanel: vscode.WebviewPanel | undefined) {
		console.log(combinedFiles);
		if (currentPanel !== undefined) {
			currentPanel.webview.postMessage({ 
        command: 'receivedata',
        message: combinedFiles,
        selectedPath: selectedPath
      });
		}
	}

  public static retrieveKeyValuePairFromWorkspaceState(context: vscode.ExtensionContext, key: string): string | undefined {
    if(context != undefined) {
      const workspaceState = context.workspaceState;
      return workspaceState.get('aspNetLocResManager' + key);
    } else {
      vscode.window.showErrorMessage('Workspace state is not available.');
    }
  }

  public static saveKeyValuePairToWorkspaceState(context: vscode.ExtensionContext, key: string, value: any): void {
    if(context != undefined) {
      const workspaceState = context.workspaceState;

      workspaceState.update('aspNetLocResManager' + key, value);
    } else {
      vscode.window.showErrorMessage('Workspace state is not available.');
    }
  }

  
}