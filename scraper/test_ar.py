import requests

urls_to_test = [
    "https://wavz.com.eg/ar/ai-customer-service-ethical-dilemmas/",
    "https://wavz.com.eg/ar/ai-customer-service-ethical-dilemmas-2/",
    "https://wavz.com.eg/ar/blog/"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

for url in urls_to_test:
    response = requests.get(url, headers=headers, timeout=5)
    print(f"{url} -> Status: {response.status_code}")
