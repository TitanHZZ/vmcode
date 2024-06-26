import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDefinitionProvider('vasm', new VasmDefinitionProvider()));
}

class VasmDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        const range = document.getWordRangeAtPosition(position); // get word size
        const word = document.getText(range); // get the actual word
        const text = document.getText();

        // find the label definition in the source code
        const labelRegex = new RegExp(`${word}:`, 'gm');
        const aliasRegex = new RegExp(`%(alias|string|res|include)\\s+${word}`, 'gm');
        let match;

        while ((match = labelRegex.exec(text)) !== null || (match = aliasRegex.exec(text)) !== null) {
            // get the definition position
            const matchPosition = document.positionAt(match.index);

            // get the range from the start to end of the definition
            const matchRange = new vscode.Range(matchPosition, matchPosition.translate(0, match[0].length));

            return new vscode.Location(document.uri, matchRange);
        }

        return null;
    }
}
