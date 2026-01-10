import Link from "next/link";

interface Service {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  description: string;
  includes: string[];
  who: string;
  outcomes: string[];
  addOns?: string[];
}

interface ServiceCategoryProps {
  service: Service;
}

export default function ServiceCategory({ service }: ServiceCategoryProps) {
  return (
    <section id={service.id} className="scroll-mt-24">
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 md:p-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-2">
                {service.name}
              </h2>
              <p className="text-lg text-primary-600 font-semibold">
                {service.subtitle}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-3xl font-bold text-dark-900">{service.price}</p>
            </div>
          </div>
          <p className="text-lg text-dark-700">{service.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-dark-900 mb-4">
              What's Included
            </h3>
            <ul className="space-y-2">
              {service.includes.map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-dark-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-dark-900 mb-4">
              Who It's For
            </h3>
            <p className="text-dark-700 mb-6">{service.who}</p>

            <h3 className="text-xl font-bold text-dark-900 mb-4">
              Typical Outcomes
            </h3>
            <ul className="space-y-2">
              {service.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-dark-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {service.addOns && service.addOns.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-dark-900 mb-4">
              Available Add-ons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.addOns.map((addon, index) => (
                <div key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-dark-700">{addon}</span>
                  <span className="text-primary-600 font-semibold ml-2">
                    (Price on inspection)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/contact" className="btn-primary text-center">
            Request a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}

