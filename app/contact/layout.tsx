import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get a Quote | VRS Specialists Brighton",
  description:
    "Get in touch with VRS Specialists for car detailing, paint correction, ceramic coating, and PPF services in Brighton and Sussex. Call 0800 002 9083 or WhatsApp.",
  openGraph: {
    title: "Contact VRS Specialists",
    description: "Get in touch for premium vehicle rejuvenation services.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

