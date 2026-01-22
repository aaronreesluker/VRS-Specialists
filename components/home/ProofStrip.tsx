const trustPoints = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Fully Insured",
    description: "Comprehensive insurance coverage for peace of mind",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Certified",
    description: "Trained and certified in premium detailing techniques",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Premium Products",
    description: "Only the finest detailing products and coatings",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Studio & Mobile",
    description: "Brighton studio workshop or mobile service across Sussex",
  },
];

export default function ProofStrip() {
  return (
    <section className="py-8 md:py-12 bg-dark-900 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="text-brand-red mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {point.icon}
              </div>
              <h3 
                className="text-xl font-bold mb-1.5 text-white"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {point.title}
              </h3>
              <p 
                className="text-gray-300 text-sm"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

