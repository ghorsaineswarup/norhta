"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useCart } from "@/lib/CartContext";
import { apiFetch } from "@/lib/api";

type Product = {
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  images: string[];
  specifications?: Record<string, string>;
  stock: number;
  variants: {
    sku: string;
    color?: string;
    size?: string;
    stock: number;
  }[];
  category?: { name: string };
};

type Review = {
  _id: string;
  user: { name: string };
  rating: number;
  title?: string;
  comment?: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

const TABS = ["Description", "Specs", "Shipping"] as const;

export default function ProductDetailClient({
  product,
  productId,
}: {
  product: Product;
  productId: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("Description");

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.sku || null
  );

  const [selectedImage, setSelectedImage] = useState(0);

  const [cartMessage, setCartMessage] = useState("");
  const { addToCart } = useCart();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const availableStock = selectedVariant
    ? product.variants.find((v) => v.sku === selectedVariant)?.stock ??
      product.stock
    : product.stock;

  const colors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  );

  useEffect(() => {
    apiFetch(`/reviews/${productId}`)
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .finally(() => setReviewsLoading(false));
  }, [productId]);

  useEffect(() => {
    setSelectedImage(0);
  }, [productId]);

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReviewError("");
    setReviewSubmitting(true);

    try {
      const res = await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({
          productId,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReviewError(data.message || "Could not submit review");
        return;
      }

      setReviews((prev) => [data, ...prev]);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: "", comment: "" });
    } catch {
      setReviewError("Something went wrong. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  }

  const hasImages = Array.isArray(product.images) && product.images.length > 0;

  const mainImage = hasImages
    ? product.images[selectedImage] || product.images[0]
    : null;

  return (
    <section className="py-10 grid grid-cols-1 md:grid-cols-2 gap-14">
      <div>
        {/* Main product image */}
        <div className="aspect-square rounded-xl overflow-hidden bg-card border border-border">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent) 0%, transparent 70%)",
                opacity: 0.14,
              }}
            />
          )}
        </div>

        {/* Product thumbnails */}
        <div className="grid grid-cols-4 gap-2.5 mt-3">
          {[0, 1, 2, 3].map((i) => {
            const image = product.images?.[i];

            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (image) {
                    setSelectedImage(i);
                  }
                }}
                disabled={!image}
                className={`aspect-square overflow-hidden rounded-md border ${
                  selectedImage === i && image
                    ? "border-accent"
                    : "border-border"
                } ${
                  image
                    ? "cursor-pointer hover:border-accent"
                    : "cursor-default"
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-card" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {product.category && (
          <div className="text-[11px] tracking-[0.16em] uppercase text-foreground-faint mb-2">
            {product.category.name}
          </div>
        )}

        <h1 className="font-[family-name:var(--font-display)] font-bold text-3xl uppercase tracking-[0.04em]">
          {product.name}
        </h1>

        {product.shortDescription && (
          <p className="text-foreground-dim mt-2">
            {product.shortDescription}
          </p>
        )}

        <div className="font-[family-name:var(--font-display)] text-2xl text-accent mt-5">
          NPR {product.price.toLocaleString()}
        </div>

        {colors.length > 0 && (
          <div className="mt-6">
            <div className="text-[11px] tracking-[0.1em] uppercase text-foreground-faint mb-2.5">
              Color
            </div>

            <div className="flex gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.sku}
                  onClick={() => setSelectedVariant(v.sku)}
                  className={`px-4.5 py-2.5 text-sm border rounded-md ${
                    selectedVariant === v.sku
                      ? "border-accent text-accent"
                      : "border-border-strong text-foreground-dim"
                  }`}
                >
                  {v.color}
                  {v.size ? ` / ${v.size}` : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="text-[11px] tracking-[0.1em] uppercase text-foreground-faint mb-2.5">
            Quantity
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border-strong rounded-md">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-lg"
              >
                −
              </button>

              <span className="px-2 text-sm">{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((q) => Math.min(availableStock, q + 1))
                }
                className="px-4 py-2.5 text-lg"
              >
                +
              </button>
            </div>

            <span className="text-xs text-foreground-faint">
              {availableStock > 0
                ? `${availableStock} in stock`
                : "Out of stock"}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <Button
            variant="primary"
            className="flex-1"
            disabled={availableStock === 0}
            onClick={async () => {
              const error = await addToCart(
                productId,
                quantity,
                selectedVariant || undefined
              );

              setCartMessage(error || "Added to cart");
              setTimeout(() => setCartMessage(""), 3000);
            }}
          >
            {availableStock === 0 ? "Out of stock" : "Add to cart"}
          </Button>

          <Button
            variant="ghost"
            onClick={async () => {
              await apiFetch("/wishlist/add", {
                method: "POST",
                body: JSON.stringify({ productId }),
              });

              setCartMessage("Added to wishlist");
              setTimeout(() => setCartMessage(""), 3000);
            }}
          >
            ♡ Wishlist
          </Button>
        </div>

        {cartMessage && (
          <p className="text-sm mt-3 text-accent">{cartMessage}</p>
        )}

        <div className="flex gap-7 border-b border-border mt-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-[family-name:var(--font-display)] text-[11px] tracking-[0.14em] uppercase pb-3.5 border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-foreground border-accent"
                  : "text-foreground-faint border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-6 text-foreground-dim text-sm leading-relaxed">
          {activeTab === "Description" &&
            (product.description || "No description available.")}

          {activeTab === "Specs" &&
            (product.specifications &&
            Object.keys(product.specifications).length > 0 ? (
              <dl className="grid grid-cols-2 gap-y-2.5">
                {Object.entries(product.specifications).map(
                  ([key, value]) => (
                    <div key={key} className="contents">
                      <dt className="text-foreground-faint">{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  )
                )}
              </dl>
            ) : (
              "No specifications listed."
            ))}

          {activeTab === "Shipping" &&
            "Kathmandu Valley: NPR 100. Outside Valley: NPR 200. Free shipping on orders above NPR 10,000."}
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.2em] uppercase text-foreground-faint">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h2>

            <button
              onClick={() => setShowReviewForm((s) => !s)}
              className="text-xs text-accent hover:underline"
            >
              {showReviewForm ? "Cancel" : "Write a review"}
            </button>
          </div>

          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="bg-card border border-border rounded-lg p-5 mb-6"
            >
              <div className="mb-3">
                <div className="text-[11px] tracking-[0.1em] uppercase text-foreground-faint mb-2">
                  Rating
                </div>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() =>
                        setReviewForm({
                          ...reviewForm,
                          rating: n,
                        })
                      }
                      className={
                        n <= reviewForm.rating
                          ? "text-accent"
                          : "text-foreground-faint"
                      }
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <input
                placeholder="Title (optional)"
                value={reviewForm.title}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    title: e.target.value,
                  })
                }
                className="w-full bg-transparent border border-border-strong rounded-md px-3 py-2.5 text-sm mb-3"
              />

              <textarea
                placeholder="Your review (optional)"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    comment: e.target.value,
                  })
                }
                rows={3}
                className="w-full bg-transparent border border-border-strong rounded-md px-3 py-2.5 text-sm mb-3"
              />

              {reviewError && (
                <p className="text-accent text-xs mb-3">
                  {reviewError}
                </p>
              )}

              <Button type="submit" variant="primary" disabled={reviewSubmitting}>
                {reviewSubmitting ? "Submitting..." : "Submit review"}
              </Button>
            </form>
          )}

          {reviewsLoading ? (
            <p className="text-foreground-faint text-sm">
              Loading reviews...
            </p>
          ) : reviews.length === 0 ? (
            <p className="text-foreground-faint text-sm">
              No reviews yet.
            </p>
          ) : (
            <div className="space-y-5">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="border-b border-border pb-5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-accent text-sm">
                      {"★".repeat(r.rating)}
                    </span>

                    <span className="text-foreground-faint text-xs">
                      {"★".repeat(5 - r.rating)}
                    </span>

                    {r.verifiedPurchase && (
                      <span className="text-[10px] tracking-[0.08em] uppercase text-accent border border-accent rounded-full px-2 py-0.5 ml-2">
                        Verified purchase
                      </span>
                    )}
                  </div>

                  {r.title && (
                    <div className="text-sm font-medium">
                      {r.title}
                    </div>
                  )}

                  {r.comment && (
                    <p className="text-foreground-dim text-sm mt-1">
                      {r.comment}
                    </p>
                  )}

                  <div className="text-foreground-faint text-xs mt-2">
                    {r.user?.name || "Anonymous"} ·{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}