import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthUser } from "@/hooks/useAuth";
import {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from "@/lib/api";
import { handleApiError } from "@/utils/handleApiError";
import type { IReview } from "@/types/review";

export const REVIEWS_QUERY_KEY = "product-reviews";

// ── Star display (read-only, supports decimals) ───────────────────────────────

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const fillPct =
          rating >= n ? 100 : rating > n - 1 ? Math.round((rating - (n - 1)) * 100) : 0;
        return (
          <span
            key={n}
            className="relative inline-block shrink-0"
            style={{ width: size, height: size }}
          >
            {/* Track */}
            <Star
              size={size}
              style={{ width: size, height: size }}
              className="text-[#E8DDD0] absolute inset-0"
              fill="currentColor"
            />
            {/* Fill */}
            {fillPct > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPct}%` }}
              >
                <Star
                  size={size}
                  style={{ width: size, height: size }}
                  className="text-[#9A7A46]"
                  fill="currentColor"
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ── Interactive star picker ───────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${n} star${n !== 1 ? "s" : ""}`}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            size={26}
            className={n <= active ? "text-[#9A7A46]" : "text-[#E8DDD0]"}
            fill="currentColor"
          />
        </button>
      ))}
    </div>
  );
}

// ── Write / edit form ─────────────────────────────────────────────────────────

interface ReviewFormProps {
  productId: string;
  editing?: IReview | null;
  onClose: () => void;
}

function ReviewForm({ productId, editing, onClose }: ReviewFormProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(editing?.rating ?? 0);
  const [comment, setComment] = useState(editing?.comment ?? "");

  const createMutation = useMutation({
    mutationFn: () =>
      createProductReview(productId, {
        rating,
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Review submitted!");
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY, productId] });
      onClose();
    },
    onError: handleApiError,
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProductReview(productId, editing!.id, {
        rating,
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Review updated");
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY, productId] });
      onClose();
    },
    onError: handleApiError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    if (!rating) return toast.error("Please select a star rating");
    if (editing) updateMutation.mutate();
    else createMutation.mutate();
  };

  return (
    <div className="border border-[#9A7A46]/30 bg-[#FDFAF6] rounded-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A7A46] font-medium">
          {editing ? "Edit Your Review" : "Write a Review"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium">
          Rating *
        </span>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium">
          Comment{" "}
          <span className="normal-case text-gray-400 tracking-normal">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product…"
          rows={3}
          maxLength={2000}
          className="w-full bg-transparent text-sm text-gray-700 outline-none border border-[#D4B896] px-3 py-2 placeholder:text-gray-300 placeholder:text-xs focus:border-[#9A7A46] focus:shadow-[0_1px_0_0_#9A7A46] resize-none"
        />
        <p className="text-right text-[10px] text-gray-400">{comment.length} / 2000</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !rating}
          className="px-5 py-2.5 bg-[#2A1810] text-white text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#9A7A46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving…" : editing ? "Update" : "Submit"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 border border-[#E8DDD0] text-gray-500 text-xs tracking-[0.15em] uppercase font-medium hover:border-[#9A7A46] hover:text-[#9A7A46] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Single review card ────────────────────────────────────────────────────────

interface ReviewCardProps {
  review: IReview;
  isOwn: boolean;
  deleteLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function ReviewCard({ review, isOwn, deleteLoading, onEdit, onDelete }: ReviewCardProps) {
  const initials = review.user.name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`py-5 border-b border-[#E8DDD0] last:border-0 ${
        isOwn ? "bg-[#FDFAF6] -mx-4 px-4" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* User info */}
        <div className="flex items-center gap-3 min-w-0">
          {review.user.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.name}
              className="w-9 h-9 rounded-full object-cover border border-[#E8DDD0] shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#F5EFE7] border border-[#E8DDD0] flex items-center justify-center shrink-0">
              <span className="text-[11px] font-semibold text-[#9A7A46]">{initials}</span>
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-gray-800 leading-tight">
                {review.user.name}
              </p>
              {isOwn && (
                <span className="text-[9px] tracking-[0.2em] uppercase bg-[#9A7A46]/10 text-[#9A7A46] px-1.5 py-0.5 font-medium rounded-sm">
                  Your review
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Edit / delete (own review only) */}
        {isOwn && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-[#9A7A46] transition-colors"
              title="Edit review"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleteLoading}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Delete review"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Stars + comment */}
      <div className="mt-3 ml-12 space-y-2">
        <StarDisplay rating={review.rating} size={13} />
        {review.comment && (
          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
        )}
      </div>
    </div>
  );
}

// ── Skeleton rows ─────────────────────────────────────────────────────────────

function ReviewSkeleton() {
  return (
    <div className="py-5 border-b border-[#E8DDD0] animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#F8F4EE]" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-[#F8F4EE] rounded" />
          <div className="h-2.5 w-16 bg-[#F8F4EE] rounded" />
        </div>
      </div>
      <div className="mt-3 ml-12 space-y-2">
        <div className="h-3 w-24 bg-[#F8F4EE] rounded" />
        <div className="h-3 w-full bg-[#F8F4EE] rounded" />
        <div className="h-3 w-3/4 bg-[#F8F4EE] rounded" />
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

const ProductReviews = ({ productId }: { productId: string }) => {
  const queryClient = useQueryClient();
  const { data: user } = useAuthUser();

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<IReview | null>(null);

  // Fetch all reviews — independent of product query so it doesn't block the page
  const { data, isLoading } = useQuery({
    queryKey: [REVIEWS_QUERY_KEY, productId],
    queryFn: () =>
      getProductReviews(productId, {
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    enabled: !!productId,
    staleTime: 1000 * 60 * 2,
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => deleteProductReview(productId, reviewId),
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY, productId] });
    },
    onError: handleApiError,
  });

  const reviews = data?.data ?? [];
  const meta = data?.meta;
  const avgRating = meta?.averageRating ?? 0;
  const totalReviews = meta?.totalReviews ?? 0;
  const myReview = user ? (reviews.find((r) => r.user.id === user.id) ?? null) : null;

  const handleEdit = (review: IReview) => {
    setShowForm(false);
    setEditingReview(review);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Section divider heading */}
      <div className="flex items-center gap-4 mb-8 md:mb-10">
        <div className="h-px flex-1 bg-[#E8DDD0]" />
        <h2 className="text-[11px] tracking-[0.35em] uppercase text-[#9A7A46]/70 font-medium whitespace-nowrap">
          Customer Reviews
        </h2>
        <div className="h-px flex-1 bg-[#E8DDD0]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-14">
        {/* ── Left: summary + CTA ── */}
        <div className="space-y-6">
          {/* Average rating block */}
          <div>
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-12 w-20 bg-[#F8F4EE] rounded" />
                <div className="h-4 w-24 bg-[#F8F4EE] rounded" />
                <div className="h-3 w-16 bg-[#F8F4EE] rounded" />
              </div>
            ) : (
              <>
                <p className="text-5xl font-bold text-[#2A1810] font-serif leading-none">
                  {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                </p>
                <div className="mt-2.5">
                  <StarDisplay rating={avgRating} size={17} />
                </div>
                <p className="mt-2 text-xs text-gray-400 tracking-wide">
                  {totalReviews === 0
                    ? "No reviews yet"
                    : `${totalReviews} review${totalReviews !== 1 ? "s" : ""}`}
                </p>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E8DDD0]" />

          {/* Write review area */}
          <div>
            {!user ? (
              // Guest
              <p className="text-sm text-gray-500 leading-relaxed">
                <Link
                  to="/login"
                  className="text-[#9A7A46] hover:text-[#B8936A] font-medium underline underline-offset-2 transition-colors"
                >
                  Sign in
                </Link>{" "}
                to write a review for this product.
              </p>
            ) : myReview && !editingReview ? (
              // Already reviewed (not currently editing)
              <p className="text-xs text-gray-500 leading-relaxed">
                You've already reviewed this product. Click the{" "}
                <Pencil size={11} className="inline -mt-0.5 text-[#9A7A46]" /> icon on
                your review to edit it.
              </p>
            ) : !showForm && !editingReview ? (
              // Logged in, no review yet, form closed
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full py-2.5 bg-[#2A1810] text-white text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#9A7A46] transition-colors"
              >
                Write a Review
              </button>
            ) : null}
          </div>
        </div>

        {/* ── Right: form + list ── */}
        <div>
          {/* Write / edit form (inline) */}
          {(showForm || editingReview) && (
            <div className="mb-6">
              <ReviewForm
                productId={productId}
                editing={editingReview}
                onClose={handleCloseForm}
              />
            </div>
          )}

          {/* Reviews list */}
          {isLoading ? (
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-400 border border-dashed border-[#E8DDD0]">
              <Star size={28} className="mb-2.5 opacity-25" />
              <p className="text-sm">No reviews yet — be the first!</p>
            </div>
          ) : (
            <div>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwn={review.user.id === user?.id}
                  deleteLoading={deleteMutation.isPending}
                  onEdit={() => handleEdit(review)}
                  onDelete={() => deleteMutation.mutate(review.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
