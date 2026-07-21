"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LavaBlobs from "@/components/animations/LavaBlobs";
import CustomCursor from "@/components/animations/CustomCursor";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="app-wrapper">
      <CustomCursor />
      <LavaBlobs />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
