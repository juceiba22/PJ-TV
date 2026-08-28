import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_categories")
    .select("id, slug, name")
    .order("sort_order");
  return data ?? [];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_categories")
    .select("id, slug, name")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getThreads(categoryId: string, provincia?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("forum_threads")
    .select("id, title, provincia, created_at, author:profiles(username)")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false });

  if (provincia) query = query.eq("provincia", provincia);

  const { data } = await query;
  return (data ?? []).map((t) => ({
    ...t,
    author: Array.isArray(t.author) ? t.author[0] : t.author,
  }));
}

export async function getThreadWithPosts(threadId: string) {
  const supabase = await createClient();

  const { data: thread } = await supabase
    .from("forum_threads")
    .select("id, title, provincia, created_at, category_id, author:profiles(username)")
    .eq("id", threadId)
    .single();

  if (!thread) return null;

  const { data: posts } = await supabase
    .from("forum_posts")
    .select("id, body, created_at, author_id, author:profiles(username)")
    .eq("thread_id", threadId)
    .order("created_at");

  return {
    thread: {
      ...thread,
      author: Array.isArray(thread.author) ? thread.author[0] : thread.author,
    },
    posts: (posts ?? []).map((p) => ({
      ...p,
      author: Array.isArray(p.author) ? p.author[0] : p.author,
    })),
  };
}

export async function getLikeInfo(
  targetType: "stream" | "thread" | "post",
  targetIds: string[],
  currentUserId?: string,
) {
  if (targetIds.length === 0) return new Map<string, { count: number; likedByMe: boolean }>();

  const supabase = await createClient();
  const { data } = await supabase
    .from("likes")
    .select("target_id, user_id")
    .eq("target_type", targetType)
    .in("target_id", targetIds);

  const result = new Map<string, { count: number; likedByMe: boolean }>();
  for (const id of targetIds) result.set(id, { count: 0, likedByMe: false });

  for (const like of data ?? []) {
    const entry = result.get(like.target_id)!;
    entry.count += 1;
    if (currentUserId && like.user_id === currentUserId) entry.likedByMe = true;
  }

  return result;
}
