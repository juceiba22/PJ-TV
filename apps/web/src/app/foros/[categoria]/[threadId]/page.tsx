import { notFound } from "next/navigation";
import { getThreadWithPosts, getLikeInfo } from "@/lib/queries/forums";
import { createPost } from "@/app/actions/forum";
import { getCurrentProfile } from "@/lib/dal";
import { LikeButton } from "@/components/like-button";

export default async function ThreadPage({
  params,
}: PageProps<"/foros/[categoria]/[threadId]">) {
  const { categoria: slug, threadId } = await params;

  const result = await getThreadWithPosts(threadId);
  if (!result) notFound();
  const { thread, posts } = result;

  const profile = await getCurrentProfile();
  const likeInfo = await getLikeInfo(
    "post",
    posts.map((p) => p.id),
    profile?.id,
  );
  const path = `/foros/${slug}/${threadId}`;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-bold">{thread.title}</h1>
      <p className="mb-6 text-sm text-neutral-500">
        @{thread.author?.username}
        {thread.provincia ? ` · ${thread.provincia}` : ""}
      </p>

      <div className="flex flex-col gap-4">
        {posts.map((p) => {
          const likes = likeInfo.get(p.id) ?? { count: 0, likedByMe: false };
          return (
            <div
              key={p.id}
              className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <p className="mb-2 whitespace-pre-wrap">{p.body}</p>
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>@{p.author?.username}</span>
                <LikeButton
                  targetType="post"
                  targetId={p.id}
                  count={likes.count}
                  likedByMe={likes.likedByMe}
                  revalidatePath={path}
                />
              </div>
            </div>
          );
        })}
        {posts.length === 0 && (
          <p className="text-neutral-500">Sé el primero en responder.</p>
        )}
      </div>

      {profile ? (
        <form action={createPost} className="mt-8 flex flex-col gap-2">
          <input type="hidden" name="thread_id" value={threadId} />
          <input type="hidden" name="category_slug" value={slug} />
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Escribí tu respuesta..."
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
          />
          <button
            type="submit"
            className="self-start rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Responder
          </button>
        </form>
      ) : (
        <p className="mt-8 text-sm text-neutral-500">Ingresá para responder.</p>
      )}
    </main>
  );
}
