import { NextResponse } from 'next/server';

// Aladhan API — free, no key required
// https://aladhan.com/prayer-times-api
const ALADHAN_API = 'https://api.aladhan.com/v1/timingsByCity';

// Cache in memory for 24h (prayer times don't change within a day)
let cachedData: { date: string; timings: PrayerTimings; region: string } | null = null;

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
        month: { number: number; en: string; ar: string };
        year: string;
        designation: { abbreviated: string };
      };
      gregorian: {
        date: string;
        day: string;
        month: { number: number; en: string };
        year: string;
        weekday: { en: string; fr?: string };
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

// Senegal regions with approximate coordinates for prayer times
const SENEGAL_REGIONS: Record<string, { city: string; country: string; lat: number; lng: number }> = {
  dakar: { city: 'Dakar', country: 'Senegal', lat: 14.6937, lng: -17.4441 },
  saint_louis: { city: 'Saint-Louis', country: 'Senegal', lat: 16.0326, lng: -16.4818 },
  thiès: { city: 'Thiès', country: 'Senegal', lat: 14.7937, lng: -16.9361 },
  louga: { city: 'Louga', country: 'Senegal', lat: 15.6178, lng: -16.2241 },
  kaolack: { city: 'Kaolack', country: 'Senegal', lat: 14.1645, lng: -16.0779 },
  diourbel: { city: 'Diourbel', country: 'Senegal', lat: 14.6553, lng: -16.2317 },
  tambacounda: { city: 'Tambacounda', country: 'Senegal', lat: 13.7701, lng: -13.6668 },
  ziguinchor: { city: 'Ziguinchor', country: 'Senegal', lat: 12.5833, lng: -16.2667 },
  kolda: { city: 'Kolda', country: 'Senegal', lat: 12.8833, lng: -14.9500 },
  matam: { city: 'Matam', country: 'Senegal', lat: 15.6559, lng: -13.2544 },
  kédougou: { city: 'Kédougou', country: 'Senegal', lat: 12.5602, lng: -12.1737 },
  sédhiou: { city: 'Sédhiou', country: 'Senegal', lat: 12.7081, lng: -15.5563 },
  fatick: { city: 'Fatick', country: 'Senegal', lat: 14.3416, lng: -16.4125 },
  kaffrine: { city: 'Kaffrine', country: 'Senegal', lat: 14.1053, lng: -15.5502 },
};

const DEFAULT_REGION = 'dakar';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get('region')?.toLowerCase() || DEFAULT_REGION;

  // Find matching region config
  const regionKey = Object.keys(SENEGAL_REGIONS).find(k => k === regionParam) || DEFAULT_REGION;
  const regionConfig = SENEGAL_REGIONS[regionKey];

  // Check cache
  const todayKey = getTodayKey();
  if (cachedData && cachedData.date === todayKey && cachedData.region === regionKey) {
    return NextResponse.json({ success: true, data: cachedData, cached: true });
  }

  try {
    // Method 3 = Muslim World League (good for West Africa)
    const url = `${ALADHAN_API}?city=${encodeURIComponent(regionConfig.city)}&country=${encodeURIComponent(regionConfig.country)}&method=3&latitudeAdjustmentMethod=3&school=0`;

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24h
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Aladhan API error: ${response.status}`);
    }

    const json: AladhanResponse = await response.json();

    if (json.code !== 200 || !json.data?.timings) {
      throw new Error('Invalid Aladhan response');
    }

    const t = json.data.timings;
    const timings: PrayerTimings = {
      Fajr: t.Fajr,
      Sunrise: t.Sunrise,
      Dhuhr: t.Dhuhr,
      Asr: t.Asr,
      Maghrib: t.Maghrib,
      Isha: t.Isha,
    };

    const hijri = json.data.date.hijri;
    const gregorian = json.data.date.gregorian;

    const result = {
      date: todayKey,
      region: regionKey,
      regionName: regionConfig.city,
      timings,
      hijri: {
        date: hijri.date,
        day: hijri.day,
        month: hijri.month,
        year: hijri.year,
        designation: hijri.designation,
      },
      gregorian: {
        date: gregorian.date,
        day: gregorian.day,
        month: gregorian.month,
        year: gregorian.year,
      },
      meta: json.data.meta,
    };

    // Update cache
    cachedData = result as any;

    return NextResponse.json({ success: true, data: result, cached: false });
  } catch (error: any) {
    console.error('Prayer times API error:', error.message);

    // Fallback: approximate times for Dakar
    const fallbackTimings: PrayerTimings = {
      Fajr: '05:42',
      Sunrise: '06:58',
      Dhuhr: '13:22',
      Asr: '16:38',
      Maghrib: '19:10',
      Isha: '20:26',
    };

    return NextResponse.json({
      success: true,
      data: {
        date: todayKey,
        region: regionKey,
        regionName: regionConfig.city,
        timings: fallbackTimings,
        fallback: true,
        error: error.message,
      },
      cached: false,
    });
  }
}
