#!/bin/bash
# AVA Apparel - Export Print Files Script
# Converts design files to print-ready format

echo "Exporting print files..."

# Create print file directories
mkdir -p "../PRINT_FILES/FRONT"
mkdir -p "../PRINT_FILES/BACK"

echo "Print file directories created."
echo "Next steps:"
echo "1. Create front print designs (4-5\" wide, 300 DPI, PNG with transparent background)"
echo "2. Save to PRINT_FILES/FRONT/"
echo "3. Name files: AVA_VISIONARY_FRONT.png, AVA_CREATOR_FRONT.png, etc."
echo "4. Follow placement guide for dimensions"
