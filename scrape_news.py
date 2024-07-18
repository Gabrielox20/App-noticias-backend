import requests
from bs4 import BeautifulSoup
import json
import sys
import time
from datetime import datetime
import logging

# Configurar logging
logging.basicConfig(filename='logfile.log', level=logging.DEBUG, format='%(asctime)s %(levelname)s:%(message)s')


def fetch_article_details(article_url):
    try:
        response = requests.get(article_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        title = soup.find('meta', property='og:title')['content'] if soup.find('meta', property='og:title') else 'No title'
        description = soup.find('meta', property='og:description')['content'] if soup.find('meta', property='og:description') else 'No description'
        published_at = soup.find('meta', property='article:published_time')['content'] if soup.find('meta', property='article:published_time') else datetime.utcnow().isoformat() + 'Z'
        url_to_image = soup.find('meta', property='og:image')['content'] if soup.find('meta', property='og:image') else None
        source = soup.find('meta', property='og:site_name')['content'] if soup.find('meta', property='og:site_name') else 'No source'

        # Normalizar published_at al formato ISO 8601 si no lo está
        if not published_at.endswith('Z'):
            try:
                published_at = datetime.strptime(published_at, "%d/%m/%Y %H:%M:%S").isoformat() + 'Z'
            except ValueError:
                published_at = datetime.utcnow().isoformat() + 'Z'

        return {
            'title': title,
            'description': description,
            'url': article_url,
            'urlToImage': url_to_image,
            'publishedAt': published_at,
            'source': source
        }
    except Exception as e:
        logging.error(f"Error fetching article details for URL {article_url}: {e}")
        return None

def resolve_google_news_url(google_news_url):
    try:
        response = requests.get(google_news_url)
        response.raise_for_status()
        return response.url
    except Exception as e:
        logging.error(f"Error resolving Google News URL {google_news_url}: {e}")
        return google_news_url

def get_football_news(league):
    try:
        url = f"https://news.google.com/search?q=%22{league}%22%20when%3A1h&hl=es-419&gl=CL&ceid=CL%3Aes-419"
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.find_all('article')
        logging.debug(f"Scraping URL: {url}")

        article_urls = []
        for article in articles:
            if len(article_urls) >= 20:
                break
            link = 'https://news.google.com' + article.find('a')['href'][1:] if article.find('a') else 'No link'
            resolved_url = resolve_google_news_url(link)
            article_urls.append(resolved_url)

        news_data = []
        for url in article_urls:
            article_details = fetch_article_details(url)
            if article_details:  # Only include articles without errors
                news_data.append(article_details)
            time.sleep(1)

        return json.dumps(news_data, indent=4)

    except Exception as e:
        logging.error(f"Error fetching news for league {league}: {e}")
        return json.dumps({'message': 'Error fetching news', 'error': str(e)}, indent=4)

if __name__ == "__main__":
    league = sys.argv[1] if len(sys.argv) > 1 else 'LaLiga'
    news_json = get_football_news(league)
    print(news_json)
