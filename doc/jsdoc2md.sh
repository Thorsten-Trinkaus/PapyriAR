#!/bin/bash

# Check if the directory arguments are provided.
if [ "$#" -ne 3 ]
then
    echo "Usage: $0 <input directory> <output directory> <sidebar.js>"
    exit 1
fi

# Input directory.
input=$1

# Output directory.
output=$2

# sidebar.js file.
sidebar=$3

# Check if the provided input directory is valid.
if [ ! -d "$input" ] 
then
    echo "Error: $input is not a valid directory"
    exit 1
fi

# Check if the provided input directory is valid.
if [ ! -e "$sidebar" ] 
then
    echo "Error: $sidebar does not exist."
    exit 1
fi

# Make sure output directory exists and is empty.
rm -rf "$output"
mkdir -p "$output"

# Clear the sidebar entry.
sed -i '' "/type: 'category',label: 'jsDoc',items: \[/,/};/ {
  /type: 'category',label: 'jsDoc',items: \[/b
  d
}" "$sidebar"

sed -i '' "/type: 'category',label: 'jsDoc',items: \[/a\\
    \],\},\],\};\\
    " "$sidebar"

# Recursively find all js files in the input directory
find "$input" -type f -name "*.js" | while read -r file
do
    echo "Working on $(basename $file)"

    # Execute jsdoc2md.
    md=$output/$(basename $file .js).md
    jsdoc2md $file > $md

    # Add file name as header.
    {
        printf "# $(basename $file) \n\n"
        cat "$md"
    } > temp.md

    # Remove line brakes between <dl> and </dl>.
    awk '
    /<dl>/ { inside_dl = 1; printf "%s", $0; next }
    /<\/dl>/ { inside_dl = 0; print $0; next }
    inside_dl { printf "%s", $0; next }
    { print }
    ' temp.md > $md

    # Remove empty files.
    if [ $(wc -l < "$md") -eq 2 ]
    then
        rm $md
    else
        # Add file to the sidebar entry.
        sed -i '' "/type: 'category',label: 'jsDoc',items: \[/a\\
        \"$(basename $output)/$(basename $md .md)\",\\
        " "$sidebar"
    fi

    # Remove temp file.
    rm temp.md
done



