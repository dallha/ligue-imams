import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, Heart } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/lips/i18n/language-context'

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function PaymentsTable({ member }: { member: any }) {
  const { p } = useLanguage()

  const totalCotisations = member.paiements
    .filter((pay: any) => pay.type === 'COTISATION')
    .reduce((sum: number, pay: any) => sum + pay.montant, 0)

  return (
    <Card className="border-lips-green/10">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg text-lips-green-dark flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-lips-green" />
              {p.espaceMembre.paymentsTitle}
            </CardTitle>
            <CardDescription>{p.espaceMembre.paymentsDesc}</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{p.espaceMembre.totalContributions}</div>
              <div className="text-lg font-bold text-lips-green">{formatCurrency(totalCotisations, p.espaceMembre.currency)}</div>
            </div>
            <Button asChild size="sm" className="bg-lips-green hover:bg-lips-green-dark text-white">
              <Link href="/faire-un-don">
                <Heart className="h-4 w-4 mr-1.5" />
                {p.espaceMembre.payContribution}
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden sm:block">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-lips-green/5">
                  <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableType}</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableAmount}</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableDate}</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableMethod}</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableReference}</th>
                </tr>
              </thead>
              <tbody>
                {member.paiements.map((pay: any) => (
                  <tr key={pay.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <Badge
                        className={
                          pay.type === 'COTISATION'
                            ? 'bg-lips-green/10 text-lips-green border-lips-green/20'
                            : pay.type === 'DON'
                            ? 'bg-lips-gold/10 text-lips-gold border-lips-gold/20'
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                        }
                      >
                        {pay.type}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium">{formatCurrency(pay.montant, p.espaceMembre.currency)}</td>
                    <td className="p-3 text-muted-foreground">{formatDate(pay.datePaiement)}</td>
                    <td className="p-3">{pay.methode}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{pay.referenceTrans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3 max-h-96 overflow-y-auto">
          {member.paiements.map((pay: any) => (
            <div key={pay.id} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  className={
                    pay.type === 'COTISATION'
                      ? 'bg-lips-green/10 text-lips-green border-lips-green/20'
                      : pay.type === 'DON'
                      ? 'bg-lips-gold/10 text-lips-gold border-lips-gold/20'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                  }
                >
                  {pay.type}
                </Badge>
                <span className="font-bold text-lips-green-dark">{formatCurrency(pay.montant, p.espaceMembre.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDate(pay.datePaiement)}</span>
                <span>{pay.methode}</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono">{pay.referenceTrans}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
