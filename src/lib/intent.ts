export type Intent =
  | { type: "request"; key: string }
  | { type: "reservation"; kind: "taxi" | "restaurant" }
  | { type: "serviceCard"; cat: "spa" | "dining" }
  | { type: "weather" }
  | { type: "itinerary" }
  | { type: "recos"; filter?: string }
  | { type: "payment" }
  | { type: "staff" }
  | null;

export function detectIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (/полотенц/i.test(t)) return { type: "request", key: "towels" };
  if (/(убор|чист|тиди)/i.test(t)) return { type: "request", key: "housekeeping" };
  if (/(конд|сломан|потек|почини|ремонт|неисправн)/i.test(t)) return { type: "request", key: "maintenance" };
  if (/(поздн.*выезд|продл.*стоянк)/i.test(t)) return { type: "request", key: "checkout" };
  if (/(прачеч|стир|глаж|погладить)/i.test(t)) return { type: "request", key: "laundry" };
  if (/(будильник|разбуд|подъём)/i.test(t)) return { type: "request", key: "wakeup" };
  if (/подушк/i.test(t)) return { type: "request", key: "pillow" };
  if (/(такси|аэропорт|трансфер|машин)/i.test(t)) return { type: "reservation", kind: "taxi" };
  if (/(спа|массаж|релакс|процедур)/i.test(t)) return { type: "serviceCard", cat: "spa" };
  if (/(ужин|ресторан|стол.*забронир)/i.test(t)) return { type: "reservation", kind: "restaurant" };
  if (/(завтрак|еда|меню|перекус|поесть|заказ.*в номер)/i.test(t)) return { type: "serviceCard", cat: "dining" };
  if (/(погод|дождь|солнечн|температур)/i.test(t)) return { type: "weather" };
  if (/(план.*ден|маршрут|чем заняться)/i.test(t)) return { type: "itinerary" };
  if (/(итальянск|паста|пицц)/i.test(t)) return { type: "recos", filter: "food" };
  if (/(рядом|неподалёку|посовет|интересн)/i.test(t)) return { type: "recos" };
  if (/(счёт|оплат|чек|расход)/i.test(t)) return { type: "payment" };
  if (/(сотрудник|менеджер|человек|реальн)/i.test(t)) return { type: "staff" };
  return null;
}
