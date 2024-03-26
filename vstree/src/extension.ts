// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Helloworldpanel } from './Helloworldpanel';
import { SidebarProvider } from './SidebarProvider';



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vstree" is now active!');

         const sidebarProvider = new SidebarProvider(context.extensionUri);
        
	      context.subscriptions.push(
			vscode.window.registerWebviewViewProvider("vstree-sidebar", sidebarProvider)
		);

		context.subscriptions.push(
			vscode.commands.registerCommand('vstree.helloWorld', () => {
			// vscode.window.showInformationMessage('Hello World from VSBinaryTreeVisualizer!'); 
			Helloworldpanel.createOrShow(context.extensionUri);
				})
		);
        
	context.subscriptions.push(
		vscode.commands.registerCommand("vstree.askQuestion", async () => {
			const ans = await vscode.window.showInformationMessage("How was your day?", "good", "bad");
			//showInformationMessage is a type of Thenable just like promises in javascript
			if (ans === 'bad') {
				vscode.window.showInformationMessage("sorry to hear that");
			}
			else {
				console.log({ ans });
			}
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand("vstree.refresh",async  () => {
			// Helloworldpanel.kill();
			// Helloworldpanel.createOrShow(context.extensionUri);
			await vscode.commands.executeCommand("workbench.action.closeSidebar")
			await vscode.commands.executeCommand("workbench.view.extension.vstree-sidebar-view")
			// setTimeout(() => {
			// 	vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools")
			// }, 500);
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
