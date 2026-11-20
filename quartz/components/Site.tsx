import { QuartzComponent } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { resolveRelative } from "../util/path"

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

//The published date of a post, under its title. Other pages show nothing.
export const DateLine: QuartzComponent = ({ fileData }) => {
  if (!isPost(fileData)) return null
  const date = postDateOrThrow(fileData)
  return <time class="date-line" dateTime={iso(date)}>{iso(date)}</time>
}

//Home page only: the newest posts.
export const PostList: QuartzComponent = ({ fileData, allFiles }) => {
  if (fileData.slug !== "index") return null
  const posts = allFiles
    .filter(isPost)
    .map((f) => ({ f, date: postDateOrThrow(f) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, HOME_POST_COUNT)

  return <ul class="post-list">
    {posts.map(({ f, date }) => <li>
      <time dateTime={iso(date)}>{iso(date)}</time>
      <a href={resolveRelative(fileData.slug!, f.slug!)}>{f.frontmatter?.title}</a>
    </li>)}
  </ul>
}
