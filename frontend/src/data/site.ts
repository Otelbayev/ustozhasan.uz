/**
 * Sayt boʻyicha barcha matn va aloqa maʼlumotlari shu yerda.
 * Narx, telefon yoki dars soatlarini oʻzgartirish uchun faqat shu faylni tahrirlang.
 */

export const SITE = {
  domain: 'https://ustozhasan.uz',
  name: 'Ustoz Hasan',
  teacher: 'Hasan Abdullayev',
  role: 'Kompyuter savodxonligi oʻqituvchisi',
  city: 'Toshkent shahri',
  phone: '+998 93 305 56 35',
  phoneRaw: '+998933055635',
  telegram: 'https://t.me/Ustoz_Hasan',
  telegramUser: '@Ustoz_Hasan',
  instagram: 'http://instagram.com/ustoz_hasan',
  instagramUser: '@ustoz_hasan',
} as const

export const IMAGES = {
  teacher: '/images/hasan-abdullayev-kompyuter-savodxonligi-oqituvchisi.jpg',
  lesson: '/images/ustoz-hasan-kompyuter-savodxonligi-darslari.jpg',
  courses: '/images/ustoz-hasan-kompyuter-kurslari-toshkent.jpg',
} as const

export const STATS = [
  { num: '500+', label: 'Bitiruvchi oʻquvchi' },
  { num: '3+', label: 'Yillik tajriba' },
  { num: '99%', label: 'Mamnun oʻquvchi' },
] as const

export const COURSES = [
  {
    icon: 'monitor',
    title: 'Kompyuter Asoslari',
    desc: 'Kompyuterni yoqishdan boshlab: Windows, sichqoncha va klaviatura, fayl va papkalar bilan ishlash.',
    duration: '8 ta dars',
    topics: ['Windows tizimi', 'Fayl va papkalar', 'Dastur oʻrnatish', 'Klaviatura tezligi'],
  },
  {
    icon: 'book',
    title: 'Microsoft Word',
    desc: 'Ariza, bayonnoma, rezyume va rasmiy hujjatlarni oʻzingiz mustaqil tayyorlaysiz.',
    duration: '10 ta dars',
    topics: ['Matn formatlash', 'Jadval va rasm', 'Rezyume tayyorlash', 'Chop etish'],
  },
  {
    icon: 'zap',
    title: 'Microsoft Excel',
    desc: 'Hisob-kitob, formulalar va diagrammalar. Ish joyingizdagi hisobotlarni bir necha barobar tez tayyorlaysiz.',
    duration: '12 ta dars',
    topics: ['Formulalar', 'SUM, IF, VLOOKUP', 'Diagrammalar', 'Hisobot tayyorlash'],
  },
  {
    icon: 'target',
    title: 'Microsoft PowerPoint',
    desc: 'Diqqatni tortadigan taqdimotlar: dizayn, animatsiya va toʻgʻri chiqish qilish sirlari.',
    duration: '6 ta dars',
    topics: ['Slayd dizayni', 'Animatsiyalar', 'Grafik va diagramma', 'Taqdimot qilish'],
  },
  {
    icon: 'shield',
    title: 'Internet Xavfsizligi',
    desc: 'Firibgarlardan himoyalanish, parolni toʻgʻri saqlash va shaxsiy maʼlumotlarni yoʻqotmaslik.',
    duration: '4 ta dars',
    topics: ['Kuchli parollar', 'Firibgarlikni aniqlash', 'Bank kartasi xavfsizligi', 'Zaxira nusxa'],
  },
  {
    icon: 'message',
    title: 'Email va Onlayn Aloqa',
    desc: 'Gmail, Telegram, Zoom va Google Docs — zamonaviy ish yuritish uchun zarur dasturlar.',
    duration: '4 ta dars',
    topics: ['Gmail bilan ishlash', 'Telegram imkoniyatlari', 'Zoom uchrashuvlari', 'Google Docs'],
  },
] as const

export const PROBLEMS = [
  'Kompyuterda oddiy hujjat tayyorlash uchun ham birovdan yordam soʻraysiz',
  'Excel jadvali koʻrsangiz, nimadan boshlashni bilmay qolasiz',
  'Ish eʼlonlarida “kompyuter savodxonligi talab etiladi” degan qatorni koʻrib, ortga chekinasiz',
  'Telefon va internetdagi firibgarlardan choʻchiysiz',
  'Farzandingizga maktab vazifasida yordam bera olmaysiz',
  'Oʻrganmoqchisiz, lekin qayerdan boshlashni bilmaysiz',
] as const

export const BENEFITS = [
  {
    icon: 'users',
    title: 'Kichik Guruhlar',
    desc: 'Bir guruhda 5-8 kishi. Har bir oʻquvchiga alohida eʼtibor va yordam.',
  },
  {
    icon: 'clock',
    title: 'Qulay Jadval',
    desc: 'Ertalabki, kunduzgi va kechki guruhlar. Ishdan keyin ham ulgurasiz.',
  },
  {
    icon: 'award',
    title: 'Sertifikat',
    desc: 'Kursni tugatgan har bir oʻquvchiga sertifikat topshiriladi.',
  },
  {
    icon: 'graduation',
    title: '3+ Yillik Tajriba',
    desc: 'Hasan Abdullayev 500 dan ortiq oʻquvchini 0 dan oʻqitib chiqargan.',
  },
  {
    icon: 'laptop',
    title: 'Amaliy Mashqlar',
    desc: 'Har bir dars kompyuter oldida amaliy mashq bilan mustahkamlanadi.',
  },
  {
    icon: 'repeat',
    title: 'Cheksiz Takrorlash',
    desc: 'Tushunmagan mavzuingizni bepul qayta tinglash imkoniyati bor.',
  },
] as const

export const AUDIENCE = [
  {
    title: 'Ish qidirayotganlar',
    desc: 'Rezyume, Word va Excel koʻnikmasi bilan ish topish imkoniyatingizni bir necha barobar oshiring.',
  },
  {
    title: 'Ofis xodimlari',
    desc: 'Hisobot va hujjatlarni soatlab emas, daqiqalarda tayyorlashni oʻrganing.',
  },
  {
    title: 'Talaba va oʻquvchilar',
    desc: 'Mustaqil ish, referat va taqdimotlarni professional darajada tayyorlang.',
  },
  {
    title: 'Tadbirkorlar',
    desc: 'Savdo hisobi, mijozlar bazasi va moliyaviy nazoratni Excelda yuriting.',
  },
  {
    title: 'Uy bekalari',
    desc: 'Internet, onlayn xaridlar va farzandingizning maktab vazifalariga ishonch bilan yondashing.',
  },
  {
    title: '50+ yoshdagilar',
    desc: 'Sekin sur’atda, takrorlash bilan — yoshingizdan qatʼi nazar oʻrganasiz.',
  },
] as const

export const PROCESS = [
  { step: '01', title: 'Ariza qoldiring', desc: 'Telefon yoki Telegram orqali bogʻlaning — 15 daqiqada javob beramiz.' },
  { step: '02', title: 'Bepul sinov darsi', desc: 'Birinchi darsga bepul qatnashib, uslub sizga mos kelishini koʻrasiz.' },
  { step: '03', title: 'Amaliy oʻqish', desc: '2 oy davomida har bir mavzuni kompyuter oldida amalda bajarasiz.' },
  { step: '04', title: 'Sertifikat oling', desc: 'Yakuniy amaliy imtihondan soʻng sertifikatga ega boʻlasiz.' },
] as const

export const TESTIMONIALS = [
  {
    name: 'Gulnora Rahimova',
    role: 'Buxgalter, 34 yosh',
    text: 'Excelni umuman bilmasdim. Endi oylik hisobotlarni oʻzim tayyorlayman va ishimga ketadigan vaqt 3 barobar qisqardi. Ustoz Hasan juda sabrli tushuntiradi.',
    stars: 5,
  },
  {
    name: 'Jamshid Karimov',
    role: 'Talaba, 20 yosh',
    text: 'Word va PowerPointda taqdimot tayyorlashni oʻrgandim. Mustaqil ishlarim uchun endi hech kimga pul toʻlamayman. Tavsiya qilaman!',
    stars: 5,
  },
  {
    name: 'Nodira Tursunova',
    role: 'Uy bekasi, 41 yosh',
    text: 'Kompyuterdan qoʻrqib yurardim. Endi bolalarimga vazifada yordam beraman, internetdan xavfsiz foydalanaman. Rahmat, Ustoz Hasan!',
    stars: 5,
  },
  {
    name: 'Bekzod Ergashev',
    role: 'Sotuv menejeri, 28 yosh',
    text: 'Kursdan keyin ishxonamda hisobotlarni men yuritadigan boʻldim va lavozimim koʻtarildi. Excel darslari juda kuchli.',
    stars: 5,
  },
  {
    name: 'Dilshoda Yoʻldosheva',
    role: 'Oʻqituvchi, 46 yosh',
    text: 'Elektron jurnal va taqdimotlar bilan ishlash endi menga oson. Yoshim katta boʻlsa ham hech qanday qiyinchilik boʻlmadi.',
    stars: 5,
  },
  {
    name: 'Sardor Toshmatov',
    role: 'Tadbirkor, 31 yosh',
    text: 'Doʻkon hisobini daftarda yuritardim. Endi hammasi Excelda — qaysi mahsulot foyda keltirayotganini aniq koʻraman.',
    stars: 5,
  },
] as const

/**
 * Tariflar. Narxlar saytda koʻrsatilmaydi — `price: null` boʻlgan tarifda
 * narx oʻrniga telefon raqam chiqadi ("narx uchun qoʻngʻiroq qiling").
 */
export const PLANS = [
  {
    name: 'Sinov darsi',
    price: 'BEPUL',
    period: '1 ta dars',
    desc: 'Avval koʻring, keyin qaror qiling',
    features: [
      'Toʻliq 1,5 soatlik amaliy dars',
      'Guruh va uslub bilan tanishuv',
      'Bilim darajangizni aniqlash',
      'Shaxsiy oʻquv rejasi',
    ],
    cta: 'Bepul darsga yozilish',
    highlighted: false,
  },
  {
    name: 'Toʻliq kurs',
    price: null,
    period: 'Narx boʻyicha qoʻngʻiroq qiling',
    desc: 'Eng koʻp tanlanadigan tarif',
    features: [
      'Barcha 6 ta modul (44 ta dars)',
      'Haftasiga 3 marta, 1,5 soatdan',
      'Kichik guruh — 5-8 kishi',
      'Darslik va amaliy topshiriqlar',
      'Telegram guruhda savol-javob',
      'Yakunda sertifikat',
    ],
    cta: 'Kursga yozilish',
    highlighted: true,
  },
  {
    name: 'Individual',
    price: null,
    period: 'Narx boʻyicha qoʻngʻiroq qiling',
    desc: 'Faqat siz va ustoz',
    features: [
      'Birga-bir shaxsiy darslar',
      'Dars vaqtini oʻzingiz tanlaysiz',
      'Sizga kerakli mavzular boʻyicha',
      'Tezlashtirilgan dastur',
      'Dars oraligʻida ham qoʻllab-quvvatlash',
      'Yakunda sertifikat',
    ],
    cta: 'Individual dars',
    highlighted: false,
  },
] as const

export const FAQ = [
  {
    q: 'Kompyuterni umuman bilmasam ham kursga qoʻshila olamanmi?',
    a: 'Ha, albatta. Kurs 0 darajadan boshlanadi. Kompyuterni yoqishdan tortib, hujjat tayyorlashgacha bosqichma-bosqich oʻrgatiladi.',
  },
  {
    q: 'Kurs qancha davom etadi?',
    a: 'Toʻliq kompyuter savodxonligi kursi 2 oy davom etadi — haftasiga 3 marta, har biri 1,5 soatlik amaliy darslar.',
  },
  {
    q: 'Yoshim katta, oʻrganishga kech emasmi?',
    a: 'Yoʻq. Oʻquvchilarimiz orasida 50-60 yoshdagilar ham bor va ular kursni muvaffaqiyatli tugatishmoqda. Darslar sekin sur’atda, takrorlash bilan oʻtiladi.',
  },
  {
    q: 'Dars uchun oʻz kompyuterim boʻlishi shartmi?',
    a: 'Yoʻq, darsxonada har bir oʻquvchi uchun kompyuter mavjud. Uyda mashq qilish uchun oʻz noutbukingizni olib kelishingiz ham mumkin.',
  },
  {
    q: 'Kurs oxirida sertifikat beriladimi?',
    a: 'Ha. Yakuniy amaliy imtihonni topshirgan har bir oʻquvchiga kompyuter savodxonligi boʻyicha sertifikat topshiriladi.',
  },
  {
    q: 'Darslar qayerda oʻtiladi?',
    a: 'Darslar Toshkent shahrida oʻtiladi. Shuningdek onlayn (Zoom orqali) guruhlar ham mavjud — viloyatlardan turib ham oʻqishingiz mumkin.',
  },
  {
    q: 'Darsni qoldirsam, mavzu yoʻqolib ketadimi?',
    a: 'Yoʻq. Qoldirilgan mavzuni boshqa guruh bilan bepul qayta oʻtish yoki ustoz bilan alohida koʻrib chiqish imkoniyati bor.',
  },
  {
    q: 'Birinchi dars haqiqatan bepulmi?',
    a: 'Ha, birinchi sinov darsi mutlaqo bepul. Darsda qatnashib, uslub sizga mos kelishini koʻrganingizdan keyin qaror qabul qilasiz.',
  },
] as const

export const NAV_LINKS = [
  { id: 'about', label: 'Ustoz haqida' },
  { id: 'courses', label: 'Kurslar' },
  { id: 'benefits', label: 'Afzalliklar' },
  { id: 'pricing', label: 'Narxlar' },
  { id: 'testimonials', label: 'Fikrlar' },
  { id: 'faq', label: 'Savollar' },
  { id: 'contact', label: 'Aloqa' },
] as const

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
