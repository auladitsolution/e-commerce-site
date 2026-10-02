import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "স্মার্ট শপ বাংলাদেশ — বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম",
    short_name: "স্মার্ট শপ",
    description: "প্রিমিয়াম কোয়ালিটি ফ্যাশন, ইলেকট্রনিক্স, কিডস ও লাইফস্টাইল পণ্য দ্রুততম হোম ডেলিভারি ও ক্যাশ অন ডেলিভারিতে কিনুন।",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0284c7",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
