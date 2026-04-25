export const GUEST = {
  firstName: "Маркус",
  lastName: "Чен",
  initials: "МЧ",
  room: "402",
  suite: "Делюкс с видом на океан",
  tier: "Gold",
  points: 6840,
  nextTier: 10000,
  checkIn: "17 апр",
  checkOut: "22 апр",
  dayOf: 3,
  totalDays: 5,
  preferences: {
    cuisine: "Итальянская",
    pillow: "Мягкая",
    coffee: "Эспрессо двойной",
    temp: 21,
    music: "Джаз",
    wakeup: "07:30",
    allergies: ["морепродукты"],
    dietary: ["низкое содержание соли"],
  },
} as const;

export const QUICK_ACTIONS = [
  { key: "dining", ico: "🍽️", label: "Питание", highlight: true },
  { key: "spa", ico: "💆", label: "Спа" },
  { key: "restaurant", ico: "🍷", label: "Ресторан" },
  { key: "taxi", ico: "🚕", label: "Такси" },
  { key: "housekeeping", ico: "🧹", label: "Уборка" },
  { key: "towels", ico: "🧺", label: "Полотенца" },
  { key: "maintenance", ico: "🔧", label: "Ремонт" },
  { key: "checkout", ico: "🔑", label: "Поздний выезд" },
  { key: "wakeup", ico: "⏰", label: "Будильник" },
  { key: "laundry", ico: "👔", label: "Прачечная" },
  { key: "minibar", ico: "🍾", label: "Мини-бар" },
  { key: "pillow", ico: "🛏️", label: "Подушки" },
  { key: "amenities", ico: "🧴", label: "Туалетные" },
  { key: "luggage", ico: "🛄", label: "Багаж" },
];

export const REQUEST_LABELS: Record<string, string> = {
  dining: "Рум-сервис",
  spa: "Спа",
  restaurant: "Ресторан",
  taxi: "Такси",
  housekeeping: "Уборка номера",
  towels: "Свежие полотенца",
  maintenance: "Ремонт",
  checkout: "Поздний выезд",
  wakeup: "Будильник",
  laundry: "Прачечная",
  minibar: "Мини-бар",
  pillow: "Замена подушек",
  amenities: "Туалетные принадлежности",
  luggage: "Багажная служба",
};

export const EXPERIENCES = [
  {
    id: 1, cat: "food", name: "Osteria del Mare", tag: "Итальянский · Высокая кухня",
    desc: "Свежая паста и прибрежные вина в каменном дворе XIX века. Шеф Лука получил вторую звезду весной.",
    dist: "0.4 км", rating: 4.8, reviews: 342, price: "$$$",
    personalized: true, badge: "Выбор шефа", openNow: true, mins: "8 мин пешком",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  },
  {
    id: 2, cat: "culture", name: "Музей наследия", tag: "Искусство · Историческое",
    desc: "Мастера Возрождения и современные прибрежные художники в одной галерее.",
    dist: "1.2 км", rating: 4.6, reviews: 189, price: "$$",
    personalized: false, badge: null, openNow: true, mins: "15 мин пешком",
    img: "https://images.unsplash.com/photo-1565060169187-5284f6d1b1c5?w=800&q=80",
  },
  {
    id: 3, cat: "nightlife", name: "Sky Lounge 360", tag: "Крыша · Коктейли",
    desc: "Панорамный вид на океан, авторские коктейли, живой саксофон каждый вечер после 21:00.",
    dist: "0.2 км", rating: 4.7, reviews: 421, price: "$$$",
    personalized: false, badge: "Любимое гостями", openNow: true, mins: "В отеле",
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
  },
  {
    id: 4, cat: "nature", name: "Прибрежная тропа", tag: "Природа · Прогулка",
    desc: "45-минутный живописный маршрут вдоль скал. Лучшее время — час до заката.",
    dist: "0.6 км", rating: 4.9, reviews: 612, price: "Бесплатно",
    personalized: false, badge: null, openNow: true, mins: "10 мин пешком",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    id: 5, cat: "food", name: "Рыбный рынок Марины", tag: "Морепродукты · Местное",
    desc: "Дневной улов готовят при гостях. Спросите Паоло — владельца в третьем поколении.",
    dist: "0.9 км", rating: 4.7, reviews: 256, price: "$$",
    personalized: true, badge: null, openNow: true, mins: "12 мин пешком",
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
  },
  {
    id: 6, cat: "shopping", name: "Ремесленный квартал", tag: "Бутики · Шопинг",
    desc: "Кожа, керамика и лён ручной работы. Найдите ателье синьоры Бьянки на углу.",
    dist: "0.5 км", rating: 4.5, reviews: 178, price: "$$",
    personalized: false, badge: null, openNow: false, mins: "7 мин пешком",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  },
  {
    id: 7, cat: "culture", name: "Амфитеатр на закате", tag: "Музыка · Площадка",
    desc: "Камерная музыка по четвергам в 2000-летнем римском амфитеатре. Билеты — у консьержа.",
    dist: "2.4 км", rating: 4.9, reviews: 98, price: "$$",
    personalized: false, badge: null, openNow: false, mins: "5 мин на машине",
    img: "https://images.unsplash.com/photo-1564769625392-651b2c7763d2?w=800&q=80",
  },
  {
    id: 8, cat: "nature", name: "Тур по Голубому гроту", tag: "Экскурсия · Полдня",
    desc: "Частная лодка, снорклинг, шампанское — три часа.",
    dist: "Причал отеля", rating: 4.9, reviews: 723, price: "$$$$",
    personalized: false, badge: "Обязательно", openNow: true, mins: "От причала",
    img: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&q=80",
  },
  {
    id: 9, cat: "food", name: "La Bottega", tag: "Итальянский · Траттория",
    desc: "Семейная с 1962 года. Дровяная печь, моцарелла каждый день.",
    dist: "0.7 км", rating: 4.6, reviews: 412, price: "$$",
    personalized: true, badge: null, openNow: true, mins: "9 мин пешком",
    img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
  },
];

export const CATEGORIES = [
  { key: "all", label: "Все" },
  { key: "food", label: "Рестораны" },
  { key: "culture", label: "Культура" },
  { key: "nightlife", label: "Ночная жизнь" },
  { key: "nature", label: "Природа" },
  { key: "shopping", label: "Шопинг" },
];

export const ITINERARY = [
  { time: "08:30", text: "Завтрак доставлен", status: "done" },
  { time: "11:00", text: "Доступ к пляжу — кабина 7", status: "done" },
  { time: "16:00", text: "Спа — Шведский массаж", status: "active" },
  { time: "19:30", text: "Ужин — Meken AI Coastal", status: "upcoming" },
  { time: "21:30", text: "Sky Lounge 360", status: "rec" },
];

export const RECENT_CHARGES = [
  { name: "Рум-сервис · Континентальный", amount: 48 },
  { name: "Спа — стоунтерапия 60 мин", amount: 180 },
  { name: "Минибар", amount: 24 },
  { name: "Прачечная (3 предмета)", amount: 36 },
  { name: "Такси до причала", amount: 54 },
];

export const STAY_HISTORY = [
  { hotel: "Meken AI Милан", spent: 1240 },
  { hotel: "Meken AI Капри", spent: 2180 },
  { hotel: "Meken AI Киото", spent: 1890 },
];
