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
