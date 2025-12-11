// file: app/admin/posts/new/page.tsx
import { PostForm } from "../_components/PostForm";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return <PostForm mode="create" />;
}
