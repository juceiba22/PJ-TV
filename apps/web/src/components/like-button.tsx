import { toggleLike } from "@/app/actions/forum";

export function LikeButton({
  targetType,
  targetId,
  count,
  likedByMe,
  revalidatePath,
}: {
  targetType: "stream" | "thread" | "post";
  targetId: string;
  count: number;
  likedByMe: boolean;
  revalidatePath: string;
}) {
  return (
    <form action={toggleLike} className="inline">
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="revalidate_path" value={revalidatePath} />
      <button
        type="submit"
        className={`rounded px-2 py-1 text-sm ${
          likedByMe
            ? "bg-blue-600 text-white"
            : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
        }`}
      >
        👍 {count}
      </button>
    </form>
  );
}
