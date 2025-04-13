import * as vscode from "vscode";


export function retrieveKeyValuePairFromWorkspaceState(context: vscode.ExtensionContext, key: string): string | undefined {
    if(context != undefined) {
        const workspaceState = context.workspaceState;
        return workspaceState.get('aspNetLocResManager' + key);
    } else {
        vscode.window.showErrorMessage('Workspace state is not available.');
    }
}

export function saveKeyValuePairToWorkspaceState(context: vscode.ExtensionContext, key: string, value: any): void {
    if(context != undefined) {
        const workspaceState = context.workspaceState;

        workspaceState.update('aspNetLocResManager' + key, value);
    } else {
        vscode.window.showErrorMessage('Workspace state is not available.');
    }
}