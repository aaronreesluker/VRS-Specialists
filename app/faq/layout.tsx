import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | VRS Specialists",
  description:
    "Common questions about car detailing, paint correction, ceramic coating, and PPF services. Get answers about our processes, pricing, and what to expect.",
  openGraph: {
    title: "FAQ - VRS Specialists",
    description: "Common questions about our vehicle rejuvenation services.",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

