#!/bin/bash

# Set the desired new value for "opensheetmusicdisplay"
new_value="file:opensheetmusicdisplay.min.js"

# Specify the path to the package.json file
package_json_path="/Users/dilipharish/software-projects/skynote-17042023/skynote-node/client-jb/package.json"

# Specify the source folder to copy from
source_folder="/Users/dilipharish/software-projects/opensheetmusicdisplay"

# Specify the destination folder (node_modules within client_jb)
destination_folder="/Users/dilipharish/software-projects/skynote-17042023/skynote-node/client-jb/node_modules"

# new changes
# Modify the "opensheetmusicdisplay" value in package.json
if [[ -f $package_json_path ]]; then
    sed -i "s/\"opensheetmusicdisplay\": \"1\.7\.5\"/\"opensheetmusicdisplay\": \"$new_value\"/g" $package_json_path
    echo "package.json updated successfully."
else
    echo "package.json file not found."
    exit 1
fi

# Copy the contents from the source folder to the destination folder
if [[ -d $source_folder ]]; then
    cp -R $source_folder/* $destination_folder/
    echo "Contents copied to node_modules in client_jb successfully."
else
    echo "Source folder not found."
    exit 1
fi
