'use client';

import { useEffect } from 'react';

const METRO_ATLANTA_SLUGS = {
  'acworth': 'acworth', 'alpharetta': 'alpharetta', 'atlanta': 'atlanta', 'austell': 'austell',
  'avondale estates': 'avondale-estates', 'berkeley lake': 'berkeley-lake', 'between': 'between',
  'brookhaven': 'brookhaven', 'brooks': 'brooks', 'buckhead': 'atlanta', 'buford': 'buford',
  'canton': 'canton', 'carrollton': 'carrollton', 'cartersville': 'cartersville', 'chamblee': 'chamblee',
  'chattahoochee hills': 'chattahoochee-hills', 'clarkston': 'clarkston', 'college park': 'college-park',
  'conyers': 'conyers', 'covington': 'covington', 'cumming': 'cumming', 'dacula': 'dacula',
  'dallas': 'dallas', 'decatur': 'decatur', 'doraville': 'doraville', 'douglasville': 'douglasville',
  'duluth': 'duluth', 'dunwoody': 'dunwoody', 'east point': 'east-point', 'fairburn': 'fairburn',
  'fayetteville': 'fayetteville', 'forest park': 'forest-park', 'gainesville': 'gainesville',
  'good hope': 'good-hope', 'grantville': 'grantville', 'grayson': 'grayson', 'griffin': 'griffin',
  'hampton': 'hampton', 'hapeville': 'hapeville', 'haralson': 'haralson', 'jersey': 'jersey',
  'johns creek': 'johns-creek', 'jonesboro': 'jonesboro', 'kennesaw': 'kennesaw',
  'lawrenceville': 'lawrenceville', 'lilburn': 'lilburn', 'lithonia': 'lithonia',
  'locust grove': 'locust-grove', 'loganville': 'loganville', 'mansfield': 'mansfield',
  'marietta': 'marietta', 'mcdonough': 'mcdonough', 'midtown': 'atlanta', 'milton': 'milton',
  'monroe': 'monroe', 'moreland': 'moreland', 'morrow': 'morrow', 'mountain park': 'mountain-park',
  'newborn': 'newborn', 'newnan': 'newnan', 'norcross': 'norcross', 'oxford': 'oxford',
  'palmetto': 'palmetto', 'peachtree city': 'peachtree-city', 'peachtree corners': 'peachtree-corners',
  'pine lake': 'pine-lake', 'porterdale': 'porterdale', 'powder springs': 'powder-springs',
  'redan': 'redan', 'roswell': 'roswell', 'sandy springs': 'sandy-springs', 'senoia': 'senoia',
  'sharpsburg': 'sharpsburg', 'smyrna': 'smyrna', 'snellville': 'snellville', 'south fulton': 'south-fulton',
  'stockbridge': 'stockbridge', 'stone mountain': 'stone-mountain', 'stonecrest': 'stonecrest',
  'sugar hill': 'sugar-hill', 'suwanee': 'suwanee', 'tucker': 'tucker', 'turin': 'turin',
  'tyrone': 'tyrone', 'union city': 'union-city', 'vinings': 'smyrna', 'walnut grove': 'walnut-grove',
  'winder': 'winder', 'woodstock': 'woodstock', 'woolsey': 'woolsey'
};

export default function GeoCityClientUpdater() {
  useEffect(() => {
    const applyCity = (cityObj) => {
      const pill = document.getElementById('geo-trust-city-pill');
      if (pill && cityObj?.slug && cityObj?.name) {
        pill.setAttribute('href', `/service-areas/${cityObj.slug}`);
        pill.textContent = `ACTIVE IN ${cityObj.name.toUpperCase()}, GA \u2192`;
      }
    };

    try {
      const cached = sessionStorage.getItem('foresight_geo_city');
      if (cached) {
        applyCity(JSON.parse(cached));
        return;
      }
    } catch {}

    const fetchLocation = async () => {
      try {
        const res = await fetch('/api/geo');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.region === 'GA' && data.city) {
          const rawCity = data.city.toLowerCase().replace(/%20/g, ' ').replace(/-/g, ' ').trim();
          const slug = METRO_ATLANTA_SLUGS[rawCity];
          if (slug) {
            const matched = { name: rawCity, slug };
            applyCity(matched);
            try { sessionStorage.setItem('foresight_geo_city', JSON.stringify(matched)); } catch {}
          }
        }
      } catch {}
    };

    const timer = setTimeout(fetchLocation, 8500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
