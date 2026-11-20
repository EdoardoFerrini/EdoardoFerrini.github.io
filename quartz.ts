import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"
import { DateLine, PostList, TagLine, isPost } from "./quartz/components/Site"
import { HeaderLinks } from "./quartz/components/HeaderLinks"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes"
import { PagedPostsPageType } from "./quartz/plugins/pageTypes/pagedPosts"

//Comments are enabled only on posts.
registerCondition("post", ({ fileData }) => isPost(fileData))

const config = await loadQuartzConfig()
//Quartz expects a scheme-free baseUrl. Accept ordinary preview/deployment URLs too.
config.configuration.baseUrl = (process.env.BASE_URL ?? "edoardoferrini.github.io")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "")
export default config

//Same header as Episteme: title, blog navigation, native Search and theme toggle.
const baseLayout = await loadQuartzLayout()
const header = [...(baseLayout.defaults.header ?? [])]
header.splice(1, 0, HeaderLinks)

export const layout = await loadQuartzLayout({
  defaults: {
    header,
    beforeBody: [...(baseLayout.defaults.beforeBody ?? []), DateLine, TagLine],
    afterBody: [PostList, ...(baseLayout.defaults.afterBody ?? [])],
    left: [],
    right: [],
  },
  byPageType: {
    content: { ...baseLayout.byPageType.content, frame: "full-width" },
  },
})

config.plugins.pageTypes = [...(config.plugins.pageTypes ?? []), PagedPostsPageType()]
const dispatcher = config.plugins.emitters.findIndex((emitter) => emitter.name === "PageTypeDispatcher")
if (dispatcher < 0) throw new Error("Quartz page dispatcher not found")
config.plugins.emitters[dispatcher] = PageTypeDispatcher(layout)
