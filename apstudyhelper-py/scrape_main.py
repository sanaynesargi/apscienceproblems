from bs4 import BeautifulSoup
import requests

# Function to fetch and parse HTML from a given URL
def get_html_from_webpage(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url)

        # Check for HTTP request errors
        response.raise_for_status()

        # Parse the HTML content with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        return soup
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the webpage: {e}")
        return None

# Extract and store content of all divs with a specific class
def extract_div_contents_with_class(soup, class_name):
    extracted_data = []

    if soup:
        # Find all divs with the specified class
        divs = soup.find_all('div', class_=class_name)

        for index, div in enumerate(divs, start=1):
            # Skip the first few if needed
            if index < 5:
                continue

            try:
                # Extract the <p> tag content
                p_content = div.find('p').get_text(strip=True) if div.find('p') else None

                # Extract the <ul> with its <li> contents
                ul = div.find('ul')
                li_links = []
                if ul:
                    for li in ul.find_all('li'):
                        # Extract the <a> tag within each <li>
                        a_tag = li.find('a')
                        if a_tag:
                            li_links.append({
                                'text': a_tag.get_text(strip=True),
                                'href': a_tag.get('href')
                            })

                    # Store the extracted structure
                    extracted_data.append({
                        'p_content': p_content,
                        'li_links': li_links
                    })
            except Exception as e:
                print(f"Error processing div #{index}: {e}")

    return extracted_data


def get_main_page_data(subject):
    # Example usage
    url = f"https://www.iitianacademy.com/ap-{subject}-mcqs-and-free-response-exam-style-practice-question-and-answer/"
    html_content = get_html_from_webpage(url)

    if html_content:
        data = extract_div_contents_with_class(html_content, "elementor-widget-container")
        for index, entry in enumerate(data, start=1):
            print(f"Div #{index}:")
            print(f"P Content: {entry['p_content']}")
            print("List Items:")
            for li in entry['li_links']:
                print(f"  Text: {li['text']}, Href: {li['href']}")
            print("-" * 50)

    return data
