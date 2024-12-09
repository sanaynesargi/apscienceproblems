from bs4 import BeautifulSoup
import requests

# Function to fetch and parse HTML from a given URL
def fetch_and_parse_html(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad status codes
        return BeautifulSoup(response.text, 'html.parser')
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the webpage: {e}")
        return None

# Function to extract and store div content with the specified class
def extract_and_store_div_content(soup, class_name):
    if not soup:
        return []

    div_data = []  # List to store div content and HTML
    divs = soup.find_all('div', class_=class_name)

    for index, div in enumerate(divs, start=1):
        text_content = div.get_text(strip=True)
        dets = div.find_all('details')
        details_tags = dets

        details_texts = [details.get_text(strip=True) for details in details_tags]

        # Remove <details> tag from the HTML content before storing
        for details_tag in div.find_all('details'):
            details_tag.decompose()  # Remove the <details> tag completely

        html_content = str(div)  # Get the HTML content after removing <details>

        # Store the div's data, including text content and the HTML of the details tag
        div_data.append({
            "index": index,
            "text": text_content,
            "html": html_content,
            "details_texts": details_texts
        })

    return div_data

def get_questions(url):
    # Fetch and parse HTML
    html_soup = fetch_and_parse_html(url)

    # Extract, print, and store content of divs with the specific class
    div_data = extract_and_store_div_content(html_soup, "elementor-widget-container")

    # Example: Accessing stored HTML content for a specific div
    new_divs = []
    for div in div_data:
        if not div['details_texts']:
            continue


        ans = div['details_texts'][0]
        div['answer'] = ans
        del div['details_texts']

        new_divs.append(div)

    return new_divs
