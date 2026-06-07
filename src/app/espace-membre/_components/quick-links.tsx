import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

export function QuickLinkCard({ icon: Icon, title, description, href, color }: {
  icon: React.ElementType
  title: string
  description: string
  href: string
  color: string
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="h-full hover:shadow-md transition-shadow border-lips-green/5 cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm text-lips-green-dark">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
