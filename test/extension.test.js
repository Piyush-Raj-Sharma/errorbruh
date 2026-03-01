const assert = require('assert');
const vscode = require('vscode');

suite('ErrorBruh Extension Test Suite', () => {

	test('Extension should be present', () => {
		const extension = vscode.extensions.getExtension('yourpublisher.errorbruh');
		assert.ok(extension);
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('yourpublisher.errorbruh');
		await extension.activate();
		assert.strictEqual(extension.isActive, true);
	});

});