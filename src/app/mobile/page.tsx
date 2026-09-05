import React from "react";
import LookUMobileView from "@/components/LookUMobileView";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "LookU AI - Mobile First AI Fashion Stylist Indonesia",
  description: "Stylist fashion AI untuk cuaca tropis 33°C, hijab friendly, dan personal color kulit Nusantara.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF8F5",
};

export default function MobilePreviewPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] flex justify-center items-start">
      <LookUMobileView />
    </main>
  );
}
