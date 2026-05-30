import os
from datetime import datetime
from pathlib import Path

# Media file extensions
VIDEO_EXTENSIONS = {'.mp4', '.mov', '.avi', '.mxf', '.prores', '.r3d', '.red', '.mts', '.m2ts', '.mkv', '.flv', '.wmv', '.mpg', '.mpeg', '.webm', '.hevc', '.h264'}
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.tiff', '.tif', '.raw', '.cr2', '.nef', '.arw', '.dng', '.psd', '.ai', '.eps', '.bmp', '.gif', '.webp', '.exr', '.dpx'}
AUDIO_EXTENSIONS = {'.wav', '.aiff', '.mp3', '.aac', '.flac', '.m4a', '.wma', '.ogg'}
PROJECT_EXTENSIONS = {'.prproj', '.aep', '.fcpxml', '.davinci', '.resolve', '.ppj', '.edl', '.xml', '.fcp'}

def format_size(size_bytes):
    """Convert bytes to human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} PB"

def get_file_type(file_path):
    """Categorize file by extension"""
    ext = Path(file_path).suffix.lower()
    if ext in VIDEO_EXTENSIONS:
        return "VIDEO"
    elif ext in IMAGE_EXTENSIONS:
        return "IMAGE"
    elif ext in AUDIO_EXTENSIONS:
        return "AUDIO"
    elif ext in PROJECT_EXTENSIONS:
        return "PROJECT"
    else:
        return "OTHER"

# List of all your drives
drives = [
    "/Volumes/BAF SSD", 
    "/Volumes/BPD-03", 
    "/Volumes/ALPHA 8", 
    "/Volumes/JRRV ROYALS", 
    "/Volumes/JRRi17", 
    "/Volumes/RED128", 
    "/Volumes/RED64"
]

output_file = "AVA_MASTER_FILE_MAP.txt"
csv_file = "AVA_MASTER_FILE_MAP.csv"

# Statistics
stats = {
    'total_files': 0,
    'total_size': 0,
    'video_files': 0,
    'image_files': 0,
    'audio_files': 0,
    'project_files': 0,
    'drives_scanned': 0,
    'drives_missing': 0
}

file_entries = []

print("Starting AVA Master File Map Generation...")
print(f"Scanning {len(drives)} drives...\n")

with open(output_file, "w", encoding='utf-8') as f, open(csv_file, "w", encoding='utf-8') as csv:
    # Write headers
    f.write(f"AVA MASTER DATA MAP - Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    f.write("="*80 + "\n\n")
    
    # CSV header
    csv.write("Drive,Type,Size,Modified Date,Full Path\n")
    
    for drive_idx, drive in enumerate(drives, 1):
        print(f"[{drive_idx}/{len(drives)}] Checking: {drive}...")
        
        if os.path.exists(drive):
            stats['drives_scanned'] += 1
            f.write(f"\n{'='*80}\n")
            f.write(f"DRIVE: {drive}\n")
            f.write(f"{'='*80}\n\n")
            
            drive_files = 0
            drive_size = 0
            
            try:
                for root, dirs, files in os.walk(drive):
                    # Only go 3 levels deep to keep the map readable
                    level = root.replace(drive, '').count(os.sep)
                    if level < 3:
                        for name in files:
                            file_path = os.path.join(root, name)
                            try:
                                stat_info = os.stat(file_path)
                                file_size = stat_info.st_size
                                mod_date = datetime.fromtimestamp(stat_info.st_mtime).strftime('%Y-%m-%d %H:%M:%S')
                                file_type = get_file_type(file_path)
                                
                                # Update stats
                                stats['total_files'] += 1
                                stats['total_size'] += file_size
                                drive_files += 1
                                drive_size += file_size
                                
                                if file_type == "VIDEO":
                                    stats['video_files'] += 1
                                elif file_type == "IMAGE":
                                    stats['image_files'] += 1
                                elif file_type == "AUDIO":
                                    stats['audio_files'] += 1
                                elif file_type == "PROJECT":
                                    stats['project_files'] += 1
                                
                                # Write to text file
                                f.write(f"[{file_type:8}] {format_size(file_size):>12} | {mod_date} | {file_path}\n")
                                
                                # Write to CSV
                                csv.write(f'"{drive}","{file_type}","{file_size}","{mod_date}","{file_path}"\n')
                                
                                file_entries.append({
                                    'drive': drive,
                                    'type': file_type,
                                    'size': file_size,
                                    'date': mod_date,
                                    'path': file_path
                                })
                                
                            except (OSError, PermissionError) as e:
                                # Skip files we can't access
                                continue
                                
            except Exception as e:
                f.write(f"ERROR scanning drive: {str(e)}\n")
                print(f"  ⚠️  Error: {str(e)}")
            
            f.write(f"\n--- Drive Summary: {drive_files} files, {format_size(drive_size)} ---\n\n")
            print(f"  ✓ Found {drive_files} files ({format_size(drive_size)})")
            
        else:
            stats['drives_missing'] += 1
            f.write(f"\n{'='*80}\n")
            f.write(f"DRIVE NOT CONNECTED: {drive}\n")
            f.write(f"{'='*80}\n\n")
            print(f"  ✗ Not connected")
    
    # Write summary
    f.write(f"\n{'='*80}\n")
    f.write("SUMMARY STATISTICS\n")
    f.write(f"{'='*80}\n\n")
    f.write(f"Total Files Scanned: {stats['total_files']:,}\n")
    f.write(f"Total Data Size: {format_size(stats['total_size'])}\n")
    f.write(f"\nFile Type Breakdown:\n")
    f.write(f"  Video Files:  {stats['video_files']:,}\n")
    f.write(f"  Image Files:  {stats['image_files']:,}\n")
    f.write(f"  Audio Files:  {stats['audio_files']:,}\n")
    f.write(f"  Project Files: {stats['project_files']:,}\n")
    f.write(f"  Other Files:  {stats['total_files'] - stats['video_files'] - stats['image_files'] - stats['audio_files'] - stats['project_files']:,}\n")
    f.write(f"\nDrives Scanned: {stats['drives_scanned']}/{len(drives)}\n")
    f.write(f"Drives Missing: {stats['drives_missing']}\n")

print(f"\n{'='*80}")
print("MAP GENERATION COMPLETE")
print(f"{'='*80}")
print(f"\n✓ Text Report: {output_file}")
print(f"✓ CSV Report:  {csv_file}")
print(f"\nTotal Files: {stats['total_files']:,}")
print(f"Total Size: {format_size(stats['total_size'])}")
print(f"\nMedia Breakdown:")
print(f"  Video:  {stats['video_files']:,}")
print(f"  Image:  {stats['image_files']:,}")
print(f"  Audio:  {stats['audio_files']:,}")
print(f"  Projects: {stats['project_files']:,}")
print(f"\n💡 Tip: Open the CSV file in Excel/Numbers for easy searching and filtering!")

