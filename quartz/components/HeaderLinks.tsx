import { QuartzComponent } from "./types"
import { joinSegments, pathToRoot } from "../util/path"

// Icon-only header links: compact on mobile, with accessible names for screen readers.
export const HeaderLinks: QuartzComponent = ({ fileData }) => {
  const root = pathToRoot(fileData.slug!)
  // No trailing slash on "posts": the SPA keeps the clicked URL, so /posts/ would make the
  // re-attached ./index.css resolve to /posts/index.css until a full reload.
  return <nav class="header-links" aria-label="site">
    <a href={joinSegments(root, "posts")}>posts</a>
    <a class="header-link-right" href="https://edoardoferrini.github.io/second-brain" data-router-ignore="true" aria-label="second brain" title="second brain">
      <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        <path d="M12 18v-1.5" />
      </svg>
    </a>
    <a href={joinSegments(root, "index.xml")} aria-label="rss" title="rss">
      <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
      </svg>
    </a>
  </nav>
}
