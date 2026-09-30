import { getNextSequence } from "@/models/Counter";

export async function generateOrderNumber(prefix: string = "ORD"): Promise<string> {
  const year = new Date().getFullYear();
  const counterKey = `orders_${prefix}_${year}`;
  const seq = await getNextSequence(counterKey);
  const paddedSeq = seq.toString().padStart(6, "0");
  return `${prefix}-${year}-${paddedSeq}`;
}

export function generateTrackingToken(): string {
  // Generates unguessable token for guest order tracking
  const rand = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `${rand}${time}`.toUpperCase();
}
