const fs = require('fs');
const path = require('path');

const citiesPath = path.join(__dirname, 'data', 'cities.json');
const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));

// Coordinates lookup table for Metro Atlanta cities
const cityCoords = {
  "Sandy Springs": { lat: "33.9243", lng: "-84.3785" },
  "Alpharetta": { lat: "34.0754", lng: "-84.2941" },
  "Johns Creek": { lat: "34.0289", lng: "-84.1986" },
  "Roswell": { lat: "34.0234", lng: "-84.3616" },
  "Dunwoody": { lat: "33.9462", lng: "-84.3346" },
  "Marietta": { lat: "33.9526", lng: "-84.5499" },
  "Smyrna": { lat: "33.8839", lng: "-84.5144" },
  "Kennesaw": { lat: "34.0234", lng: "-84.6155" },
  "Acworth": { lat: "34.0660", lng: "-84.6769" },
  "Decatur": { lat: "33.7748", lng: "-84.2963" },
  "Brookhaven": { lat: "33.8584", lng: "-84.3402" },
  "Tucker": { lat: "33.8545", lng: "-84.2171" },
  "Peachtree City": { lat: "33.3968", lng: "-84.5958" },
  "Newnan": { lat: "33.3807", lng: "-84.7997" },
  "Fayetteville": { lat: "33.4487", lng: "-84.4549" },
  "Milton": { lat: "34.1321", lng: "-84.3005" },
  "Suwanee": { lat: "34.0526", lng: "-84.0713" },
  "Duluth": { lat: "34.0029", lng: "-84.1446" },
  "Lawrenceville": { lat: "33.9562", lng: "-83.9880" },
  "Buford": { lat: "34.1207", lng: "-84.0044" },
  "Lithonia": { lat: "33.7123", lng: "-84.1052" },
  "Atlanta": { lat: "33.7490", lng: "-84.3880" },
  "Snellville": { lat: "33.8573", lng: "-84.0199" },
  "Conyers": { lat: "33.6676", lng: "-84.0177" },
  "Covington": { lat: "33.5968", lng: "-83.8602" },
  "McDonough": { lat: "33.4473", lng: "-84.1469" },
  "Stockbridge": { lat: "33.5443", lng: "-84.2338" },
  "Woodstock": { lat: "34.1015", lng: "-84.5194" },
  "Canton": { lat: "34.2368", lng: "-84.4908" }
};

// Default fallback (Metro Atlanta centroid)
const defaultCoord = { lat: "33.7490", lng: "-84.3880" };

let updatedCount = 0;

for (const city of cities) {
  const name = city['City Name'];
  const slug = city.Slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const zip = city.Zip || '30301';
  const coords = cityCoords[name] || defaultCoord;

  const schemaObj = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": `Foresight Home Inspections, LLC - ${name}`,
    "url": `https://www.fhinspectionsatl.com/service-areas/${slug}`,
    "telephone": "+1-678-480-2110",
    "email": "inspect@foresightcmi.com",
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card, Debit Card, Check",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": name,
      "addressRegion": "GA",
      "postalCode": zip,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": coords.lat,
      "longitude": coords.lng
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "09:00",
        "closes": "17:00",
        "description": "By appointment"
      }
    ],
    "areaServed": {
      "@type": "City",
      "name": name
    },
    "sameAs": [
      "https://facebook.com/fhinspectionsatl",
      "https://www.instagram.com/fhinspectionsatl/",
      "https://www.youtube.com/@ForesightHomeInspections-t6r",
      "https://www.linkedin.com/company/foresight-home-inspections-llc/"
    ]
  };

  city['JSON-LD Schema'] = JSON.stringify(schemaObj);
  updatedCount++;
}

fs.writeFileSync(citiesPath, JSON.stringify(cities, null, 2), 'utf8');
console.log(`Successfully updated LocalBusiness JSON-LD schema with GeoCoordinates for ${updatedCount} cities.`);
