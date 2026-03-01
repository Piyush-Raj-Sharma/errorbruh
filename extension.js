const vscode = require("vscode");
const path = require("path");
// const player = require("play-sound")({});
const sound = require("sound-play");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("Error Sounds extension is now active!");

  // Helper function to play the specific sound file
  function playSound(audioFileName) {
	if (!audioFileName || audioFileName === "none") return;

	// Build the absolute path to the sound file in your 'sounds' folder
	const soundPath = path.join(context.extensionPath, "sounds", audioFileName);

	console.log("TRYING TO PLAY SOUND AT PATH:", soundPath);

	// player.play(soundPath, function (err) {
	//   if (err) console.error("Could not play sound:", err);
	// });

	// Use the new sound-play library
		sound.play(soundPath).catch((err) => {
			console.error("Could not play sound:", err);
		});
  }

  // ==========================================
  // 1. TERMINAL FAILURE LISTENER
  // ==========================================
  const terminalListener = vscode.window.onDidEndTerminalShellExecution(
	(event) => {
	  const config = vscode.workspace.getConfiguration("errorSounds");
	  const chosenSound = config.get("terminalSoundChoice");

	  // Play the sound if the command failed AND the user didn't pick "none"
	  if (
		chosenSound !== "none" &&
		event.exitCode !== undefined &&
		event.exitCode !== 0
	  ) {
		playSound(chosenSound);
	  }
	},
  );

  // ==========================================
  // 2. IDE DIAGNOSTICS (SYNTAX ERROR) LISTENER
  // ==========================================
  let lastSoundTime = 0;
  const COOLDOWN_MS = 5000; // 5-second anti-spam delay

  const diagnosticsListener = vscode.languages.onDidChangeDiagnostics(
	(event) => {
	  const config = vscode.workspace.getConfiguration("errorSounds");
	  const chosenSound = config.get("ideSoundChoice");

	  if (chosenSound === "none") return;

	  const now = Date.now();
	  // Prevent spamming the sound if errors occur back-to-back
	  if (now - lastSoundTime < COOLDOWN_MS) return;

	  let hasNewErrors = false;

	  // Loop through the files that VS Code just checked
	  for (const uri of event.uris) {
		const diagnostics = vscode.languages.getDiagnostics(uri);
		// Filter to only look at severe ERRORS (ignore warnings/info)
		const errors = diagnostics.filter(
		  (d) => d.severity === vscode.DiagnosticSeverity.Error,
		);

		if (errors.length > 0) {
		  hasNewErrors = true;
		  break; // Stop looking once we find at least one error
		}
	  }

	  if (hasNewErrors) {
		playSound(chosenSound);
		lastSoundTime = now; // Reset the cooldown timer
	  }
	},
  );

  // Register listeners so VS Code can clean them up if the extension is disabled
  context.subscriptions.push(terminalListener, diagnosticsListener);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
