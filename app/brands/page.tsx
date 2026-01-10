"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { BrandGallery } from "@/components/BrandGallery";
import { getBrandsData } from "@/lib/brandData";
import { useMemo } from "react";

function BrandsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBrandParam = searchParams.get("brand");
  const allBrandsData = getBrandsData();

  // Find the initial selected brand index
  const initialBrandIndex = useMemo(() => {
    if (selectedBrandParam) {
      const decodedBrand = decodeURIComponent(selectedBrandParam);
      const index = allBrandsData.findIndex((b) => b.brandName === decodedBrand);
      return index >= 0 ? index : 0;
    }
    return 0;
  }, [selectedBrandParam, allBrandsData]);

  // Filter to show only the selected brand's projects, or all brands if none selected
  const filteredBrandsData = useMemo(() => {
    if (selectedBrandParam) {
      const brand = allBrandsData.find(
        (b) => b.brandName === decodeURIComponent(selectedBrandParam)
      );
      return brand ? [brand] : allBrandsData;
    }
    return allBrandsData;
  }, [selectedBrandParam, allBrandsData]);

  // Handle brand click - update URL
  const handleBrandClick = (brandIndex: number) => {
    const brand = allBrandsData[brandIndex];
    if (brand) {
      router.push(`/brands?brand=${encodeURIComponent(brand.brandName)}`);
    }
  };

  return (
    <div className="pt-20">
      <BrandGallery
        brands={filteredBrandsData}
        allBrands={allBrandsData}
        initialBrandIndex={initialBrandIndex}
        onBrandClick={handleBrandClick}
        title={selectedBrandParam ? `Work on ${decodeURIComponent(selectedBrandParam)}` : "Work by Brand"}
        subtitle={
          selectedBrandParam
            ? `Explore our work on ${decodeURIComponent(selectedBrandParam)} vehicles`
            : "Explore our work across different luxury car brands"
        }
        variant="light"
      />
    </div>
  );
}

export default function BrandsPage() {
  return (
    <Suspense fallback={<div className="pt-20 text-center text-white">Loading...</div>}>
      <BrandsContent />
    </Suspense>
  );
}

