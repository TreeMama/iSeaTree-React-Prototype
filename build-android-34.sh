#!/bin/bash

# Build script for Android API 34 (Android 14) targeting
# This script solves the Google Play Store requirement for Android 14 targeting

echo "Building iSeaTree Android app with API 34 targeting..."

# Set Java 8 environment (required for this older React Native version)
export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home

# Set Node.js legacy OpenSSL provider for compatibility
export NODE_OPTIONS="--openssl-legacy-provider"

echo "Using Java: $JAVA_HOME"
echo "Java version:"
$JAVA_HOME/bin/java -version

echo "Node version:"
node --version

# Clean and build
cd android
echo "Cleaning project..."
./gradlew clean

echo "Building release APK..."
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "APK location: android/app/build/outputs/apk/release/"
    ls -la app/build/outputs/apk/release/
else
    echo "Build failed. Check the logs above for details."
    exit 1
fi
