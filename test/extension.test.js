const vscode = require("vscode");
const path = require("path");
const player = require("play-sound")({});

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "errorbruh" is now active!');

  // Function to play sound based on user settings
  function playSound(audioFileName = "fahhhhhhhhhhhhhh.mp3") {
    if (audioFileName === "none" || !audioFileName) return; 
	// Don't play any sound if "none" is selected or if the value is falsy

	//builds the path to the audio file based on the extension's directory and the selected audio file name
	const soundPath = path.join(context.extensionPath, "sounds", audioFileName);

	player.play(soundPath, function(err){
		if(err) console.error("Could not play sound", err);
	});
  }


}
