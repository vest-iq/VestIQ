"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  Compass,
  Heart,
  House,
  ImagePlus,
  LogOut,
  Menu,
  Search,
  Settings,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearProductSearch,
  searchProducts,
} from "@/store/productFinderSlice";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number | null;
  currency: string | null;
  image_url: string | null;
  product_url: string;
};

const navigation = [
  { label: "Home", href: "/dashboard", icon: House },
  { label: "Discover", href: "/dashboard/discover", icon: Compass },
  { label: "Stylist", href: "/dashboard/stylist", icon: Sparkles },
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function Discover() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  const {
    data: searchData,
    status: searchStatus,
    error: searchError,
  } = useAppSelector((state) => state.productFinder);

  const searching = searchStatus === "loading";

  const hasSearched =
    searchStatus === "succeeded" || searchStatus === "failed";

  const products: Product[] = (searchData?.products ?? []).map(
    (item, index) => ({
      id: `${item.product_url}-${index}`,
      name: item.name?.trim() || "Fashion product",
      brand: item.brand?.trim() || item.source || "Online store",
      category: item.category?.trim() || "Other",
      price: item.price ?? null,
      currency: item.currency || "INR",
      image_url: item.image_url || null,
      product_url: item.product_url,
    }),
  );

  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((product) => product.category)),
    ),
  ];

  // Release the local image preview URL when it is replaced or the
  // component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFile(file?: File) {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      window.alert("Please choose a JPG, PNG, or WEBP image.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      window.alert("Please choose an image smaller than 10 MB.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setCategory("All");
    setSortBy("recommended");
    setQuery("");
    dispatch(clearProductSearch());
  }

  function clearImage() {
    setPreviewUrl("");
    setSelectedFile(null);
    setCategory("All");
    setSortBy("recommended");
    setQuery("");
    dispatch(clearProductSearch());

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function runSearch() {
    if (searching) return;

    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    setCategory("All");
    setSortBy("recommended");
    setQuery("");

    void dispatch(searchProducts(selectedFile));
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const term = query.trim().toLowerCase();

      const matchesQuery =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        // Products without prices appear after priced products.
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        // Products without prices appear after priced products.
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return b.price - a.price;
      }

      return 0;
    });

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function formatPrice(price: number | null, currency: string | null) {
    if (price == null || !Number.isFinite(price)) {
      return "Price unavailable";
    }

    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
        maximumFractionDigits: 0,
      }).format(price);
    } catch {
      return `${currency || "INR"} ${price.toLocaleString("en-IN")}`;
    }
  }

  return (
    <main className="min-h-screen bg-[#070811] text-white">
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <button
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#0a0b15] px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-12 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Sparkles size={21} />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight">VestIQ</p>
                <p className="text-[10px] tracking-[0.24em] text-gray-500">
                  PERSONAL STYLE AI
                </p>
              </div>
            </Link>

            <button
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/5 lg:hidden"
            >
              <X size={19} />
            </button>
          </div>

          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.label === "Discover";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
                    active
                      ? "border border-indigo-400/15 bg-indigo-500/10 text-white"
                      : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    size={19}
                    className={
                      active
                        ? "text-indigo-400"
                        : "text-gray-500 group-hover:text-indigo-300"
                    }
                  />
                  <span className="font-medium">{item.label}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="mb-5 rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.12] to-purple-500/[0.04] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
                <Sparkles size={18} />
              </div>
              <p className="text-sm font-medium">Find your next favorite.</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Turn inspiration into your next look.
              </p>
            </div>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Settings size={18} />
              Settings
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <LogOut size={18} />
              Logout
            </Link>

            <div className="mt-4 flex items-center gap-3 border-t border-white/[0.07] pt-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-400/20 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-sm font-semibold">
                RR
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Rishika Rajput</p>
                <p className="truncate text-xs text-gray-500">
                  Personal account
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.06] bg-[#070811]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open navigation"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-white/10 p-2 text-gray-300 hover:bg-white/5 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-sm font-medium">Smart Discovery</p>
                <p className="hidden text-xs text-gray-500 sm:block">
                  Find pieces inspired by your style
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  aria-label="Notifications"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileOpen(false);
                  }}
                  className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5 text-gray-400 hover:bg-white/[0.06] hover:text-white"
                >
                  <Bell size={18} />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-[#11121e] p-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Notifications</p>
                      <button
                        aria-label="Close notifications"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        <X size={15} className="text-gray-500" />
                      </button>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-gray-400">
                      Your style discovery space is ready to explore.
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  aria-label="Open profile menu"
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/[0.05]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold">
                    RR
                  </span>
                  <ChevronDown
                    size={15}
                    className="hidden text-gray-500 sm:block"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-white/10 bg-[#11121e] p-2 shadow-2xl">
                    <div className="border-b border-white/[0.07] px-3 py-2">
                      <p className="text-sm font-medium">Rishika Rajput</p>
                      <p className="text-xs text-gray-500">Personal account</p>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      Profile &amp; settings
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            {/* Page intro */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap items-end justify-between gap-4"
            >
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-500/[0.08] px-3 py-1.5 text-xs text-indigo-300">
                  <Sparkles size={13} />
                  SMART DISCOVERY
                </div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Find your next{" "}
                  <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                    favorite.
                  </span>
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                  Upload an item you love. Discover similar fashion, explore
                  styles, and compare product prices.
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs text-gray-500 md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Image-based product discovery
              </div>
            </motion.div>

            {/* Upload panel */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="relative mt-8 overflow-hidden rounded-[26px] border border-white/[0.08] bg-gradient-to-br from-[#111323] via-[#0d0e1b] to-[#141023] p-5 sm:p-7 lg:p-8"
            >
              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-[90px]" />

              <div className="relative grid gap-7 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                    START WITH AN IMAGE
                  </p>
                  <h2 className="mt-3 text-xl font-semibold sm:text-2xl">
                    What are you looking for?
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-gray-400">
                    Choose a photo of clothing, shoes, or an accessory. We’ll
                    use it to find visually similar products.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:shadow-indigo-500/20"
                    >
                      <Upload size={17} />
                      Upload an image
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        handleFile(event.target.files?.[0]);
                      }}
                    />

                    <span className="self-center text-xs text-gray-500">
                      JPG, PNG, WEBP · Max 10 MB
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Check size={14} className="text-indigo-300" />
                      Visual similarity
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check size={14} className="text-indigo-300" />
                      Product links
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check size={14} className="text-indigo-300" />
                      Price comparison
                    </span>
                  </div>
                </div>

                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleFile(event.dataTransfer.files?.[0]);
                  }}
                  className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-indigo-300/25 bg-[#080914]/70 p-5 text-center transition hover:border-indigo-300/50 sm:min-h-[250px]"
                >
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Selected clothing"
                        className="absolute inset-0 h-full w-full object-contain p-5"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-[#080914]/90 px-4 py-3 backdrop-blur-md">
                        <p className="truncate text-xs text-gray-300">
                          {selectedFile?.name}
                        </p>
                        <button
                          onClick={clearImage}
                          className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                          aria-label="Remove selected image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-500/10 text-indigo-300">
                        <ImagePlus size={25} />
                      </div>
                      <p className="mt-4 text-sm font-medium">
                        Drop your image here
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        or click Upload an image
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
                <p className="text-xs leading-5 text-gray-500">
                  Best results: use a clear image with the item visible.
                </p>
                <button
                  disabled={searching}
                  onClick={runSearch}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20 disabled:cursor-wait disabled:opacity-60"
                >
                  {searching ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200/30 border-t-indigo-200" />
                      Searching products...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Find similar products
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </motion.section>

            {/* Search loading */}
            {searching && (
              <section
                aria-live="polite"
                className="mt-10 rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.04] px-5 py-12 text-center"
              >
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-indigo-300/20 border-t-indigo-300" />
                <h2 className="mt-4 text-lg font-medium">
                  Finding similar products
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  We’re checking the image for visually similar fashion items.
                  This may take a little while.
                </p>
              </section>
            )}

            {/* Results */}
            {hasSearched && !searching ? (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10"
              >
                {searchStatus === "failed" ? (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-6 sm:p-8"
                  >
                    <h2 className="text-xl font-semibold text-red-200">
                      Product search failed
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      {searchError ||
                        "Something went wrong while searching for products."}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Check that your backend is running. If the error
                      persists, the visual search provider may be temporarily
                      unavailable.
                    </p>
                    <button
                      onClick={runSearch}
                      disabled={!selectedFile}
                      className="mt-5 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm text-red-200 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                          YOUR DISCOVERY RESULTS
                        </p>
                        <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                          Similar styles to explore
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                          {searchData?.cached
                            ? "Showing cached visual search results."
                            : "Products found through visual search."}{" "}
                          {searchData?.products_found ?? 0} results found.
                        </p>
                      </div>

                      <button
                        onClick={clearImage}
                        className="text-sm text-gray-400 transition hover:text-white"
                      >
                        Start a new search
                      </button>
                    </div>

                    {products.length > 0 && (
                      <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {categories.map((item) => (
                            <button
                              key={item}
                              onClick={() => setCategory(item)}
                              className={`shrink-0 rounded-xl border px-4 py-2.5 text-xs font-medium transition ${
                                category === item
                                  ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-200"
                                  : "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="relative flex min-w-0 flex-1 items-center sm:min-w-[220px]">
                            <Search
                              size={16}
                              className="absolute left-3.5 text-gray-500"
                            />
                            <input
                              value={query}
                              onChange={(event) =>
                                setQuery(event.target.value)
                              }
                              placeholder="Search results..."
                              aria-label="Search products"
                              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-indigo-400/40"
                            />
                          </div>

                          <label className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-xs text-gray-400">
                            <SlidersHorizontal size={15} />
                            <span className="sr-only">Sort products</span>
                            <select
                              value={sortBy}
                              onChange={(event) =>
                                setSortBy(event.target.value)
                              }
                              className="max-w-[155px] bg-transparent text-gray-300 outline-none"
                            >
                              <option
                                value="recommended"
                                className="bg-[#11121e]"
                              >
                                Recommended
                              </option>
                              <option
                                value="price-low"
                                className="bg-[#11121e]"
                              >
                                Price: low to high
                              </option>
                              <option
                                value="price-high"
                                className="bg-[#11121e]"
                              >
                                Price: high to low
                              </option>
                            </select>
                          </label>
                        </div>
                      </div>
                    )}

                    {filteredProducts.length > 0 ? (
                      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                        {filteredProducts.map((product, index) => (
                          <motion.article
                            key={product.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                            }}
                            className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:border-indigo-400/25 hover:bg-white/[0.04]"
                          >
                            <div className="relative aspect-[4/4.5] overflow-hidden bg-[#11121e]">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-gray-500">
                                  <Shirt size={40} />
                                </div>
                              )}

                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

                              <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] font-medium text-gray-200 backdrop-blur-md">
                                {product.category}
                              </span>

                              <button
                                aria-label={
                                  favorites.includes(product.id)
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                                }
                                onClick={() => toggleFavorite(product.id)}
                                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/70"
                              >
                                <Heart
                                  size={17}
                                  className={
                                    favorites.includes(product.id)
                                      ? "fill-pink-400 text-pink-400"
                                      : ""
                                  }
                                />
                              </button>
                            </div>

                            <div className="p-4">
                              <p className="text-xs text-gray-500">
                                {product.brand}
                              </p>
                              <h3 className="mt-1.5 truncate text-sm font-medium text-gray-100">
                                {product.name}
                              </h3>

                              <div className="mt-3">
                                <p className="text-lg font-semibold">
                                  {formatPrice(
                                    product.price,
                                    product.currency,
                                  )}
                                </p>
                              </div>

                              <a
                                href={product.product_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/[0.08] py-2.5 text-xs font-semibold text-indigo-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/15"
                              >
                                View product
                                <ArrowUpRight size={14} />
                              </a>
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-6 rounded-2xl border border-dashed border-white/10 px-5 py-14 text-center">
                        <Search
                          className="mx-auto text-gray-500"
                          size={25}
                        />
                        <h3 className="mt-4 font-medium">
                          {searchData?.products_found === 0
                            ? "No products found"
                            : "No matching products"}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          {searchData?.products_found === 0
                            ? "Try another image with the clothing item clearly visible."
                            : "Try a different search term or category."}
                        </p>
                        {products.length > 0 && (
                          <button
                            onClick={() => {
                              setQuery("");
                              setCategory("All");
                            }}
                            className="mt-4 text-sm text-indigo-300 hover:text-indigo-200"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.section>
            ) : (
              !searching && (
                <section className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: ImagePlus,
                      title: "Search by image",
                      text: "Start with an item you already love.",
                    },
                    {
                      icon: Search,
                      title: "Explore alternatives",
                      text: "Discover visually similar fashion pieces.",
                    },
                    {
                      icon: Shirt,
                      title: "Compare your options",
                      text: "Review product details and prices.",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.07 }}
                        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/10 text-indigo-300">
                          <Icon size={19} />
                        </div>
                        <h3 className="mt-4 text-sm font-medium">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          {item.text}
                        </p>
                      </motion.div>
                    );
                  })}
                </section>
              )
            )}

            <footer className="mt-12 border-t border-white/[0.06] py-5 text-center text-xs text-gray-600">
              VestIQ · Discover your personal style.
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}