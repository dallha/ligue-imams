import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Aladhan API — free, no key required
const ALADHAN_API = 'https://api.aladhan.com/v1/timingsByCity';

interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: Record<string, string>;
    date: {
      hijri: {
        date: string;
        day: string;
        month: { number: number; en: string; ar: string; days?: number };
        year: string;
        designation: { abbreviated: string };
      };
      gregorian: {
        date: string;
        day: string;
        month: { number: number; en: string };
        year: string;
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: { id: number; name: string };
    };
  };
}

// Senegal regions
const SENEGAL_REGIONS: Record<string, { city: string; country: string }> = {
  dakar: { city: 'Dakar', country: 'Senegal' },
  saint_louis: { city: 'Saint-Louis', country: 'Senegal' },
  thiès: { city: 'Thiès', country: 'Senegal' },
  louga: { city: 'Louga', country: 'Senegal' },
  kaolack: { city: 'Kaolack', country: 'Senegal' },
  diourbel: { city: 'Diourbel', country: 'Senegal' },
  tambacounda: { city: 'Tambacounda', country: 'Senegal' },
  ziguinchor: { city: 'Ziguinchor', country: 'Senegal' },
  kolda: { city: 'Kolda', country: 'Senegal' },
  matam: { city: 'Matam', country: 'Senegal' },
  kédougou: { city: 'Kédougou', country: 'Senegal' },
  sédhiou: { city: 'Sédhiou', country: 'Senegal' },
  fatick: { city: 'Fatick', country: 'Senegal' },
  kaffrine: { city: 'Kaffrine', country: 'Senegal' },
};

const DEFAULT_REGION = 'dakar';

const HIJRI_MONTHS_FR = [
  'Muharram', 'Safar', "Rabi\u02BF al-Awwal", "Rabi\u02BF al-Thani",
  "Jumada al-Ula", 'Jumada al-Thania', 'Rajab', "Sha\u02BFban",
  'Ramadan', 'Shawwal', "Dhu al-Qi\u02BFdah", 'Dhu al-Hijjah',
];

const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get('region')?.toLowerCase() || DEFAULT_REGION;

  const regionKey = Object.keys(SENEGAL_REGIONS).find(k => k === regionParam) || DEFAULT_REGION;
  const regionConfig = SENEGAL_REGIONS[regionKey];
  const regionName = regionConfig.city;

  // ─── Check admin overrides from database ─────────────────
  let adminConfig: Record<string, string> = {};
  try {
    const configs = await db.siteConfig.findMany();
    for (const c of configs) {
      adminConfig[c.key] = c.value;
    }
  } catch (err) {
    console.error('Failed to read admin config:', err);
  }

  const prayerMode = adminConfig['prayer_mode'] || 'auto';    // 'auto' | 'manual'
  const hijriMode = adminConfig['hijri_mode'] || 'auto';       // 'auto' | 'manual'
  const adminRegion = adminConfig['prayer_region'] || 'dakar';

  // If admin has set a default region and user didn't specify one, use admin's
  const effectiveRegion = searchParams.get('region') ? regionKey : (
    Object.keys(SENEGAL_REGIONS).includes(adminRegion) ? adminRegion : regionKey
  );
  const effectiveRegionConfig = SENEGAL_REGIONS[effectiveRegion] || SENEGAL_REGIONS[DEFAULT_REGION];
  const effectiveRegionName = effectiveRegionConfig.city;

  // ─── Build timings ───────────────────────────────────────
  let timings: PrayerTimings;
  let apiHijri: AladhanResponse['data']['date']['hijri'] | null = null;
  let apiGregorian: AladhanResponse['data']['date']['gregorian'] | null = null;
  let meta: any = null;
  let usedFallback = false;

  if (prayerMode === 'manual') {
    // Use admin-defined times
    timings = {
      Fajr: adminConfig['prayer_fajr'] || '05:42',
      Sunrise: adminConfig['prayer_chourouk'] || '06:58',
      Dhuhr: adminConfig['prayer_dhuhr'] || '13:22',
      Asr: adminConfig['prayer_asr'] || '16:38',
      Maghrib: adminConfig['prayer_maghrib'] || '19:10',
      Isha: adminConfig['prayer_isha'] || '20:26',
    };
  } else {
    // Try Aladhan API
    try {
      const url = `${ALADHAN_API}?city=${encodeURIComponent(effectiveRegionConfig.city)}&country=${encodeURIComponent(effectiveRegionConfig.country)}&method=3&latitudeAdjustmentMethod=3&school=0`;

      const response = await fetch(url, {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) throw new Error(`Aladhan API error: ${response.status}`);

      const json: AladhanResponse = await response.json();
      if (json.code !== 200 || !json.data?.timings) throw new Error('Invalid Aladhan response');

      const t = json.data.timings;
      timings = {
        Fajr: t.Fajr,
        Sunrise: t.Sunrise,
        Dhuhr: t.Dhuhr,
        Asr: t.Asr,
        Maghrib: t.Maghrib,
        Isha: t.Isha,
      };

      apiHijri = json.data.date.hijri;
      apiGregorian = json.data.date.gregorian;
      meta = json.data.meta;
    } catch (error: any) {
      console.error('Prayer times API error:', error.message);
      timings = {
        Fajr: adminConfig['prayer_fajr'] || '05:42',
        Sunrise: adminConfig['prayer_chourouk'] || '06:58',
        Dhuhr: adminConfig['prayer_dhuhr'] || '13:22',
        Asr: adminConfig['prayer_asr'] || '16:38',
        Maghrib: adminConfig['prayer_maghrib'] || '19:10',
        Isha: adminConfig['prayer_isha'] || '20:26',
      };
      usedFallback = true;
    }
  }

  // ─── Build Hijri date ────────────────────────────────────
  let hijri: any;

  if (hijriMode === 'manual') {
    const hDay = adminConfig['hijri_day'] || '';
    const hMonthNum = parseInt(adminConfig['hijri_month'] || '0');
    const hYear = adminConfig['hijri_year'] || '';
    const hMonthFr = adminConfig['hijri_month_name_fr'] || HIJRI_MONTHS_FR[hMonthNum - 1] || '';
    const hMonthAr = adminConfig['hijri_month_name_ar'] || HIJRI_MONTHS_AR[hMonthNum - 1] || '';

    hijri = {
      day: hDay,
      month: {
        number: hMonthNum || 1,
        en: hMonthFr,
        ar: hMonthAr,
      },
      year: hYear,
    };
  } else if (apiHijri) {
    hijri = {
      day: apiHijri.day,
      month: apiHijri.month,
      year: apiHijri.year,
    };
  } else {
    // Fallback Hijri
    hijri = {
      day: '',
      month: { number: 0, en: '', ar: '' },
      year: '',
    };
  }

  // ─── Build Gregorian date ────────────────────────────────
  const now = new Date();
  const gregorian = apiGregorian || {
    date: now.toISOString().split('T')[0],
    day: now.getDate().toString(),
    month: { number: now.getMonth() + 1, en: now.toLocaleDateString('en-US', { month: 'long' }) },
    year: now.getFullYear().toString(),
  };

  const result = {
    date: now.toISOString().split('T')[0],
    region: effectiveRegion,
    regionName: effectiveRegionName,
    timings,
    hijri,
    gregorian,
    meta,
    mode: {
      prayer: prayerMode,
      hijri: hijriMode,
    },
    ...(usedFallback && { fallback: true }),
  };

  return NextResponse.json({ success: true, data: result });
}
