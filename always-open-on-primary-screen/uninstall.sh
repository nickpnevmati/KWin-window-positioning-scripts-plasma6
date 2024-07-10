#!/bin/bash
kpackagetool6 --type=KWin/Script --remove .
qdbus6 org.kde.KWin /KWin reconfigure
