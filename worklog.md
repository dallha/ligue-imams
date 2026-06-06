---
Task ID: 1
Agent: Main
Task: Extract logo from uploaded PDF, fix prayer bar overflow, add logo to all components

Work Log:
- Converted PDF logo (`logo ligue des imames.pdf`) to PNG using `pdftoppm` at 300 DPI
- Processed with PIL: removed white background (made transparent), cropped to content, resized to 564x400 (retina) and 64x64 (favicon)
- Saved as `/public/logo.png` and `/public/logo-64.png`
- Fixed horizontal overflow in prayer-times.tsx: changed `overflow-hidden` to `overflow-x-hidden`, added `min-w-0` to container, reduced font sizes for smaller screens, hid gregorian date and arabic hijri on small screens with `hidden sm:inline`/`hidden md:inline`, reduced gaps
- Added logo image to all 8 locations replacing text-based placeholders:
  1. `header.tsx` - Main site header logo
  2. `admin/layout.tsx` - Admin sidebar logo
  3. `espace-membre/layout.tsx` - Member area header logo
  4. `footer.tsx` - Footer brand logo
  5. `admin/login/page.tsx` - Admin login page branding
  6. `espace-membre/login/page.tsx` - Member login page branding
  7. `carte-membre.tsx` - Membership card logo
  8. `espace-membre/page.tsx` - Member dashboard card logo
- Updated `layout.tsx` favicon from `/logo.svg` to `/logo-64.png`
- Verified build compiles successfully

Stage Summary:
- Logo extracted from PDF → `/public/logo.png` (564x400, transparent) + `/public/logo-64.png` (64x64, transparent)
- Prayer bar overflow fixed with responsive font sizing and conditional visibility
- All 8 logo locations updated from text initials to actual logo image
- Build passes successfully
