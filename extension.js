// Import required modules
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('all-code-one-file.mergeLibraryFiles', async function () {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found!');
            return;
        }

        const folderSelections = await vscode.window.showInputBox({
            prompt: 'Enter folders to scan (comma-separated, relative to workspace root)',
            value: 'lib'
        });
        if (!folderSelections) return;

        const extensionSelections = await vscode.window.showInputBox({
            prompt: 'Enter file extensions to merge (comma-separated, e.g., .dart, .js, .ts)',
            value: '.dart'
        });
        if (!extensionSelections) return;

        const tokenLimit = await vscode.window.showInputBox({
            prompt: 'Enter the max token count per file',
            value: '4000'
        });
        if (!tokenLimit || isNaN(tokenLimit)) return;
        const maxTokens = parseInt(tokenLimit);

        const targetFolders = folderSelections.split(',').map(folder => path.join(workspaceFolders[0].uri.fsPath, folder.trim()));
        const extensions = extensionSelections.split(',').map(ext => ext.trim());
        const outputFolder = path.join(workspaceFolders[0].uri.fsPath, 'build');

        // Ensure the build folder exists
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }

        let mergedContent = '';
        let fileIndex = 1;

        // Read all specified files from the selected folders
        function readFiles(dir) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    readFiles(fullPath);
                } else if (extensions.some(ext => file.endsWith(ext))) {
                    const fileContent = fs.readFileSync(fullPath, 'utf-8');
                    mergedContent += `// File: ${fullPath}\n` + fileContent + '\n\n';

                    if (mergedContent.length > maxTokens) {
                        const outputFile = path.join(outputFolder, `merged_${fileIndex}.txt`);
                        fs.writeFileSync(outputFile, mergedContent);
                        mergedContent = '';
                        fileIndex++;
                    }
                }
            });
        }

        targetFolders.forEach(folder => readFiles(folder));

        if (mergedContent.length > 0) {
            const outputFile = path.join(outputFolder, `merged_${fileIndex}.txt`);
            fs.writeFileSync(outputFile, mergedContent);
        }

        vscode.window.showInformationMessage(`Files merged successfully into ${outputFolder}`);
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
