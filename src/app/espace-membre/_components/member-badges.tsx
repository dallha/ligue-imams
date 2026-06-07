import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { useLanguage } from '@/lib/lips/i18n/language-context'

export function StatusBadge({ status }: { status: string }) {
  const { p } = useLanguage()
  switch (status) {
    case 'ACTIF':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {p.espaceMembre.statusActive}
        </Badge>
      )
    case 'EXPIRE':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          {p.espaceMembre.statusExpired}
        </Badge>
      )
    case 'EN_ATTENTE':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          {p.espaceMembre.statusPending}
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function RoleBadge({ role }: { role: string }) {
  const { p } = useLanguage()
  const roleMap: Record<string, { label: string; color: string }> = {
    IMAM: { label: p.espaceMembre.roleImam, color: 'bg-lips-green/10 text-lips-green border-lips-green/20' },
    PREDICATEUR: { label: p.espaceMembre.rolePreacher, color: 'bg-lips-emerald/10 text-lips-emerald border-lips-emerald/20' },
    RESPONSABLE_REGIONAL: { label: p.espaceMembre.roleRegionalHead, color: 'bg-lips-gold/10 text-lips-gold border-lips-gold/20' },
    MEMBRE_CHOURA: { label: p.espaceMembre.roleShura, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  }
  const info = roleMap[role] || { label: role, color: 'bg-gray-100 text-gray-700 border-gray-200' }
  return (
    <Badge className={`${info.color} hover:${info.color}`}>
      {info.label}
    </Badge>
  )
}

export function CommTypeBadge({ type }: { type: string }) {
  const { p } = useLanguage()
  switch (type) {
    case 'COMMUNIQUE':
      return <Badge className="bg-lips-green/10 text-lips-green border-lips-green/20 text-xs">{p.espaceMembre.commCommunique}</Badge>
    case 'FATWA':
      return <Badge className="bg-lips-gold/10 text-lips-gold border-lips-gold/20 text-xs">{p.espaceMembre.commFatwa}</Badge>
    case 'EVENEMENT':
      return <Badge className="bg-lips-emerald/10 text-lips-emerald border-lips-emerald/20 text-xs">{p.espaceMembre.commEvent}</Badge>
    default:
      return <Badge variant="secondary" className="text-xs">{type}</Badge>
  }
}
