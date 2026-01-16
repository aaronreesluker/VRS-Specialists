import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work by Brand - Luxury Car Detailing Portfolio | VRS Specialists",
  description:
    "Explore our premium car detailing, paint correction, ceramic coating and PPF work across luxury brands including BMW, Porsche, McLaren, Ferrari, Audi, Range Rover and more in Brighton and Sussex.",
  openGraph: {
    title: "Work by Brand - Luxury Car Detailing Portfolio",
    description:
      "Explore our premium vehicle rejuvenation work across luxury car brands in Brighton and Sussex.",
  },
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}





