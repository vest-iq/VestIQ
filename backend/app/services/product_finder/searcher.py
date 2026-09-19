from urllib.parse import parse_qs, unquote, urlparse
import base64

import httpx
from bs4 import BeautifulSoup


SEARCH_PROVIDERS = [
    "duckduckgo",
    "bing",
]


# Domains that should NEVER become product candidates.
BLOCKED_DOMAINS = {
    "youtube.com",
    "facebook.com",
    "instagram.com",
    "pinterest.com",
    "reddit.com",
    "wikipedia.org",
    "dictionary.com",
    "cambridge.org",
    "merriam-webster.com",
    "oxfordlearnersdictionaries.com",
    "britannica.com",
    "healthline.com",
    "sagepub.com",
    "sage.com",
    "sageone.com",
    "oliveboard.in",
    "oliveliving.com",
}


# Ecommerce domains we explicitly want to search.
ECOMMERCE_DOMAINS = {
    "myntra.com",
    "amazon.in",
    "amazon.com",
    "flipkart.com",
    "ajio.com",
    "nykaafashion.com",
    "tatacliq.com",
    "meesho.com",
    "hm.com",
    "zara.com",
}


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/140.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def get_hostname(url: str) -> str | None:
    try:
        hostname = urlparse(url).hostname

        if not hostname:
            return None

        return hostname.lower()

    except Exception:
        return None


def is_blocked_domain(hostname: str) -> bool:
    hostname = hostname.lower()

    for blocked in BLOCKED_DOMAINS:

        if hostname == blocked:
            return True

        if hostname.endswith("." + blocked):
            return True

    return False


def is_ecommerce_domain(hostname: str) -> bool:
    hostname = hostname.lower()

    for domain in ECOMMERCE_DOMAINS:

        if hostname == domain:
            return True

        if hostname.endswith("." + domain):
            return True

    return False


def is_candidate_url(url: str) -> bool:
    try:
        parsed = urlparse(url)

        if parsed.scheme not in {"http", "https"}:
            return False

        hostname = parsed.hostname

        if not hostname:
            return False

        hostname = hostname.lower()

        if is_blocked_domain(hostname):
            return False

        return True

    except Exception:
        return False


def decode_bing_url(value: str) -> str | None:

    if not value:
        return None

    try:
        value = unquote(value)

        if not value.startswith("a1"):
            return None

        encoded = value[2:]

        padding = "=" * (-len(encoded) % 4)

        decoded = base64.urlsafe_b64decode(
            encoded + padding
        )

        destination = decoded.decode(
            "utf-8",
            errors="ignore",
        ).strip()

        if not destination:
            return None

        if not is_candidate_url(destination):
            return None

        return destination

    except Exception:
        return None


def unwrap_search_url(url: str) -> str | None:

    try:

        parsed = urlparse(url)

        hostname = (
            parsed.hostname or ""
        ).lower()

        query = parse_qs(parsed.query)

        # DuckDuckGo redirect
        for key in ("uddg", "url"):

            if key in query:

                destination = unquote(
                    query[key][0]
                )

                if is_candidate_url(destination):
                    return destination

                return None

        # Bing redirect
        if (
            hostname == "www.bing.com"
            or hostname.endswith(".bing.com")
        ):

            if "u" in query:

                return decode_bing_url(
                    query["u"][0]
                )

            return None

        # Other redirect formats
        for key in (
            "target",
            "dest",
            "destination",
        ):

            if key in query:

                destination = unquote(
                    query[key][0]
                )

                if is_candidate_url(destination):
                    return destination

                return None

        if is_candidate_url(url):
            return url

        return None

    except Exception:
        return None


def looks_like_search_or_category_url(
    url: str,
) -> bool:

    lowered = url.lower()

    blocked_patterns = [
        "/search",
        "/search?",
        "?q=",
        "?query=",
        "/category/",
        "/categories/",
        "/collections/",
        "/login",
        "/signin",
        "/sign-in",
        "/register",
        "/account",
        "/help",
        "/about",
        "/contact",
    ]

    return any(
        pattern in lowered
        for pattern in blocked_patterns
    )


def looks_like_homepage(url: str) -> bool:

    parsed = urlparse(url)

    path = parsed.path.rstrip("/")

    return path == ""


def build_ecommerce_queries(
    query: str,
) -> list[str]:

    ecommerce_sites = [
        "site:myntra.com",
        "site:ajio.com",
        "site:nykaafashion.com",
        "site:tatacliq.com",
        "site:meesho.com",
        "site:hm.com",
        "site:zara.com",
    ]

    queries = []

    # First use direct ecommerce searches.
    for site in ecommerce_sites:
        queries.append(
            f"{query} {site}"
        )

    return queries


def search_duckduckgo(
    query: str,
    limit: int,
) -> list[str]:

    url = (
        "https://html.duckduckgo.com/html/"
    )

    try:

        with httpx.Client(
            headers=HEADERS,
            timeout=15,
            follow_redirects=True,
        ) as client:

            response = client.get(
                url,
                params={"q": query},
            )

            response.raise_for_status()

    except httpx.HTTPError:

        return []

    soup = BeautifulSoup(
        response.text,
        "html.parser",
    )

    results = []

    links = soup.select(
        "a.result__a"
    )

    if not links:

        links = soup.select(
            "a[href]"
        )

    for link in links:

        href = link.get("href")

        if not href:
            continue

        href = unwrap_search_url(href)

        if not href:
            continue

        hostname = get_hostname(href)

        if not hostname:
            continue

        if not is_ecommerce_domain(hostname):
            continue

        if looks_like_search_or_category_url(
            href
        ):
            continue

        if looks_like_homepage(href):
            continue

        if href not in results:

            results.append(href)

        if len(results) >= limit:
            break

    return results


def search_bing(
    query: str,
    limit: int,
) -> list[str]:

    url = "https://www.bing.com/search"

    try:

        with httpx.Client(
            headers=HEADERS,
            timeout=15,
            follow_redirects=True,
        ) as client:

            response = client.get(
                url,
                params={"q": query},
            )

            response.raise_for_status()

    except httpx.HTTPError:

        return []

    soup = BeautifulSoup(
        response.text,
        "html.parser",
    )

    results = []

    links = soup.select(
        "li.b_algo h2 a"
    )

    if not links:

        links = soup.select(
            "h2 a[href]"
        )

    for link in links:

        href = link.get("href")

        if not href:
            continue

        href = unwrap_search_url(href)

        if not href:
            continue

        hostname = get_hostname(href)

        if not hostname:
            continue

        if not is_ecommerce_domain(hostname):
            continue

        if looks_like_search_or_category_url(
            href
        ):
            continue

        if looks_like_homepage(href):
            continue

        if href not in results:

            results.append(href)

        if len(results) >= limit:
            break

    return results


def search_products(
    query: str,
    limit: int = 10,
) -> list[str]:

    for provider in SEARCH_PROVIDERS:

        if provider == "duckduckgo":

            results = search_duckduckgo(
                query,
                limit,
            )

        elif provider == "bing":

            results = search_bing(
                query,
                limit,
            )

        else:

            results = []

        if results:
            return results

    return []


def discover_products(
    search_terms: list[str],
    results_per_query: int = 5,
    max_total_results: int = 20,
) -> list[str]:

    all_urls = []

    # Only use the strongest semantic queries.
    for query in search_terms[:5]:

        ecommerce_queries = (
            build_ecommerce_queries(query)
        )

        for ecommerce_query in ecommerce_queries:

            query_results = search_products(
                query=ecommerce_query,
                limit=results_per_query,
            )

            for url in query_results:

                if url not in all_urls:

                    all_urls.append(url)

                if len(all_urls) >= max_total_results:

                    return all_urls

    return all_urls