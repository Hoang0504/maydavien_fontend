const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Nhat Anh",
  image: {
    "@type": "ImageObject",
    url: "http://HOANG-PC:3010/api/images/1742728165855-logo.jpg",
    width: 270,
    height: 270,
  },
  telephone: "19006035",
  url: `${process.env.NEXT_PUBLIC_CURRENT_URL}/`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Thon 3 - Van Phuc - Thanh Tri - Ha Noi",
    addressLocality: "Ha Noi",
    postalCode: "100000",
    addressRegion: "Ha Noi",
    addressCountry: "VN",
  },
  priceRange: "1000 - 1000000000",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "21:00",
    },
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude: "20.919189",
    longitude: "105.902028",
  },
};

export default jsonLd;
