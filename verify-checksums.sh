# !/bin/sh

CONFIG_FILE="envVariables.ts"

if [ ! -f "$CONFIG_FILE" ]
then
  echo "\n******\nYou do not have a copy of ${CONFIG_FILE}, which defines the database configuration.\n\nPlease contact an iSeaTree admin for a copy before building.\n******"
  exit 1
fi

# After changing envVariables.ts, recreate the checksum file with this command:
#     shasum -a 512 envVariables.ts > checksums.txt
# Commit checksums.txt to git. Do not commit envVariables.ts.

if shasum -s -a 512 --check checksum-dev.txt; then
    echo "You are building with the Development version of $CONFIG_FILE."
    exit 0
fi

if shasum -s -a 512 --check checksum-prod.txt; then
    echo "You are building with the Production version of $CONFIG_FILE."
    exit 0
fi

echo "Your copy of $CONFIG_FILE is out of date. Please obtain the current version from an iSeaTree project administrator."
exit 1
