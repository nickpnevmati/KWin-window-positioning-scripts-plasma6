#!/bin/bash

# get plugin info
name=$(basename "$PWD")
version=$(grep -oP '"Version":\s*"[^"]*' ./metadata.json | grep -oP '[^"]*$')
echo "$name"' v'"$version"

# generate changelog in markdown format
heading_md=$([[ $version == *.0 ]] && echo '#' || echo '##')
caption_md="${heading_md}"' v'"${version}"
changes_md=$(cat CHANGELOG.txt)
echo "$caption_md"$'\n'"$changes_md"$'\n\n'"$(cat CHANGELOG.md)" > "CHANGELOG.md"
echo 'generated changelog markdown'

# generate changelog in bbcode format
heading_bb=$([[ $version == *.0 ]] && echo "h1" || echo "h2")
caption_bb='['"$heading_bb"']v'"$version"'[/'"$heading_bb"']'
changes_bb=$'[list]\n'"$(cat CHANGELOG.txt | sed 's/- /[*] /g')"$'\n[/list]'
echo "$caption_bb"$'\n'"$changes_bb"$'\n\n'"$(cat CHANGELOG.bbcode)" > "CHANGELOG.bbcode"
echo 'generated changelog bbcode'

# generate kwinscript package
find . -name "*.kwinscript" -type f -delete
zip -rq "${name}"'_v'"${version}"'.kwinscript'  \
	contents \
	metadata.json \
    install.sh \
    uninstall.sh \
    README.md \
    README.bbcode \
	CHANGELOG.md \
	CHANGELOG.bbcode \
	LICENSE
echo 'generated kwinscript package'

echo 'done'
