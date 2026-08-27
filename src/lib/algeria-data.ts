export interface WilayaInfo {
  code: string;
  nameAr: string;
  nameFr: string;
  communes: string[];
}

export const ALGERIA_WILAYAS: WilayaInfo[] = [
  { code: '01', nameAr: 'أدرار', nameFr: 'Adrar', communes: ['أدرار - Adrar', 'رقان - Reggane', 'تيميمون - Timimoun'] },
  { code: '02', nameAr: 'الشلف', nameFr: 'Chlef', communes: ['الشلف - Chlef', 'تنس - Ténès', 'بوقادير - Boukadir'] },
  { code: '03', nameAr: 'الأغواط', nameFr: 'Laghouat', communes: ['الأغواط - Laghouat', 'آفلو - Aflou', 'حاسي الرمل - Hassi R\'Mel'] },
  { code: '04', nameAr: 'أم البواقي', nameFr: 'Oum El Bouaghi', communes: ['أم البواقي - Oum El Bouaghi', 'عين البيضاء - Aïn Beïda', 'عين مليلة - Aïn M\'lila'] },
  { code: '05', nameAr: 'باتنة', nameFr: 'Batna', communes: ['باتنة - Batna', 'بريقة - Barika', 'أريس - Arris'] },
  { code: '06', nameAr: 'بجاية', nameFr: 'Béjaïa', communes: ['بجاية - Béjaïa', 'أقبو - Akbou', 'القصر - El Kseur'] },
  { code: '07', nameAr: 'بسكرة', nameFr: 'Biskra', communes: ['بسكرة - Biskra', 'طولقة - Tolga', 'سيدي عقبة - Sidi Okba'] },
  { code: '08', nameAr: 'بشار', nameFr: 'Béchar', communes: ['بشار - Béchar', 'العبادلة - Abadla', 'تاغيت - Taghit'] },
  { code: '09', nameAr: 'البليدة', nameFr: 'Blida', communes: ['البليدة - Blida', 'بوفاريك - Boufarik', 'الأربعاء - Larbaa', 'موزاية - Mouzaïa'] },
  { code: '10', nameAr: 'البويرة', nameFr: 'Bouira', communes: ['البويرة - Bouira', 'سور الغزلان - Sour El Ghozlane', 'الأخضرية - Lakhdaria'] },
  { code: '11', nameAr: 'تمنراست', nameFr: 'Tamanrasset', communes: ['تمنراست - Tamanrasset', 'عين صالح - In Salah'] },
  { code: '12', nameAr: 'تبسة', nameFr: 'Tébessa', communes: ['تبسة - Tébessa', 'بئر العاتر - Bir El Ater', 'الشريعة - Cheria'] },
  { code: '13', nameAr: 'تلمسان', nameFr: 'Tlemcen', communes: ['تلمسان - Tlemcen', 'مغنية - Maghnia', 'منصورة - Mansourah'] },
  { code: '14', nameAr: 'تيارت', nameFr: 'Tiaret', communes: ['تيارت - Tiaret', 'فرندة - Frenda', 'السوقر - Sougueur'] },
  { code: '15', nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou', communes: ['تيزي وزو - Tizi Ouzou', 'عزازقة - Azazga', 'ذراع بن خدة - Draâ Ben Khedda'] },
  { code: '16', nameAr: 'الجزائر العاصمة', nameFr: 'Alger', communes: ['باب الزوار - Bab Ezzouar', 'دالي إبراهيم - Dely Ibrahim', 'الشراقة - Chéraga', 'الحراش - El Harrach', 'القبة - Kouba', 'بئر مراد رايس - Bir Mourad Raïs', 'حيدرة - Hydra', 'الدار البيضاء - Dar El Beïda', 'زرالدة - Zéralda'] },
  { code: '17', nameAr: 'الجلفة', nameFr: 'Djelfa', communes: ['الجلفة - Djelfa', 'عين وسارة - Aïn Oussera', 'مسعد - Messaad'] },
  { code: '18', nameAr: 'جيجل', nameFr: 'Jijel', communes: ['جيجل - Jijel', 'الطاهير - Taher', 'الميلية - El Milia'] },
  { code: '19', nameAr: 'سطيف', nameFr: 'Sétif', communes: ['سطيف - Sétif', 'العلمة - El Eulma', 'عين الكبيرة - Aïn El Kebira'] },
  { code: '20', nameAr: 'سعيدة', nameFr: 'Saïda', communes: ['سعيدة - Saïda', 'عين الحجر - Aïn El Hadjar'] },
  { code: '21', nameAr: 'سكيكدة', nameFr: 'Skikda', communes: ['سكيكدة - Skikda', 'الحروش - El Harrouch', 'القل - Collo'] },
  { code: '22', nameAr: 'سيدي بلعباس', nameFr: 'Sidi Bel Abbès', communes: ['سيدي بلعباس - Sidi Bel Abbès', 'سفيزف - Sfisef', 'تلاغ - Telagh'] },
  { code: '23', nameAr: 'عنابة', nameFr: 'Annaba', communes: ['عنابة - Annaba', 'البوني - El Bouni', 'الحجار - El Hadjar'] },
  { code: '24', nameAr: 'قالمة', nameFr: 'Guelma', communes: ['قالمة - Guelma', 'بوشقوف - Bouchegouf', 'وادي الزناتي - Oued Zenati'] },
  { code: '25', nameAr: 'قسنطينة', nameFr: 'Constantine', communes: ['قسنطينة - Constantine', 'الخروب - El Khroub', 'علي منجلي - Ali Mendjeli', 'عين السمارة - Aïn Smara'] },
  { code: '26', nameAr: 'المدية', nameFr: 'Médéa', communes: ['المدية - Médéa', 'البرواقية - Berrouaghia', 'قصر البخاري - Ksar El Boukhari'] },
  { code: '27', nameAr: 'مستغانم', nameFr: 'Mostaganem', communes: ['مستغانم - Mostaganem', 'عين تادلس - Aïn Tedles', 'سيدي علي - Sidi Ali'] },
  { code: '28', nameAr: 'المسيلة', nameFr: 'M\'Sila', communes: ['المسيلة - M\'Sila', 'بوسعادة - Bou Saâda', 'مقرة - Magra'] },
  { code: '29', nameAr: 'معسكر', nameFr: 'Mascara', communes: ['معسكر - Mascara', 'سيق - Sig', 'تيغنيف - Tighennif'] },
  { code: '30', nameAr: 'ورقلة', nameFr: 'Ouargla', communes: ['ورقلة - Ouargla', 'حاسي مسعود - Hassi Messaoud', 'تقرت - Touggourt'] },
  { code: '31', nameAr: 'وهران', nameFr: 'Oran', communes: ['وهران - Oran', 'بئر الجير - Bir El Djir', 'السانية - Es Sénia', 'أرزيو - Arzew', 'عين الترك - Aïn El Turk'] },
  { code: '32', nameAr: 'البيض', nameFr: 'El Bayadh', communes: ['البيض - El Bayadh', 'بريزينة - Brezina'] },
  { code: '33', nameAr: 'إليزي', nameFr: 'Illizi', communes: ['إليزي - Illizi', 'جانت - Djanet'] },
  { code: '34', nameAr: 'برج بوعريريج', nameFr: 'Bordj Bou Arréridj', communes: ['برج بوعريريج - Bordj Bou Arréridj', 'رأس الوادي - Ras El Oued'] },
  { code: '35', nameAr: 'بومرداس', nameFr: 'Boumerdès', communes: ['بومرداس - Boumerdès', 'بودواو - Boudouaou', 'برج منايل - Bordj Ménaïel'] },
  { code: '36', nameAr: 'الطارف', nameFr: 'El Tarf', communes: ['الطارف - El Tarf', 'القالة - El Kala'] },
  { code: '37', nameAr: 'تندوف', nameFr: 'Tindouf', communes: ['تندوف - Tindouf'] },
  { code: '38', nameAr: 'تيسمسيلت', nameFr: 'Tissemsilt', communes: ['تيسمسيلت - Tissemsilt', 'ثنية الحد - Theniet El Had'] },
  { code: '39', nameAr: 'الوادي', nameFr: 'El Oued', communes: ['الوادي - El Oued', 'جامعة - Djamaa', 'قمار - Guemar'] },
  { code: '40', nameAr: 'خنشلة', nameFr: 'Khenchela', communes: ['خنشلة - Khenchela', 'قايس - Kaïs'] },
  { code: '41', nameAr: 'سوق أهراس', nameFr: 'Souk Ahras', communes: ['سوق أهراس - Souk Ahras', 'سدراتة - Sedrata'] },
  { code: '42', nameAr: 'تيبازة', nameFr: 'Tipaza', communes: ['تيبازة - Tipaza', 'القليعة - Koléa', 'شرشال - Cherchell', 'بواسماعيل - Bou Ismaïl'] },
  { code: '43', nameAr: 'ميلة', nameFr: 'Mila', communes: ['ميلة - Mila', 'شلغوم العيد - Chelghoum Laïd', 'فرجيوة - Ferdjioua'] },
  { code: '44', nameAr: 'عين الدفلى', nameFr: 'Aïn Defla', communes: ['عين الدفلى - Aïn Defla', 'خميس مليانة - Khemis Miliana', 'مليانة - Miliana'] },
  { code: '45', nameAr: 'النعامة', nameFr: 'Naâma', communes: ['النعامة - Naâma', 'المشرية - Mécheria', 'عين الصفراء - Aïn Sefra'] },
  { code: '46', nameAr: 'عين تموشنت', nameFr: 'Aïn Témouchent', communes: ['عين تموشنت - Aïn Témouchent', 'بني صاف - Béni Saf', 'حمام بوحجر - Hammam Bou Hadjar'] },
  { code: '47', nameAr: 'غرداية', nameFr: 'Ghardaïa', communes: ['غرداية - Ghardaïa', 'متليلي - Metlili', 'القرارة - Guerrara'] },
  { code: '48', nameAr: 'غليزان', nameFr: 'Relizane', communes: ['غليزان - Relizane', 'وادي رهيو - Oued Rhiou'] },
  { code: '49', nameAr: 'تيميمون', nameFr: 'Timimoun', communes: ['تيميمون - Timimoun', 'شروين - Charouine'] },
  { code: '50', nameAr: 'برج باجي مختار', nameFr: 'Bordj Badji Mokhtar', communes: ['برج باجي مختار - Bordj Badji Mokhtar', 'تيمياوين - Timiaouine'] },
  { code: '51', nameAr: 'أولاد جلال', nameFr: 'Ouled Djellal', communes: ['أولاد جلال - Ouled Djellal', 'سيدي خالد - Sidi Khaled'] },
  { code: '52', nameAr: 'بني عباس', nameFr: 'Béni Abbès', communes: ['بني عباس - Béni Abbès', 'إقلي - Igli'] },
  { code: '53', nameAr: 'عين صالح', nameFr: 'In Salah', communes: ['عين صالح - In Salah', 'فقارة الزوى - Foggaret Ezzaouia'] },
  { code: '54', nameAr: 'عين قزام', nameFr: 'In Guezzam', communes: ['عين قزام - In Guezzam', 'تين زاوتين - Tin Zaouatine'] },
  { code: '55', nameAr: 'تقرت', nameFr: 'Touggourt', communes: ['تقرت - Touggourt', 'التبسبست - Tebesbest', 'النزلة - Nezla'] },
  { code: '56', nameAr: 'جانت', nameFr: 'Djanet', communes: ['جانت - Djanet', 'برج الحواس - Bordj El Haouès'] },
  { code: '57', nameAr: 'المغير', nameFr: 'El M\'Ghair', communes: ['المغير - El M\'Ghair', 'جامعة - Djamaa'] },
  { code: '58', nameAr: 'المنيعة', nameFr: 'El Meniaa', communes: ['المنيعة - El Meniaa', 'حاسي القارة - Hassi Gara'] },
  // الولايات 59 إلى 69 (الولايات المنتدبة والمراكز الإدارية 69 ولاية)
  { code: '59', nameAr: 'آفلو', nameFr: 'Aflou', communes: ['آفلو - Aflou', 'سبقاق - Sebgag', 'الغيشة - El Ghicha'] },
  { code: '60', nameAr: 'بريقة', nameFr: 'Barika', communes: ['بريقة - Barika', 'أمدوكال - M\'doukal', 'بيطام - Bitam'] },
  { code: '61', nameAr: 'قصر الشلالة', nameFr: 'Ksar Chellala', communes: ['قصر الشلالة - Ksar Chellala', 'سرغين - Serghine'] },
  { code: '62', nameAr: 'مسعد', nameFr: 'Messaad', communes: ['مسعد - Messaad', 'سلمانة - Selmana', 'سد الرحال - Sed Rahal'] },
  { code: '63', nameAr: 'عين وسارة', nameFr: 'Aïn Oussera', communes: ['عين وسارة - Aïn Oussera', 'القرنيني - Guernini'] },
  { code: '64', nameAr: 'بوسعادة', nameFr: 'Bou Saâda', communes: ['بوسعادة - Bou Saâda', 'الهامل - El Hamel', 'بن سرور - Ben Srour'] },
  { code: '65', nameAr: 'العلمة', nameFr: 'El Eulma', communes: ['العلمة - El Eulma', 'بئر العرش - Bir El Arch', 'جميلة - Djemila'] },
  { code: '66', nameAr: 'الأبيض سيدي الشيخ', nameFr: 'El Abiodh Sidi Cheikh', communes: ['الأبيض سيدي الشيخ - El Abiodh Sidi Cheikh', 'البنود - El Bnoud'] },
  { code: '67', nameAr: 'عين البيضاء', nameFr: 'Aïn Beïda', communes: ['عين البيضاء - Aïn Beïda', 'بريش - Berriche'] },
  { code: '68', nameAr: 'مغنية', nameFr: 'Maghnia', communes: ['مغنية - Maghnia', 'حمام بوغرارة - Hammam Boughrara'] },
  { code: '69', nameAr: 'دبدو', nameFr: 'Debdaba / El Oued Nord', communes: ['الرقيبة - Reguiba', 'الدبيلة - Debila'] },
];

export interface CategoryInfo {
  id: number;
  slug: string;
  nameAr: string;
  nameFr: string;
  icon: string;
}

export const CATEGORIES_SEED: CategoryInfo[] = [
  { id: 1, slug: 'electronics', nameAr: 'هواتف وإلكترونيات', nameFr: 'Téléphones & Électronique', icon: 'Smartphone' },
  { id: 2, slug: 'vehicles', nameAr: 'سيارات ودراجات', nameFr: 'Véhicules & Motos', icon: 'Car' },
  { id: 3, slug: 'home-appliances', nameAr: 'أجهزة منزلية وأثاث', nameFr: 'Maison & Électroménager', icon: 'Home' },
  { id: 4, slug: 'fashion', nameAr: 'ملابس وساعات', nameFr: 'Mode & Montres', icon: 'Shirt' },
  { id: 5, slug: 'photography', nameAr: 'كاميرات وتصوير', nameFr: 'Caméras & Photo', icon: 'Camera' },
  { id: 6, slug: 'gaming', nameAr: 'ألعاب وبلايستيشن', nameFr: 'Jeux Vidéo & Consoles', icon: 'Gamepad2' },
  { id: 7, slug: 'tools', nameAr: 'معدات وأدوات عمل', nameFr: 'Outillage & Matériel Pro', icon: 'Wrench' },
  { id: 8, slug: 'sports', nameAr: 'رياضة وتخييم', nameFr: 'Sport & Plein Air', icon: 'Bike' },
];

export const CONDITION_LABELS: Record<
  string,
  { ar: string; fr: string; badgeColor: string }
> = {
  NEW: { ar: 'جديد', fr: 'Neuf (Sous emballage)', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  LIKE_NEW: { ar: 'شبه جديد', fr: 'Comme neuf', badgeColor: 'bg-teal-100 text-teal-800 border-teal-300' },
  GOOD: { ar: 'مستعمل بحالة جيدة', fr: 'Bon état', badgeColor: 'bg-sky-100 text-sky-800 border-sky-300' },
  USED: { ar: 'مستعمل', fr: 'État d’usage', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  NEEDS_REPAIR: { ar: 'يحتاج إلى إصلاح', fr: 'À réparer', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export const DELIVERY_METHOD_LABELS: Record<string, { ar: string; fr: string }> = {
  HAND_TO_HAND: { ar: 'يدًا بيد', fr: 'Remise en main propre' },
  DELIVERY: { ar: 'توصيل للمنزل / المكتب (69 ولاية)', fr: 'Livraison 69 Wilayas' },
  BOTH: { ar: 'يدًا بيد + توصيل 69 ولاية', fr: 'Remise en main propre & Livraison 69 Wilayas' },
};

export const LISTING_STATUS_FLOW: {
  code: string;
  ar: string;
  fr: string;
  color: string;
}[] = [
  { code: 'DRAFT', ar: 'مسودة', fr: 'Brouillon', color: 'bg-slate-100 text-slate-700' },
  { code: 'PAYMENT_REQUIRED', ar: 'يتطلب دفع 200 دج', fr: 'Paiement 200 DZD requis', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { code: 'PAYMENT_PENDING', ar: 'بانتظار مراجعة الدفع', fr: 'Paiement à vérifier', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { code: 'PAYMENT_VERIFIED', ar: 'تم تأكيد الدفع 200 دج', fr: 'Paiement validé', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { code: 'PUBLISHED', ar: 'منشور للعامة', fr: 'Publié en ligne', color: 'bg-emerald-600 text-white' },
  { code: 'RESERVED', ar: 'محجوز', fr: 'Réservé', color: 'bg-purple-100 text-purple-800' },
  { code: 'SOLD', ar: 'تم البيع', fr: 'Vendu', color: 'bg-teal-700 text-white' },
  { code: 'EXPIRED', ar: 'منتهي الصلاحية', fr: 'Expiré', color: 'bg-gray-200 text-gray-700' },
  { code: 'REJECTED', ar: 'مرفوض إيصال الدفع', fr: 'Paiement refusé', color: 'bg-red-100 text-red-800' },
];

export function formatDZD(amount: number): string {
  return `${amount.toLocaleString('en-US')} دج`;
}
