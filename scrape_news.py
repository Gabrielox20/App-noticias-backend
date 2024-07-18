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

        title = soup.find('meta', property='og:title')
        description = soup.find('meta', property='og:description')
        published_at = soup.find('meta', property='article:published_time')
        url_to_image = soup.find('meta', property='og:image')
        source = soup.find('meta', property='og:site_name')

        title = title['content'] if title else 'No title'
        description = description['content'] if description else 'No description'
        published_at = published_at['content'] if published_at else datetime.utcnow().isoformat() + 'Z'
        url_to_image = url_to_image['content'] if url_to_image else None
        source = source['content'] if source else 'No source'

        # Normalizar published_at al formato ISO 8601 si no lo está
        if not published_at.endswith('Z'):
            try:
                published_at = datetime.strptime(published_at, "%d/%m/%Y %H:%M:%S").isoformat() + 'Z'
            except ValueError:
                published_at = datetime.utcnow().isoformat() + 'Z'

        logging.debug(f"Fetched article details: {title}, {description}, {published_at}, {source}")

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
        return {
            'title': 'Error',
            'description': f"Failed to fetch details: {str(e)}",
            'url': article_url,
            'urlToImage': None,
            'publishedAt': datetime.utcnow().isoformat() + 'Z',
            'source': 'Error'
        }

def get_football_news(league):
    try:
        url = f"https://www.bing.com/news/search?q={league}&qft=interval%3d%224%22&form=PTFTNR"
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.find_all('a', {'class': 'title'})
        logging.debug(f"Scraping URL: {url}")

        article_urls = []
        for article in articles:
            if len(article_urls) >= 10:
                break
            link = article['href']
            article_urls.append(link)

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
