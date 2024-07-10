dirs=("always-open-on-active-screen" "always-open-on-focused-screen" "always-open-on-primary-screen")

changes=$(cat "CHANGELOG.txt")
for dirname in "${dirs[@]}"; do
    cd "$dirname"
    echo "$changes" > CHANGELOG.txt
    ./package.sh
    rm CHANGELOG.txt
    cd ..
done