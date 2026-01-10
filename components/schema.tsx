export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.vrsspecialists.com",
    "name": "VRS - Vehicle Rejuvenation Specialists",
    "image": "https://www.vrsspecialists.com/og-image.jpg",
    "url": "https://www.vrsspecialists.com",
    "telephone": "0800 002 9083",
    "email": "info@vrsspecialists.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Brighton",
      "addressRegion": "East Sussex",
      "addressCountry": "GB",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.8225",
      "longitude": "-0.1372",
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "17:00",
    },
    "priceRange": "££",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "50.8225",
        "longitude": "-0.1372",
      },
      "geoRadius": {
        "@type": "Distance",
        "value": "50",
        "unitCode": "KM",
      },
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Brighton",
      },
      {
        "@type": "City",
        "name": "Worthing",
      },
      {
        "@type": "State",
        "name": "Sussex",
      },
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Car Detailing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Car Detailing",
            "description": "Decontamination power wash service",
          },
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "125",
            "priceCurrency": "GBP",
          },
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Paint Correction",
            "description": "1 stage paint enhancement",
          },
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "250",
            "priceCurrency": "GBP",
          },
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Ceramic Coating",
            "description": "2 year ceramic coating protection",
          },
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "400",
            "priceCurrency": "GBP",
          },
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Paint Protection Film (PPF)",
            "description": "Front end protection film",
          },
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "1250",
            "priceCurrency": "GBP",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

