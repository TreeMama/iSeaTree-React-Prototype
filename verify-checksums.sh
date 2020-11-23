# !/bin/sh

CONFIG_FILE="envVariables.ts"

if [ ! -f "$CONFIG_FILE" ]
then
  echo "\n******\nYou do not have a copy of ${CONFIG_FILE}, which defines the database configuration.\n\nPlease contact an admin for a copy before building.\n******"
  exit 1
fi

# After changing envVariables.ts, recreate the checksum file with this command:
#     shasum -p -a 512 envVariables.ts > checksums.txt
# Commit checksums.txt to git. Do not commit envVariables.ts.

if ! shasum -s -p -a 512 --check checksums.txt; then
    echo "Your copy of $CONFIG_FILE is out of date. Please obtain the current version from a project administrator."
    exit 1
fi
