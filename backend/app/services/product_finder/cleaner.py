import re
from urllib.parse import (
    parse_qsl,
    urlencode,
    urlparse,
    urlunparse,
)

from app.schemas.product_finder import (
    ProductResult,
)


# ============================================================
# URL CLEANING
# ============================================================

TRACKING_PARAMETERS = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
    "msclkid",
    "ref",
    "ref_",
}


# ============================================================
# CLOTHING KEYWORDS
# ============================================================

CLOTHING_KEYWORDS = {
    # Indian / ethnic clothing
    "kurti",
    "kurtis",
    "kurta",
    "kurtas",
    "salwar",
    "anarkali",
    "lehenga",
    "saree",
    "sari",
    "dupatta",
    "churidar",

    # Dresses
    "dress",
    "dresses",
    "gown",
    "maxi",
    "midi",
    "mini",

    # Tops
    "top",
    "shirt",
    "shirts",
    "tshirt",
    "t-shirt",
    "blouse",
    "tunic",

    # Bottoms
    "skirt",
    "skirts",
    "jeans",
    "pants",
    "trousers",
    "shorts",

    # One-piece clothing
    "jumpsuit",
    "romper",

    # Outerwear
    "jacket",
    "jackets",
    "coat",
    "coats",
    "blazer",
    "blazers",
    "hoodie",
    "hoodies",
    "sweater",
    "sweaters",
    "sweatshirt",
    "sweatshirts",
    "cardigan",
    "cardigans",
    "shrug",
    "vest",

    # Sets
    "co-ord",
    "coord",
    "co ord",
    "outfit",
    "apparel",
    "clothing",
}


# ============================================================
# NON-CLOTHING / ACCESSORY KEYWORDS
# ============================================================

NON_CLOTHING_KEYWORDS = {
    # Jewellery
    "necklace",
    "necklaces",
    "jewellery",
    "jewelry",
    "earring",
    "earrings",
    "bracelet",
    "bracelets",
    "bangle",
    "bangles",
    "anklet",
    "anklets",
    "pendant",

    # Eyewear
    "eyeglasses",
    "eyeglass",
    "sunglasses",
    "spectacles",

    # Bags
    "handbag",
    "handbags",
    "clutch",
    "clutches",
    "backpack",
    "backpacks",
    "wallet",
    "wallets",
    "purse",
    "purses",
    "sling bag",
    "crossbody bag",

    # Footwear
    "shoe",
    "shoes",
    "sandal",
    "sandals",
    "heel",
    "heels",
    "slipper",
    "slippers",
    "sneaker",
    "sneakers",
    "boots",
    "loafers",
    "footwear",

    # Accessories
    "watch",
    "watches",
    "belt",
    "belts",
    "scarf",
    "scarves",
    "stole",
    "stoles",
    "hairband",
    "headband",
    "cap",
    "caps",
    "hat",
    "hats",
    "brooch",

    # Beauty
    "lipstick",
    "makeup",
    "cosmetic",
    "cosmetics",
    "perfume",
    "fragrance",
}


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(
    value: str | None,
) -> str:

    if not value:
        return ""

    value = value.lower()

    value = value.replace(
        "-",
        " ",
    )

    value = value.replace(
        "_",
        " ",
    )

    return " ".join(
        value.split()
    )


# ============================================================
# KEYWORD MATCHING
# ============================================================

def find_keyword_matches(
    text: str,
    keywords: set[str],
) -> list[str]:

    normalized_text = normalize_text(
        text
    )

    matches = []

    for keyword in keywords:

        normalized_keyword = normalize_text(
            keyword
        )

        # Escape keyword so characters such as
        # "+" or "." cannot affect the regex.
        pattern = (
            r"(?<!\w)"
            + re.escape(normalized_keyword)
            + r"(?!\w)"
        )

        if re.search(
            pattern,
            normalized_text,
        ):
            matches.append(
                keyword
            )

    return matches


# ============================================================
# PRODUCT SCORE
# ============================================================

def score_product(
    product: ProductResult,
) -> tuple[
    int,
    list[str],
    list[str],
]:
    """
    Calculate how strongly a product title
    indicates clothing.

    Returns:
        score
        clothing_matches
        accessory_matches
    """

    clothing_matches = find_keyword_matches(
        product.name,
        CLOTHING_KEYWORDS,
    )

    accessory_matches = find_keyword_matches(
        product.name,
        NON_CLOTHING_KEYWORDS,
    )

    score = (
        len(clothing_matches) * 5
        - len(accessory_matches) * 10
    )

    return (
        score,
        clothing_matches,
        accessory_matches,
    )


# ============================================================
# URL NORMALIZATION
# ============================================================

def normalize_url(
    url: str,
) -> str:

    parsed = urlparse(
        url
    )

    query_params = []

    for key, value in parse_qsl(
        parsed.query,
        keep_blank_values=True,
    ):

        if key.lower() in TRACKING_PARAMETERS:
            continue

        query_params.append(
            (
                key,
                value,
            )
        )

    return urlunparse(
        (
            parsed.scheme.lower(),
            parsed.netloc.lower(),
            parsed.path.rstrip("/"),
            "",
            urlencode(
                query_params
            ),
            "",
        )
    )


# ============================================================
# PRODUCT CLEANING
# ============================================================

def clean_products(
    products: list[ProductResult],
) -> list[ProductResult]:
    """
    Clean and filter Google Lens product results.

    Pipeline:

        1. Normalize URLs
        2. Remove duplicate URLs
        3. Detect obvious accessories
        4. Remove accessory products
        5. Rank clothing products
    """

    clothing_products = []
    ambiguous_products = []

    seen_urls = set()

    for index, product in enumerate(
        products
    ):

        # ----------------------------------------------------
        # Normalize URL
        # ----------------------------------------------------

        normalized_url = normalize_url(
            product.product_url
        )

        if normalized_url in seen_urls:
            continue

        seen_urls.add(
            normalized_url
        )

        product.product_url = (
            normalized_url
        )

        product.source = urlparse(
            normalized_url
        ).netloc

        # ----------------------------------------------------
        # Analyze title
        # ----------------------------------------------------

        (
            score,
            clothing_matches,
            accessory_matches,
        ) = score_product(
            product
        )

        # ----------------------------------------------------
        # HARD FILTER
        #
        # If Lens clearly says this is an accessory,
        # remove it.
        # ----------------------------------------------------

        if accessory_matches:
            continue

        # ----------------------------------------------------
        # Clothing candidate
        # ----------------------------------------------------

        if clothing_matches:

            clothing_products.append(
                (
                    score,
                    index,
                    product,
                )
            )

        # ----------------------------------------------------
        # Ambiguous candidate
        #
        # Keep it for now because some stores have
        # terrible/non-descriptive product titles.
        # ----------------------------------------------------

        else:

            ambiguous_products.append(
                (
                    score,
                    index,
                    product,
                )
            )

    # --------------------------------------------------------
    # Rank clothing candidates
    # --------------------------------------------------------

    clothing_products.sort(
        key=lambda item: (
            item[0],
            -item[1],
        ),
        reverse=True,
    )

    # --------------------------------------------------------
    # Rank ambiguous candidates
    #
    # They go AFTER clearly identified clothing.
    # --------------------------------------------------------

    ambiguous_products.sort(
        key=lambda item: (
            item[0],
            -item[1],
        ),
        reverse=True,
    )

    return [
        item[2]
        for item in clothing_products
    ]