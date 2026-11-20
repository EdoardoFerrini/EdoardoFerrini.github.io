import { QuartzComponent } from "./types"
import { joinSegments, pathToRoot } from "../util/path"

// Keep the Episteme-style header, with the blog navigation restored next to the cross-link.
export const HeaderLinks: QuartzComponent = ({ fileData }) => {
  const root = pathToRoot(fileData.slug!)
  // No trailing slash on "posts": the SPA keeps the clicked URL, so /posts/ would make the
  // re-attached ./index.css resolve to /posts/index.css until a full reload.
  return <nav class="header-links" aria-label="site">
    <a href={joinSegments(root, "posts")}>posts</a>
    <a href="https://edoardoferrini.github.io/second-brain" data-router-ignore="true">second brain</a>
    <a href={joinSegments(root, "index.xml")}>rss</a>
  </nav>
}
