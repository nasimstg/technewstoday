import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { allInfos } from 'contentlayer/generated'
import type { Info } from 'contentlayer/generated'
import InfoLayout from '@/layouts/InfoLayout'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

const defaultLayout = 'InfoLayout'
const layouts = {
  InfoLayout,
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = 'privacy-policy'
  const post = allInfos.find((p) => p.slug === slug)
  if (!post) {
    return
  }

  return {
    title: post.title,
  }
}

export const generateStaticParams = async () => {
  return allInfos.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page() {
  const slug = 'privacy-policy'

  const post = allInfos.find((p) => p.slug === slug) as Info

  const mainContent = coreContent(post)
  const jsonLd = post.structuredData

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
