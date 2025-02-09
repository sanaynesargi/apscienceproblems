import requests
from bs4 import BeautifulSoup
import unicodedata
import json


def count_integers(text):
    count = 0
    for char in text:
        if char.isdigit():
            count += 1
    return count

def separate_title_code(text):
    int_start_indexes = []

    count = 0
    prev_int = False

    for i in range(len(text)):
        c = text[i]

        if c.isdigit():
            count += 1
            if not prev_int:
                int_start_indexes.append([i, 0])
                prev_int = True
        else:
            if len(int_start_indexes) > 0 and prev_int:
                int_start_indexes[-1][1] = count
            prev_int = False
            count = 0

    if len(int_start_indexes) > 0 and prev_int:
        int_start_indexes[-1][1] = count

    title_map = {}

    cursor = 0
    for idx, c in int_start_indexes:
        if c < 8:
            continue

        txt = unicodedata.normalize("NFKD", text[cursor:idx])
        cod = text[idx:idx+c]
        cursor = idx + c

        txt = txt.replace('\u200b', '')
        txt = txt.replace(':', ': ')

        if len(txt) > 0 and txt[-1] == ' ':
            txt = txt[:-1]

        if len(txt) > 0 and len(cod) > 0:
            cods = []
            if len(cod) > 8:
                for i in range(len(cod)):
                    if i % 8 == 0:
                        cods.append(cod[i:i+8])
            else:
                cods = [cod]

            title_map[txt] = cods[-1]

    return title_map


def get_div_texts(url):
    try:
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        divs = soup.find_all('div', class_='paragraph')

        texts = [div.get_text(strip=True) for div in divs]
        return texts

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching the URL: {e}")
        return []

if __name__ == "__main__":
    url = "https://apbiopenguins.weebly.com/quizizz-game-codes.html"
    div_texts = get_div_texts(url)

    lambda_count = lambda text: count_integers(text) > 3

    full_topic_map = {}

    for text in div_texts:
        if not lambda_count(text) or len(text) > 169:
            continue

        text_map = separate_title_code(text)

        for k, v in text_map.items():
            full_topic_map[k] = v

    # WARNING: Uncommenting the following code will overwrite the existing JSON file
    # WARNING: Only uncomment if you want to update the JSON file
    # WARNING: The JSON file generated will not have unit seperations- these are done manually
    overwrite = False # Change to True to overwrite the JSON file

    if overwrite:
        with open('quizizz_codes.json', 'w') as f:
            json.dump(full_topic_map, f)
    else:
        print("Safeguard: JSON file not updated. Set 'overwrite' to True to update the JSON file.")
