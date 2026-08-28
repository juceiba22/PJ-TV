"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/dal";

export async function createThread(formData: FormData) {
  const profile = await requireProfile();
  const categoryId = formData.get("category_id") as string;
  const categorySlug = formData.get("category_slug") as string;
  const title = (formData.get("title") as string)?.trim();
  const provincia = (formData.get("provincia") as string)?.trim() || null;

  if (!title || title.length < 3) return;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forum_threads")
    .insert({ category_id: categoryId, author_id: profile.id, title, provincia })
    .select("id")
    .single();

  if (error || !data) return;

  revalidatePath(`/foros/${categorySlug}`);
  redirect(`/foros/${categorySlug}/${data.id}`);
}

export async function createPost(formData: FormData) {
  const profile = await requireProfile();
  const threadId = formData.get("thread_id") as string;
  const categorySlug = formData.get("category_slug") as string;
  const body = (formData.get("body") as string)?.trim();

  if (!body) return;

  const supabase = await createClient();
  await supabase.from("forum_posts").insert({
    thread_id: threadId,
    author_id: profile.id,
    body,
  });

  revalidatePath(`/foros/${categorySlug}/${threadId}`);
}

export async function toggleLike(formData: FormData) {
  const profile = await requireProfile();
  const targetType = formData.get("target_type") as "stream" | "thread" | "post";
  const targetId = formData.get("target_id") as string;
  const revalidateTo = formData.get("revalidate_path") as string;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("likes")
      .insert({ target_type: targetType, target_id: targetId, user_id: profile.id });
  }

  if (revalidateTo) revalidatePath(revalidateTo);
}
