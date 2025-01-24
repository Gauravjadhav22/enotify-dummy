export const siteConfig = {
  name: "Planner",
  url: "https://planner.tremor.so",
  description: "The simplest dashboard template.",
  baseLinks: {
    quotes: {
      overview: "/dashboard/quotes/overview",
      monitoring: "/dashboard/quotes/monitoring",
      audits: "/dashboard/quotes/audits",
    },
  },
}

export type siteConfig = typeof siteConfig
