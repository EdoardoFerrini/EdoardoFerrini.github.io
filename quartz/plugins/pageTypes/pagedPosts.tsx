import { QuartzPageTypePlugin } from "../types"
import { match } from "./matchers"
import { FullSlug, resolveRelative } from "../../util/path"
import { QuartzComponent } from "../../components/types"
import {
  collectTags,
  isPost,
  POSTS_PER_PAGE,
  postDateOrThrow,
  postTags,
  tagSlug,
} from "../../components/Site"

const iso = (d: Date) => d.toISOString().slice(0, 10)
const pageSlug = (page: number) => (page === 1 ? "posts" : `posts/${page}`) as FullSlug

const tagPageSlug = (tag: string, page = 1): FullSlug =>
  (page === 1 ? `tags/${tagSlug(tag)}` : `tags/${tagSlug(tag)}/${page}`) as FullSlug

type PaginationData = {
  page: number
  totalPages: number
  tag?: string
}

const paginationOf = (fileData: { pagination?: unknown }): PaginationData =>
  (fileData.pagination ?? { page: 1, totalPages: 1 }) as PaginationData

export const PagedPosts: QuartzComponent = ({ fileData, allFiles }) => {
  const data = paginationOf(fileData)
  const slug = fileData.slug!
  const allPosts = allFiles.filter(isPost)
  const tags = collectTags(allPosts)
  const tag = data.tag
  const posts = (tag ? allPosts.filter((f) => postTags(f).includes(tag)) : allPosts)
    .map((f) => ({ f, date: postDateOrThrow(f) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice((data.page - 1) * POSTS_PER_PAGE, data.page * POSTS_PER_PAGE)
  const href = (n: number) => resolveRelative(slug, tag ? tagPageSlug(tag, n) : pageSlug(n))
  const postsHref = resolveRelative(slug, "posts" as FullSlug)

  return <div class="paged-post-list">
    <nav class="tag-filter" aria-label="filter posts by tag">
      <a href={postsHref} class={tag ? "" : "active"}>all</a>
      {tags.map(({ tag: t }) => <a
        href={resolveRelative(slug, tagPageSlug(t))}
        class={tag === t ? "active" : ""}
      >{t}</a>)}
    </nav>
    <ul class="post-list">
      {posts.map(({ f, date }) => <li>
        <time dateTime={iso(date)}>{iso(date)}</time>
        <a href={resolveRelative(slug, f.slug!)}>{f.frontmatter?.title}</a>
      </li>)}
    </ul>
    <nav class="pagination" aria-label={tag ? `posts tagged ${tag}` : "posts pages"}>
      {data.page > 1
        ? <a href={href(data.page - 1)}>← previous</a>
        : <span class="pagination-disabled">← previous</span>}
      <span>page {data.page} / {data.totalPages}</span>
      {data.page < data.totalPages
        ? <a href={href(data.page + 1)}>next →</a>
        : <span class="pagination-disabled">next →</span>}
    </nav>
  </div>
}

export const PagedPostsPageType: QuartzPageTypePlugin = () => ({
  name: "PagedPosts",
  priority: 100,
  match: match.none(),
  generate({ content }) {
    const posts = content.map(([, file]) => file.data).filter(isPost)
    const postTotalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
    const pages = Array.from({ length: postTotalPages }, (_, i) => {
      const page = i + 1
      return {
        slug: pageSlug(page),
        title: "posts",
        data: { pagination: { page, totalPages: postTotalPages } },
      }
    })

    for (const { tag, count } of collectTags(posts)) {
      const tagTotalPages = Math.max(1, Math.ceil(count / POSTS_PER_PAGE))
      for (let page = 1; page <= tagTotalPages; page++) {
        pages.push({
          slug: tagPageSlug(tag, page),
          title: tag,
          data: { pagination: { page, totalPages: tagTotalPages, tag } },
        })
      }
    }

    return pages
  },
  layout: "posts-paged",
  frame: "full-width",
  body: () => PagedPosts,
})
