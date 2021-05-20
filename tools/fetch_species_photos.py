from typing import List
import requests
from requests.models import HTTPError
import json
import time
import urllib
import os


def get_search_url(species: str) -> str:
    params = {'q': species, 'page': 1, 'exact': True}
    return "https://eol.org/api/search/1.0.json?" + urllib.parse.urlencode(params)


def get_objects_url(id: int) -> str:
    return f'https://eol.org/api/pages/1.0/{id}.json?details=true&images_per_page=10'


def fetch_species_id(species: str) -> int:

    try:
        url = get_search_url(species)
        response = requests.get(url)
        response.raise_for_status()

        json = response.json()
        id = 0
        for res in json['results']:
            if res['title'].upper() == species.upper():
                id = res['id']
                break
        return id
    except HTTPError as http_err:
        print(f'HTTP error: {http_err}')
    except Exception as err:
        print(f'Error: {err}')


def fetch_data_objects(eol_id: int) -> str:

    try:
        response = requests.get(get_objects_url(eol_id))
        response.raise_for_status()

        json = response.json()

        return json['taxonConcept']['dataObjects']

    except HTTPError as http_err:
        print(f'HTTP error: {http_err}')
    except Exception as err:
        print(f'Error: {err}')


if __name__ == '__main__':

    data = json.load(open('./tools/newspecies.json', 'r'))
    missing_ids = open('./tools/missing.txt', 'w+')

    for tree in data[1:20]:
        new_dir = './assets/species/' + tree['ID']
        if not os.path.isdir(new_dir):
            os.mkdir(new_dir)

        eol_id = fetch_species_id(tree['SCIENTIFIC'])

        if eol_id == 0:
            missing_ids.write(tree['SCIENTIFIC']+'\n')
            continue
        else:
            print(f'found id: {eol_id}')

        images = fetch_data_objects(eol_id)

        for image in images:
            image_path = new_dir+'/'+image['identifier'].replace('/', '_')
            if not os.path.isdir(image_path):
                os.mkdir(image_path)

            with open(image_path + '/info.json', 'w') as outfile:
                json.dump(image, outfile, indent=2, ensure_ascii=False)

            thumb_file = image_path + '/thumb.' + image['dataSubtype']
            urllib.request.urlretrieve(image['eolThumbnailURL'], thumb_file)

            image_file = image_path + '/full.' + image['dataSubtype']
            urllib.request.urlretrieve(image['eolMediaURL'], image_file)

        time.sleep(1)

    missing_ids.close()
