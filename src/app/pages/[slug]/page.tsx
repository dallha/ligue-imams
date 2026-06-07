import { notFound } from 'next/navigation'
import { db as prisma } from '@/lib/db'
import LipsHeader from '@/components/lips/header'
import LipsFooter from '@/components/lips/footer'
import PageBanner from '@/components/lips/page-banner'

export default async function StaticPageTemplate({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const page = await prisma.staticPage.findUnique({
    where: { slug },
  })

  if (!page || !page.published) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <main className="flex-1">
        <PageBanner
          label="Page d'information"
          title={page.title}
        />
        <div className="container mx-auto px-4 py-12">
          <div 
            className="prose prose-lg dark:prose-invert max-w-4xl mx-auto font-sans"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />
        </div>
      </main>
      <LipsFooter />
    </div>
  )
}
