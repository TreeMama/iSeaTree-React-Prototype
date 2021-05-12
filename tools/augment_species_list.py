# This script reconciles our species.json data with input to iTree.

import json
import csv
import math
import argparse


# Load list of trees in iSeaTree as JSON
def load_json(filename: str, c: [], b: [], o: [], a:[]):
    print(f'Loading {filename}.')

    data = json.load(open(filename))
    for tree in data:
        if tree['TYPE'] == 'conifer':
            c.append(tree)
        elif tree['TYPE'] == 'broadleaf':
            b.append(tree)
        else:
            o.append(tree)
        a.append(tree)

    print(f'Species.json loaded. Found {len(c)} conifers, {len(b)} broadleaf, {len(o)} other.')


# Load iTree list as CSV and convert into a dictionary
def load_itree(filename: str, c: [], g: [], s: []):
    print(f'Loading {filename}.')
    manual_clas = {'broadleaf': [], 'conifer': []}
    with open(filename) as csv_file:
        reader = csv.reader(csv_file)
        line = 0
        for row in reader:
            line = line + 1
            if line == 1:
                continue
            if 'CLASS' in row[1]:
                c.append({'ITREEID': row[0], 'ITREECODE': row[1], 'SCIENTIFIC': row[2], 'COMMON': row[3]})
            elif 'spp' in row[3]:
                l = {'ITREEID': row[0], 'ITREECODE': row[1], 'SCIENTIFIC': row[2], 'COMMON': row[3]}
                if len(row) > 4:
                    l['TYPE'] = row[4]
                    manual_clas[row[4]].append(row[2])
                g.append(l)
            else:
                s.append({'ITREEID': row[0], 'ITREECODE': row[1], 'SCIENTIFIC': row[2], 'COMMON': row[3]})

    print(f'Loaded iTree.csv. Found {len(cls)} classes, {len(genus)} genuses, {len(species)} species.')
    print(f'Writing manual classifications to manualclassifications.txt')
    manfile = open('manualclassifications.txt', 'w+')
    manfile.write('Broadleaf:\n\n')
    manfile.writelines([s+'\n' for s in manual_clas['broadleaf']])
    manfile.write('\nConifer:\n\n')
    manfile.writelines([s+'\n' for s in manual_clas['conifer']])
    manfile.close()
    # print('Classes:', *cls, sep='\n')


# Find existing broadleaf/conifer classifications and apply them to genuses in the iTree list.
def classify_genus(tree_list: [], name: str):
    last = ''
    for tree in tree_list:
        tree_gen = tree['SCIENTIFIC'].split()[0].upper()
        if tree_gen == last:
            continue
        last = tree_gen
        # Binary search to find the matching genus
        low = 0
        high = len(genus)
        found = False
        while low <= high:
            ptr = low + math.ceil((high - low) / 2)
            if tree_gen > genus[ptr]['SCIENTIFIC'].upper():
                low = ptr + 1
            elif tree_gen < genus[ptr]['SCIENTIFIC'].upper():
                high = ptr - 1
            else:
                genus[ptr]['TYPE'] = name
                found = True
                break
        if not found:
            print(f'Genus not found: {tree_gen}')


# Apply TYPE of genus to all species of that genus
def classify_species(g: [], s: []):
    for gn in g:
        if 'TYPE' in gn.keys():
            # Binary search to find the matching species
            low = 0
            high = len(s)
            found = False
            genname = gn['SCIENTIFIC'].upper()
            while low <= high:
                ptr = low + math.ceil((high - low) / 2)
                if genname > s[ptr]['SCIENTIFIC'].split()[0].upper():
                    low = ptr + 1
                elif genname < s[ptr]['SCIENTIFIC'].split()[0].upper():
                    high = ptr - 1
                else:
                    found = True
                    break
            if found:
                while ptr > 0 and s[ptr]['SCIENTIFIC'].split()[0].upper() == genname:
                    ptr = ptr - 1
                if s[ptr]['SCIENTIFIC'].split()[0].upper() != genname:
                    ptr = ptr + 1
                while ptr < len(s) and s[ptr]['SCIENTIFIC'].split()[0].upper() == genname:
                    s[ptr]['TYPE'] = gn['TYPE']
                    ptr = ptr + 1
            else:
                print(f'Species of genus {gn["SCIENTIFIC"]} not found.')


# Add missing entries to the json structure
def add_to_json(j: [], sp: []):
    # Get the max existing ID
    j = sorted(j, key=lambda i: int(i['ID']))
    id = int(j[len(j)-1]['ID']) + 1

    # Get the entries that are new and need adding
    nw = []
    j = sorted(j, key=lambda i: i['ITREECODE'])
    sp = sorted(sp, key=lambda i: i['ITREECODE'])
    jptr = 0
    iptr = 0
    while iptr < len(sp):
        find = sp[iptr]['ITREECODE']
        while jptr < len(j) and find > j[jptr]['ITREECODE']:
            jptr = jptr + 1
        if jptr < len(j) and find != j[jptr]['ITREECODE'] and 'TYPE' in sp[iptr].keys():
            nw.append(sp[iptr])
        iptr = iptr + 1

    j = sorted(j, key=lambda i: int(i['ID']))
    print(f'j original length {len(j)}')

    for spec in nw:
        j.append({"COMMON": spec['COMMON'], "TYPE": spec['TYPE'], "SCIENTIFIC": spec['SCIENTIFIC'], "ID": str(id), "ITREECODE": spec['ITREECODE'], "ITREECODE_APPROX": 'n'})
        id = id + 1
    print(f'json now has length {len(j)}')

    with open('newspecies.json', 'w') as outfile:
        json.dump(j, outfile, indent=2, ensure_ascii=False)


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='Augment species.json file with additional species from iTree species list. Add broadleaf/conifer classifications to genuses in the iTree file by adding an extra column (append after comma).')
    parser.add_argument('jsonfile', help='Path to species.json file.')
    parser.add_argument('itreefile', help='Path to iTree species list.')
    args = parser.parse_args()

    conifer = []
    broadleaf = []
    other = []
    jsonlist = []
    load_json(args.jsonfile, conifer, broadleaf, other, jsonlist)

    # Sort on scientific name
    conifer = sorted(conifer, key=lambda i: i['SCIENTIFIC'])
    broadleaf = sorted(broadleaf, key=lambda i: i['SCIENTIFIC'])

    cls = []
    genus = []
    species = []
    load_itree(args.itreefile, cls, genus, species)
    # Sort by scientific name
    cls = sorted(cls, key=lambda i: i['SCIENTIFIC'])
    genus = sorted(genus, key=lambda i: i['SCIENTIFIC'])
    species = sorted(species, key=lambda i: i['SCIENTIFIC'])

    # print('Genuses:', *genus[:20], sep='\n')
    # print('Species:', *species[:50], sep='\n')

    print('Starting broadleaf/conifer classification.')
    classify_genus(conifer, 'conifer')
    classify_genus(broadleaf, 'broadleaf')

    classified = len([g for g in genus if 'TYPE' in g.keys()])
    print(f'Genuses classified: {classified} out of {len(genus)}.')

    print('Applying genus classifications to species')
    classify_species(genus, species)

    classified = len([s for s in species if 'TYPE' in s.keys()])
    print(f'Species classified: {classified} out of {len(species)}.')

    # Count what's left to see how we can handle it.
    remaining = {}
    for s in species:
        if 'TYPE' not in s.keys():
            genus = s['SCIENTIFIC'].split()[0].upper()
            if genus in remaining.keys():
                remaining[genus] = remaining[genus] + 1
            else:
                remaining[genus] = 1
    remaining = dict(sorted(remaining.items(), key=lambda item: item[1], reverse=True))
    print(remaining)
    print(f'Total remaining: {len(remaining)}')

    add_to_json(jsonlist, species)







