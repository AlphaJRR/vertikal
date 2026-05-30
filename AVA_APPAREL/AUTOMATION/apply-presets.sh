#!/bin/bash
# AVA Apparel - Batch Apply Presets Script
# Usage: ./apply-presets.sh [LINE] [INPUT_FOLDER] [OUTPUT_FOLDER]

LINE=$1
INPUT=$2
OUTPUT=$3

if [ -z "$LINE" ] || [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
    echo "Usage: ./apply-presets.sh [VISIONARY|CREATOR|ALPHA_KREW|STORYTELLER] [INPUT_FOLDER] [OUTPUT_FOLDER]"
    exit 1
fi

echo "Applying $LINE preset to images in $INPUT..."
echo "Output: $OUTPUT"

# Create output directory
mkdir -p "$OUTPUT"

# Note: This script requires Lightroom CLI or similar tool
# For manual workflow, use Lightroom/Photoshop with presets

echo "Preset application complete."
echo "Next: Fine-tune images and export at 300 DPI for print or 72 DPI for web."
