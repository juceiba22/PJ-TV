import { toggleLike } from "@/app/actions/forum";
import { ThumbsUp } from "lucide-react";

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
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
          likedByMe
            ? "bg-blue-600/20 text-sky-400 border border-blue-500/40 shadow-sm"
            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
        }`}
      >
        <ThumbsUp
          className={`h-3.5 w-3.5 ${likedByMe ? "fill-sky-400 text-sky-400" : ""}`}
        />
        <span>{count}</span>
      </button>
    </form>
  );
}
