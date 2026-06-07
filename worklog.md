---
Task ID: 1
Agent: Main Agent
Task: Fix delete in Gestion du Coran, dark mode, white-on-white, and hydration mismatch

Work Log:
- Added Prisma models for CoranReciter, DailyVerse, CoranResource to schema.prisma
- Ran prisma db push and prisma generate to sync database
- Created 6 API routes for coran CRUD:
  - /api/admin/coran/reciters (GET/POST)
  - /api/admin/coran/reciters/[id] (PUT/DELETE)
  - /api/admin/coran/versets (GET/POST)
  - /api/admin/coran/versets/[id] (PUT/DELETE)
  - /api/admin/coran/ressources (GET/POST)
  - /api/admin/coran/ressources/[id] (PUT/DELETE)
- Rewrote /admin/coran/page.tsx with full CRUD (delete confirmation, edit dialog, add dialog, publish toggle)
  - Replaced Radix Tabs with custom tab navigation to avoid hydration mismatch
  - Added AlertDialog for delete confirmation
  - Added Dialog for create/edit with proper forms for each tab
  - Added loading states with Loader2 spinner
  - Added empty states with icons
- Fixed admin layout dark mode:
  - Changed bg-gray-50 → bg-background
  - Changed bg-white → bg-card for header
  - Changed border-gray-200 → border-border
  - Added ThemeToggle component in top bar
- Fixed hydration mismatch in AdminLayout:
  - Sheet component only renders after mount (already had this)
  - Replaced Radix Tabs in coran page with custom div-based tabs
- Fixed white-on-white across all admin pages:
  - Changed hover:bg-gray-50/50 → hover:bg-muted/50 in 7 pages
  - Changed text-lips-green-dark headings → text-foreground in 10 pages
  - Changed bg-gray-100 → bg-muted in 4 pages
  - Changed bg-white → bg-card in prieres and agenda
  - Made LIPS brand colors dark-mode aware by using CSS var() references in @theme inline
  - Fixed dashboard stat card colors for dark mode
  - Fixed password strength check colors for dark mode
  - Fixed amber info box in settings for dark mode
  - Fixed chart tooltip/grid for dark mode
- Seeded initial coran data (6 reciters, 5 verses, 5 resources)

Stage Summary:
- Delete functionality now works in Gestion du Coran with confirmation dialog
- Dark mode now works in admin with ThemeToggle button in top bar
- All hardcoded light colors replaced with theme-aware alternatives
- Hydration mismatch resolved by removing Radix Tabs from coran page
- Build compiles successfully

---
Task ID: 2
Agent: Main Agent
Task: Verify and fix that all site content is editable from admin

Work Log:
- Audited all public pages vs admin CRUD capabilities
- Found critical gap: public pages used hardcoded data, not DB content
- Added Prisma models: Event, published field on BureauMember & Commission
- Created 7 public API routes (no auth, returns only published items):
  /api/public/faq, /api/public/contenus, /api/public/bureau,
  /api/public/commissions, /api/public/regions, /api/public/coran, /api/public/agenda
- Created admin API routes for agenda CRUD:
  /api/admin/agenda (GET/POST), /api/admin/agenda/[id] (PUT/DELETE)
- Updated public components to fetch from DB with i18n fallback:
  - faq.tsx: fetches from /api/public/faq
  - gouvernance.tsx: fetches bureau + commissions from DB
  - actualites.tsx: fetches content from /api/public/contenus
  - agenda.tsx: fetches events from /api/public/agenda
  - coran.tsx: fetches daily verse + resources from /api/public/coran
  - regions.tsx: fetches from /api/public/regions
- Rewrote admin agenda page with real DB CRUD (was mock data only)
- Added published toggle to bureau & commissions admin pages
- Updated bureau & commissions API routes to support `published` field
- Seeded initial data for events, bureau members

Stage Summary:
- All public pages now read from database when data exists, fallback to i18n/hardcoded when empty
- Admin panel fully controls what appears on public site
- Build passes successfully
