#!/bin/bash
name=$(grep -oP '"Id":\s*"[^"]*' ./metadata.json | grep -oP '[^"]*$')
kpackagetool6 --type=KWin/Script --install . || kpackagetool6 --type=KWin/Script --upgrade .
kwriteconfig6 --file kwinrc --group Plugins --key "$name"Enabled true
qdbus6 org.kde.KWin /KWin reconfigure
