# with open('chips.csv', encoding='utf-8') as infile, open('chips_with_id.csv', 'w', encoding='utf-8') as outfile:
#     lines = infile.readlines()
#     # Vervang de header
#     header = lines[0].strip()
#     if not header.startswith('ID,'):
#         outfile.write('ID,' + header + '\n')
#         start = 1
#     else:
#         outfile.write(header + '\n')
#         start = 0
#     for idx, line in enumerate(lines[1:], 1):
#         outfile.write(f"{idx},{line.strip()}\n")

# with open('chips1.csv', encoding='utf-8') as infile, open('chips2.csv', 'w', encoding='utf-8') as outfile:
#     lines = infile.readlines()
#     # Write header unchanged
#     outfile.write(lines[0])
#     for line in lines[1:]:
#         parts = line.strip().split(',')
#         if len(parts) >= 6:
#             parts[5] = parts[5].replace('\\', '/')
#         outfile.write(','.join(parts) + '\n')

# import csv
# with open('chips2.csv', encoding='utf-8', newline='') as infile, \
#      open('chips3.csv', 'w', encoding='utf-8', newline='') as outfile:
#     reader = csv.reader(infile)
#     writer = csv.writer(outfile, quoting=csv.QUOTE_MINIMAL)
#     header = next(reader)
#     writer.writerow(header)
#     for row in reader:
#         if len(row) > 7:
#             last = row[7]
#             # Add quotes if not already quoted
#             if not (last.startswith('"') and last.endswith('"')):
#                 row[7] = f'"{last}"'
#         writer.writerow(row)

import csv

with open('chips4.csv', encoding='utf-8', newline='') as infile, \
     open('chips4_quoted.csv', 'w', encoding='utf-8', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile, quoting=csv.QUOTE_MINIMAL)
    header = next(reader)
    writer.writerow(header)
    for row in reader:
        if len(row) > 7:
            last = row[7]
            # Only add quotes if not already quoted
            if not (last.startswith('"') and last.endswith('"')):
                # Escape any embedded quotes
                last = last.replace('"', '""')
                row[7] = f'"{last}"'
        writer.writerow(row)