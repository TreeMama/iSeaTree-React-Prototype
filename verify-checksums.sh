// This is a shell script that checks if the file `envVariables.ts` exists and is up to date by
// comparing its checksum with the checksums stored in `checksum-dev.txt` and `checksum-prod.txt`. If
// the file is not found or is out of date, the script displays an error message and exits with a
// status code of 1. If the file is up to date, the script displays a message indicating whether it is
// the development or production version and exits with a status code of 0. The script also includes
// instructions for project administrators on how to update the checksum files after changing
// `envVariables.ts`.


# !/bin/sh

CONFIG_FILE="envVariables.ts"

if [ ! -f "$CONFIG_FILE" ]
then
  echo "\n******\nYou do not have a copy of ${CONFIG_FILE}, which defines the database configuration.\n\nPlease contact an iSeaTree admin for a copy before building.\n******"
  exit 1
fi

# Project administrators only:
#
# After changing envVariables.ts, recreate the checksum file with one of these commands:
# If you updated the Development version of envVariables.ts:
#     shasum -a 512 envVariables.ts > checksum-dev.txt
# If you updated the Production version of envVariables.ts:
#     shasum -a 512 envVariables.ts > checksum-prod.txt
# Commit the updated checksums-dev.txt or checksums-prod.txt to git. Do not commit envVariables.ts.
#
# If you are not the project admin, do not touch checksums-dev.txt or checksums-prod.txt. Do not run shasum yourself.

if shasum -s -a 512 --check checksum-dev.txt; then
    echo "You are building with the Development version of $CONFIG_FILE."
    exit 0
fi

if shasum -s -a 512 --check checksum-prod.txt; then
    echo "You are building with the Production version of $CONFIG_FILE."
    exit 0
fi

echo "Your copy of $CONFIG_FILE is out of date. Please obtain the current version from an iSeaTree project administrator.\n"
echo "Do not regenerate either of the checksums*.txt files. This just hides the problem, and you'll still have an obsolete secrets file.\n"
echo "You must obtain the current $CONFIG_FILE, and also perform a 'git pull' to retrieve the current checksums files. See the README for further explanation.\n"
exit 1
