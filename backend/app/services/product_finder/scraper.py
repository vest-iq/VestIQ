import httpx


DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 "
        "(Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/140.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,"
        "application/xml;q=0.9,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
}


def fetch_page(
    url: str,
) -> tuple[str | None, dict]:

    metadata = {
        "url": url,
        "final_url": url,
        "status_code": None,
        "content_type": None,
        "content_length": 0,
        "html_length": 0,
        "success": False,
        "error": None,
    }

    try:

        with httpx.Client(
            headers=DEFAULT_HEADERS,
            timeout=20,
            follow_redirects=True,
        ) as client:

            response = client.get(url)

        metadata["status_code"] = (
            response.status_code
        )

        metadata["final_url"] = str(
            response.url
        )

        metadata["content_type"] = (
            response.headers.get(
                "content-type",
                "",
            )
        )

        metadata["content_length"] = len(
            response.content
        )

        if response.status_code != 200:

            metadata["error"] = (
                f"HTTP {response.status_code}"
            )

            return None, metadata

        content_type = (
            metadata["content_type"]
            or ""
        ).lower()

        if "text/html" not in content_type:

            metadata["error"] = (
                "Response is not HTML"
            )

            return None, metadata

        html = response.text

        metadata["html_length"] = len(
            html
        )

        if len(html) < 500:

            metadata["error"] = (
                "HTML response is unusually small"
            )

            return None, metadata

        metadata["success"] = True

        return html, metadata

    except httpx.TimeoutException:

        metadata["error"] = (
            "Request timed out"
        )

        return None, metadata

    except httpx.HTTPError as exc:

        metadata["error"] = str(exc)

        return None, metadata

    except Exception as exc:

        metadata["error"] = str(exc)

        return None, metadata