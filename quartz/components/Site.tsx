import { QuartzComponent } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, resolveRelative } from "../util/path"

const iso = (d: Date) => d.toISOString().slice(0, 10)
export const HOME_POST_COUNT = 5
export const POSTS_PER_PAGE = 10

//Posts have a published date and are not marked unlisted by the unlisted-pages plugin.
//Other pages can inherit a date from git/filesystem, so the date alone is not enough.
const postDate = (f: QuartzPluginData): Date | undefined => {
  const value = f.dates?.published ?? f.published
  if (!value) return undefined
  return value instanceof Date ? value : new Date(String(value))
}

export const isPost = (f: QuartzPluginData) =>
  !("unlisted" in f && f.unlisted === true) && postDate(f) !== undefined

export const postDateOrThrow = (f: QuartzPluginData) => {
  const date = postDate(f)
  if (!date) throw new Error(`Post ${f.slug ?? "unknown"} has no published date`)
  return date
}

//Tags come from frontmatter, with no native Quartz tag UI.
export const postTags = (f: QuartzPluginData): string[] => {
  const raw: unknown = f.frontmatter?.tags
  if (raw == null) return []
  const values = Array.isArray(raw) ? raw : String(raw).split(/[,;]/)
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))]
}

export const tagSlug = (tag: string): string =>
  tag
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const collectTags = (files: QuartzPluginData[]): { tag: string; count: number }[] => {
  const counts = new Map<string, number>()
  for (const file of files.filter(isPost)) {
    for (const tag of postTags(file)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag, "it"))
}

//The published date of a post, under its title. Other pages show nothing.
export const DateLine: QuartzComponent = ({ fileData }) => {
  if (!isPost(fileData)) return null
  const date = postDateOrThrow(fileData)
  return <time class="date-line" dateTime={iso(date)}>{iso(date)}</time>
}

//Compact tag links under the date, same visual language as posts.
export const TagLine: QuartzComponent = ({ fileData }) => {
  if (!isPost(fileData)) return null
  const tags = postTags(fileData)
  if (tags.length === 0) return null
  const slug = fileData.slug!
  return <nav class="tag-line" aria-label="tags">
    {tags.map((tag) => {
      const target = `tags/${tagSlug(tag)}` as FullSlug
      return <a href={resolveRelative(slug, target)}>{tag}</a>
    })}
  </nav>
}

//Home page only: the newest posts.
export const PostList: QuartzComponent = ({ fileData, allFiles }) => {
  if (fileData.slug !== "index") return null
  const posts = allFiles
    .filter(isPost)
    .map((f) => ({ f, date: postDateOrThrow(f) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, HOME_POST_COUNT)

  return <>
    <h3>Ultimi post</h3>
    <ul class="post-list">
      {posts.map(({ f, date }) => <li>
        <time dateTime={iso(date)}>{iso(date)}</time>
        <a href={resolveRelative(fileData.slug!, f.slug!)}>{f.frontmatter?.title}</a>
      </li>)}
    </ul>
  </>
}
