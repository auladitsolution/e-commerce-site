import { format, parseISO } from "date-fns";

export const BD_DISTRICTS = [
  "ঢাকা (Dhaka)",
  "চট্টগ্রাম (Chattogram)",
  "সিলেট (Sylhet)",
  "রাজশাহী (Rajshahi)",
  "খুলনা (Khulna)",
  "বরিশাল (Barishal)",
  "রংপুর (Rangpur)",
  "ময়মনসিংহ (Mymensingh)",
  "কুমিল্লা (Cumilla)",
  "গাজীপুর (Gazipur)",
  "নারায়ণগঞ্জ (Narayanganj)",
  "বগুড়া (Bogura)",
  "যশোর (Jashore)",
  "দিনাজপুর (Dinajpur)",
  "ফরিদপুর (Faridpur)",
  "পাবনা (Pabna)",
  "নোয়াখালী (Noakhali)",
  "ফেনী (Feni)",
  "ব্রাহ্মণবাড়িয়া (Brahmanbaria)",
  "কক্সবাজার (Cox's Bazar)",
  "টাঙ্গাইল (Tangail)",
  "কিশোরগঞ্জ (Kishoreganj)",
  "মানিকগঞ্জ (Manikganj)",
  "মুন্সীগঞ্জ (Munshiganj)",
  "নরসিংদী (Narsingdi)",
  "গোপালগঞ্জ (Gopalganj)",
  "মাদারীপুর (Madaripur)",
  "রাজবাড়ী (Rajbari)",
  "শরীয়তপুর (Shariatpur)",
  "সাতক্ষীরা (Satkhira)",
  "বাগেরহাট (Bagerhat)",
  "চুয়াডাঙ্গা (Chuadanga)",
  "ঝিনাইদহ (Jhenaidah)",
  "কুষ্টিয়া (Kushtia)",
  "মেহেরপুর (Meherpur)",
  "নড়াইল (Narail)",
  "সিরাজগঞ্জ (Sirajganj)",
  "নাটোর (Natore)",
  "নওগাঁ (Naogaon)",
  "চাঁপাইনবাবগঞ্জ (Chapainawabganj)",
  "জয়পুরহাট (Joypurhat)",
  "হবিগঞ্জ (Habiganj)",
  "মৌলভীবাজার (Moulvibazar)",
  "সুনামগঞ্জ (Sunamganj)",
  "কুড়িগ্রাম (Kurigram)",
  "গাইবান্ধা (Gaibandha)",
  "লালমনিরহাট (Lalmonirhat)",
  "নীলফামারী (Nilphamari)",
  "পঞ্চগড় (Panchagarh)",
  "ঠাকুরগাঁও (Thakurgaon)",
  "বরগুনা (Barguna)",
  "ভোলা (Bhola)",
  "ঝালকাঠি (Jhalokati)",
  "পটুয়াখালী (Patuakhali)",
  "পিরোজপুর (Pirojpur)",
  "জামালপুর (Jamalpur)",
  "নেত্রকোণা (Netrokona)",
  "শেরপুর (Sherpur)",
  "বান্দরবান (Bandarban)",
  "খাগড়াছড়ি (Khagrachhari)",
  "রাঙ্গামাটি (Rangamati)",
  "চাঁদপুর (Chandpur)",
  "লক্ষ্মীপুর (Lakshmipur)"
];

const BENGALI_NUMERALS: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

export function toBengaliNumber(val: number | string): string {
  if (val === undefined || val === null) return "";
  return val.toString().replace(/[0-9]/g, (w) => BENGALI_NUMERALS[w] || w);
}

export function formatBDT(amount: number, useBengaliDigits: boolean = false): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat("en-IN").format(rounded);
  if (useBengaliDigits) {
    return `৳${toBengaliNumber(formatted)}`;
  }
  return `৳${formatted}`;
}

export function formatDateBD(dateInput: string | Date | undefined): string {
  if (!dateInput) return "";
  try {
    const d = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    return format(d, "dd/MM/yyyy, hh:mm a");
  } catch {
    return String(dateInput);
  }
}

export function validateBDPhone(phone: string): boolean {
  // Cleans spaces and hyphens
  const cleaned = phone.replace(/[\s-]/g, "");
  // Matches: 013-019 (11 digits), or +88013-019, or 88013-019
  const regex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return regex.test(cleaned);
}

export function normalizeBDPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+88")) {
    return cleaned.slice(3);
  }
  if (cleaned.startsWith("88")) {
    return cleaned.slice(2);
  }
  return cleaned;
}
