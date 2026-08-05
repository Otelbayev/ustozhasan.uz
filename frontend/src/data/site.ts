/**
 * Sayt boʻyicha barcha matn va aloqa maʼlumotlari shu yerda.
 * Telefon, dars soatlari yoki matnlarni oʻzgartirish uchun faqat shu faylni tahrirlang.
 *
 * Kurs formati: 100% ONLAYN (Zoom orqali) — Oʻzbekistonning istalgan nuqtasidan.
 */

export const SITE = {
  domain: 'https://ustozhasan.uz',
  name: 'Ustoz Hasan',
  teacher: 'Hasan Abdullayev',
  role: 'Kompyuter savodxonligi oʻqituvchisi',
  format: '100% onlayn (Zoom orqali)',
  area: 'Oʻzbekiston boʻylab',
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
  courses: '/images/ustoz-hasan-onlayn-kompyuter-kurslari.jpg',
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
    title: 'Onlayn Ish Yuritish',
    desc: 'Gmail, Telegram, Zoom va Google Docs — masofadan ishlash uchun zarur dasturlar.',
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
  'Kursga borishga vaqt ham, imkon ham yoʻq — yashash joyingizda bunday kurs yoʻq',
] as const

export const BENEFITS = [
  {
    icon: 'video',
    title: '100% Onlayn',
    desc: 'Darslar Zoom orqali jonli oʻtadi. Uydan chiqmasdan, yoʻlga vaqt sarflamasdan oʻqiysiz.',
  },
  {
    icon: 'globe',
    title: 'Istalgan Hududdan',
    desc: 'Toshkent, viloyat yoki chet el — internet boʻlsa, darsga qoʻshilasiz.',
  },
  {
    icon: 'users',
    title: 'Kichik Guruhlar',
    desc: 'Bir guruhda 5-8 kishi. Jonli darsda savol berib, javob olasiz.',
  },
  {
    icon: 'clock',
    title: 'Qulay Jadval',
    desc: 'Ertalabki, kunduzgi va kechki guruhlar. Ishdan keyin ham ulgurasiz.',
  },
  {
    icon: 'repeat',
    title: 'Dars Yozuvlari',
    desc: 'Har bir dars yozib olinadi — darsni qoldirsangiz ham hech narsa yoʻqotmaysiz.',
  },
  {
    icon: 'award',
    title: 'Sertifikat',
    desc: 'Kursni tugatgan har bir oʻquvchiga elektron sertifikat topshiriladi.',
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
    title: 'Viloyatdagilar',
    desc: 'Yaqin atrofda kurs yoʻqmi? Darslar onlayn — uyingizdan turib oʻqiysiz.',
  },
  {
    title: 'Uy bekalari',
    desc: 'Uy ishlaridan ajralmasdan, oʻzingizga qulay vaqtdagi guruhda oʻqing.',
  },
  {
    title: '50+ yoshdagilar',
    desc: 'Sekin sur’atda, takrorlash bilan — yoshingizdan qatʼi nazar oʻrganasiz.',
  },
] as const

export const PROCESS = [
  { step: '01', title: 'Ariza qoldiring', desc: 'Saytdagi forma yoki telefon orqali bogʻlaning — tez orada javob beramiz.' },
  { step: '02', title: 'Bepul sinov darsi', desc: 'Zoom havolasini olasiz va birinchi darsga bepul qoʻshilasiz.' },
  { step: '03', title: 'Onlayn amaliyot', desc: '2 oy davomida jonli darslarda mavzuni oʻz kompyuteringizda bajarasiz.' },
  { step: '04', title: 'Sertifikat oling', desc: 'Yakuniy amaliy imtihondan soʻng elektron sertifikatga ega boʻlasiz.' },
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
    text: 'Word va PowerPointda taqdimot tayyorlashni oʻrgandim. Darslar onlayn boʻlgani uchun universitetdan keyin ham bemalol ulgurdim.',
    stars: 5,
  },
  {
    name: 'Nodira Tursunova',
    role: 'Uy bekasi, 41 yosh',
    text: 'Kompyuterdan qoʻrqib yurardim. Uydan chiqmasdan oʻqidim — endi bolalarimga vazifada yordam beraman. Rahmat, Ustoz Hasan!',
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
    role: 'Oʻqituvchi, Samarqand',
    text: 'Bizning tumanda bunday kurs yoʻq edi. Onlayn oʻqidim, dars yozuvlarini qayta koʻrib mustahkamladim. Juda qulay.',
    stars: 5,
  },
  {
    name: 'Sardor Toshmatov',
    role: 'Tadbirkor, 31 yosh',
    text: 'Doʻkon hisobini daftarda yuritardim. Endi hammasi Excelda — qaysi mahsulot foyda keltirayotganini aniq koʻraman.',
    stars: 5,
  },
] as const

export const FAQ = [
  {
    q: 'Kompyuterni umuman bilmasam ham kursga qoʻshila olamanmi?',
    a: 'Ha, albatta. Kurs 0 darajadan boshlanadi. Kompyuterni yoqishdan tortib, hujjat tayyorlashgacha bosqichma-bosqich oʻrgatiladi.',
  },
  {
    q: 'Darslar qanday oʻtiladi?',
    a: 'Barcha darslar 100% onlayn — Zoom orqali jonli oʻtadi. Ustoz ekranini koʻrsatib tushuntiradi, siz esa oʻz kompyuteringizda birga bajarasiz va istalgan payt savol berasiz.',
  },
  {
    q: 'Kurs qancha davom etadi?',
    a: 'Toʻliq kompyuter savodxonligi kursi 2 oy davom etadi — haftasiga 3 marta, har biri 1,5 soatlik jonli onlayn darslar.',
  },
  {
    q: 'Yoshim katta, oʻrganishga kech emasmi?',
    a: 'Yoʻq. Oʻquvchilarimiz orasida 50-60 yoshdagilar ham bor va ular kursni muvaffaqiyatli tugatishmoqda. Darslar sekin sur’atda, takrorlash bilan oʻtiladi. Zoomga kirishni ham birinchi darsda oʻrgatamiz.',
  },
  {
    q: 'Kompyuter yoki noutbuk boʻlishi shartmi?',
    a: 'Ha, amaliyot uchun kompyuter yoki noutbuk kerak — chunki Word va Excelni oʻz qurilmangizda mashq qilasiz. Darsni telefondan kuzatish ham mumkin, lekin natija uchun kompyuterda ishlash tavsiya etiladi.',
  },
  {
    q: 'Viloyatda yashayman, qatnasha olamanmi?',
    a: 'Ha. Kurs Oʻzbekistonning istalgan hududidan, hatto chet eldan ham ochiq. Internet va kompyuter boʻlsa yetarli.',
  },
  {
    q: 'Darsni qoldirsam, mavzu yoʻqolib ketadimi?',
    a: 'Yoʻq. Har bir dars yozib olinadi va guruh Telegram kanalida joylanadi — istalgan vaqtda koʻrib, mavzuni oʻzlashtirasiz.',
  },
  {
    q: 'Internetim sekin boʻlsa-chi?',
    a: 'Darslar oddiy uy internetiga moslangan. Aloqa uzilib qolsa ham, dars yozuvi orqali toʻliq koʻrib chiqasiz.',
  },
  {
    q: 'Kurs oxirida sertifikat beriladimi?',
    a: 'Ha. Yakuniy amaliy imtihonni topshirgan har bir oʻquvchiga kompyuter savodxonligi boʻyicha elektron sertifikat topshiriladi.',
  },
  {
    q: 'Birinchi dars haqiqatan bepulmi?',
    a: 'Ha, birinchi sinov darsi mutlaqo bepul. Zoom havolasini olasiz, darsda qatnashasiz va uslub sizga mos kelishini koʻrganingizdan keyin qaror qabul qilasiz.',
  },
] as const

export const NAV_LINKS = [
  { id: 'about', label: 'Ustoz haqida' },
  { id: 'courses', label: 'Kurslar' },
  { id: 'benefits', label: 'Afzalliklar' },
  { id: 'testimonials', label: 'Fikrlar' },
  { id: 'faq', label: 'Savollar' },
  { id: 'contact', label: 'Aloqa' },
] as const

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
