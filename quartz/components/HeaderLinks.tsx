import { QuartzComponent } from "./types"
import { joinSegments, pathToRoot } from "../util/path"

// Icon-only header links: compact on mobile, with accessible names for screen readers.
export const HeaderLinks: QuartzComponent = ({ fileData }) => {
  const root = pathToRoot(fileData.slug!)
  // No trailing slash on "posts": the SPA keeps the clicked URL, so /posts/ would make the
  // re-attached ./index.css resolve to /posts/index.css until a full reload.
  return <nav class="header-links" aria-label="site">
    <a href={joinSegments(root, "posts")} aria-label="posts" title="posts">
      <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M8 6h13M8 12h13M8 18h13" />
        <circle cx="3.5" cy="6" r="1" />
        <circle cx="3.5" cy="12" r="1" />
        <circle cx="3.5" cy="18" r="1" />
      </svg>
    </a>
    <a href="https://edoardoferrini.github.io/second-brain" data-router-ignore="true" aria-label="second brain" title="second brain">
      <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="M8.6 10.8 15.4 7.2M8.6 13.2l6.8 3.6" />
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
