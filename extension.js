const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * Approximate tokenizer for AI models (GPT, Claude, etc.)
 * - Counts words, numbers, and symbols as separate tokens.
 */
function estimateTokens(text) {
    return text
        .replace(/[\s]+/g, ' ') // Normalize spaces
        .match(/[\w]+|[^\s\w]/g)?.length || 0; // Count words & symbols
}

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

        // Get user input for folders to scan
        const folderSelections = await vscode.window.showInputBox({
            prompt: 'Enter folders to scan (comma-separated, relative to workspace root)',
            value: 'lib'
        });
        if (!folderSelections) return;

        // Get user input for file extensions
        const extensionSelections = await vscode.window.showInputBox({
            prompt: 'Enter file extensions to merge (comma-separated, e.g., .dart, .js, .ts)',
            value: '.dart'
        });
        if (!extensionSelections) return;

        // Ask if user wants to split by tokens or merge into one file
        const splitChoice = await vscode.window.showQuickPick(
            ["Merge into one file", "Split based on token limit"],
            { placeHolder: "Choose how to merge files" }
        );

        if (!splitChoice) return;
        let splitByTokens = splitChoice === "Split based on token limit";

        let maxTokens = 0;
        if (splitByTokens) {
            const tokenLimitInput = await vscode.window.showInputBox({
                prompt: 'Enter max token count per file (Enter 0 for one file)',
                value: '4000'
            });
            if (!tokenLimitInput || isNaN(tokenLimitInput)) {
                vscode.window.showErrorMessage('Invalid token limit.');
                return;
            }
            maxTokens = parseInt(tokenLimitInput);

            // ✅ Fix: If user enters "0", force single file mode
            if (maxTokens === 0) {
                splitByTokens = false;
            }
        }

        // Resolve paths
        const targetFolders = folderSelections.split(',').map(folder => path.join(workspaceFolders[0].uri.fsPath, folder.trim()));
        const mergeFolder = path.join(workspaceFolders[0].uri.fsPath, 'merge');

        // ✅ Ensure the merge folder exists
        if (!fs.existsSync(mergeFolder)) {
            fs.mkdirSync(mergeFolder, { recursive: true });
        }

        let mergedContent = '';
        let fileIndex = 1;

        function readFiles(dir) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    readFiles(fullPath);
                } else if (extensionSelections.split(',').some(ext => file.endsWith(ext.trim()))) {
                    const fileContent = fs.readFileSync(fullPath, 'utf-8');
                    mergedContent += `// File: ${fullPath}\n` + fileContent + '\n\n';

                    if (splitByTokens && estimateTokens(mergedContent) > maxTokens) {
                        saveMergedFile();
                    }
                }
            });
        }

        function saveMergedFile(forceSingleFile = false) {
            if (mergedContent.trim().length === 0) return;

            // ✅ Guaranteed Single File Mode
            const outputFile = (!splitByTokens || forceSingleFile)
                ? path.join(mergeFolder, `merged.txt`)  // ✅ Always `merged.txt` if tokens = 0
                : path.join(mergeFolder, `merged_${fileIndex}.txt`); // Otherwise, multiple files

            fs.writeFileSync(outputFile, mergedContent);
            vscode.window.showInformationMessage(`🚀 Merged file saved at: ${outputFile}`);

            if (splitByTokens) {
                mergedContent = '';
                fileIndex++;
            }
        }

        targetFolders.forEach(folder => readFiles(folder));
        saveMergedFile(true);  // ✅ Ensures final merged file is saved

        vscode.window.showInformationMessage(`✅ Files merged successfully! Check the "merge/" folder.`);
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
