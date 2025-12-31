#!/bin/bash
# VERTIKAL Google Drive Folder Structure Generator
# Run this script to create the folder tree, then drag 'VERTIKAL' folder to Google Drive

echo "📂 Creating VERTIKAL folder structure..."

mkdir -p VERTIKAL/00_INBOX_DROPZONE
mkdir -p VERTIKAL/01_Brand_Assets
mkdir -p VERTIKAL/02_Web_Landing_Copy
mkdir -p "VERTIKAL/03_Pitch_Decks/Investors"
mkdir -p "VERTIKAL/03_Pitch_Decks/Creators"
mkdir -p "VERTIKAL/03_Pitch_Decks/Networks"
mkdir -p "VERTIKAL/03_Pitch_Decks/Master"
mkdir -p VERTIKAL/04_Product
mkdir -p VERTIKAL/05_Legal
mkdir -p VERTIKAL/06_Growth_Market
mkdir -p VERTIKAL/07_Operations_Notes
mkdir -p VERTIKAL/99_ARCHIVE

echo "✅ Folder structure created successfully!"
echo "📁 Location: $(pwd)/VERTIKAL"
echo ""
echo "Next step: Drag the 'VERTIKAL' folder to your Google Drive"

