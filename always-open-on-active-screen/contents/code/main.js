/*
 K Win *Script Always Open on Active Screen
 (C) 2021-2022 Natalie Clarius <natalie_clarius@yahoo.de>
 GNU General Public License v3.0
 */

// initialization
const config = {
  classList: readConfig("classList", "")
  .toLowerCase()
  .split("\n")
  .map((s) => s.trim()),
  allowMode: readConfig("allowMode", true),
  denyMode: readConfig("denyMode", false),
  debugMode: readConfig("debugMode", true)
};

function debug(...args) {
  if (config.debugMode) console.debug("alwaysopenonactivescreen:", ...args);
}

function getActiveScreen() {
  // Get the current cursor position
  var cursorPosition = workspace.cursorPos;
  debug("Mouse position: " + cursorPosition.x + ", " + cursorPosition.y);

  var screens = workspace.screens;

  for (var i = 0; i < screens.length; i++) {
      var screenGeometry = screens[i].geometry;
      if (cursorPosition.x >= screenGeometry.x &&
          cursorPosition.x < screenGeometry.x + screenGeometry.width &&
          cursorPosition.y >= screenGeometry.y &&
          cursorPosition.y < screenGeometry.y + screenGeometry.height) {
          debug("Mouse is on screen: " + i);
          return screens[i]
      }
  }
}

debug("initializing");
debug("config:", config.allowMode ? "allow" : "deny", "list", config.classList);

// when a window is added
workspace.windowAdded.connect(window => {
  // debug("window", JSON.stringify(window, undefined, 2));

  // get active screen
  var activeScreen = getActiveScreen();
  
  // abort conditions
  if (!window // null
      || (config.allowMode && config.classList.includes(String(window.resourceClass))) // using allowmode and window class is in list
      || (config.denyMode && !config.classList.includes(String(window.resourceClass))) // using denymode and window class is not in list
      || !(window.resizeable && window.moveable && window.moveableAcrossScreens) // not regeomtrizable
      || window.screen == activeScreen) // already on right screen
      return;

  // move window to active screen
  debug("sending window", window.caption, "to active screen", activeScreen);
  workspace.sendClientToScreen(window, activeScreen);

  // clip and move window into bounds of screen dimensions
  var area = workspace.clientArea(KWin.MaximizeArea, window);
  window.frameGeometry.width = Math.min(area.width, window.width);
  window.frameGeometry.height = Math.min(area.height, window.height);
  window.frameGeometry.x = Math.max(area.x, Math.min(area.x + area.width - window.width, window.x));
  window.frameGeometry.y = Math.max(area.y, Math.min(area.y + area.height - window.height, window.y));
});
