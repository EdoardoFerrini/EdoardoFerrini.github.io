import { QuartzPageTypePlugin } from "../types"
import { match } from "./matchers"
import { FullSlug, resolveRelative } from "../../util/path"
import { QuartzComponent } from "../../components/types"
import { isPost, POSTS_PER_PAGE, postDateOrThrow } from "../../components/Site"

const iso = (d: Date) => d.toISOString().slice(0, 10)
const pageSlug = (page: number) => (page === 1 ? "posts" : `posts/${page}`) as FullSlug

export const PagedPosts: QuartzComponent = ({ fileData, allFiles }) => {
  const { page, totalPages } = fileData.pagination as { page: number; totalPages: number }
  const slug = fileData.slug!
  const posts = allFiles
    .filter(isPost)
    .map((f) => ({ f, date: postDateOrThrow(f) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
  const href = (n: number) => resolveRelative(slug, pageSlug(n))

  return <div class="paged-post-list">
    <ul class="post-list">
      {posts.map(({ f, date }) => <li>
        <time dateTime={iso(date)}>{iso(date)}</time>
        <a href={resolveRelative(slug, f.slug!)}>{f.frontmatter?.title}</a>
      </li>)}
    </ul>
    <nav class="pagination" aria-label="posts pages">
      {page > 1
        ? <a href={href(page - 1)}>← previous</a>
        : <span class="pagination-disabled">← previous</span>}
      <span>page {page} / {totalPages}</span>
      {page < totalPages
        ? <a href={href(page + 1)}>next →</a>
        : <span class="pagination-disabled">next →</span>}
    </nav>
  </div>
}

export const PagedPostsPageType: QuartzPageTypePlugin = () => ({
  name: "PagedPosts",
  priority: 100,
  match: match.none(),
  generate({ content }) {
    const count = content.map(([, file]) => file.data).filter(isPost).length
    const totalPages = Math.max(1, Math.ceil(count / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1
      return {
        slug: pageSlug(page),
        title: "posts",
        data: { pagination: { page, totalPages } },
      }
    })
  },
  layout: "posts-paged",
  frame: "full-width",
  body: () => PagedPosts,
})
