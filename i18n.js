/* =====================================================================
   SPRACHEN.  Türkisch ist die Quelle, Deutsch die Übersetzung.

   Im Markup steht nie Text, sondern ein Schlüssel:

     data-i18n="key"            -> textContent
     data-i18n-html="key"       -> innerHTML  (für <br>, <a>, <em>)
     data-i18n-attr="attr:key"  -> Attribut, mehrere mit ";" getrennt

   Nach jedem Wechsel geht ein Ereignis "yazar:lang" auf document los;
   script.js hängt daran den Neuaufbau der Textspalte, denn die
   Zeilenumbrüche der Überschriften fallen in jeder Sprache anders.

   Diese Datei muss VOR script.js geladen werden (beide mit defer, die
   Reihenfolge bleibt dadurch erhalten) -- sonst zerlegt die Textspalte
   noch die Schlüssel statt der Sätze.
   ===================================================================== */

(() => {
  "use strict";

  const STORE_KEY = "yazar.lang";
  const DEFAULT = "tr";

  const DICT = {
    /* =================================================================
       TÜRKÇE
       ================================================================= */
    tr: {
      "html.lang": "tr",
      "meta.title": "Yazardan Direkt — Standartların Ötesinde Yayıncılık",
      "meta.description":
        "Standartların ötesinde yayıncılık. Yazar danışmanlığı, editörlük, tasarım, çeviri, basım-dağıtım ve Amazon'da yayınlama.",

      /* ---------- Menü ---------- */
      "nav.brand": "Yazardan Direkt",
      "nav.services": "HİZMETLERİMİZ",
      "nav.global": "AMAZONDA YAYINLA",
      "nav.about": "HAKKIMIZDA",
      "nav.contact": "İLETİŞİM",
      "nav.home": "ANASAYFA",
      "nav.team": "EKİBİMİZ",
      "nav.authors": "YAZARLARIMIZ",
      "nav.faq": "SIK SORULAN SORULAR",
      "nav.shop": "HERYERDEKİTAP – KİTAP SATIŞ",
      "nav.blog": "BLOG",
      "nav.sub.consult": "Yazar Danışmanlığı",
      "nav.sub.editing": "Editörlük Hizmetleri",
      "nav.sub.design": "Tasarım",
      "nav.sub.translation": "Çeviri",
      "nav.sub.print": "Basım-Dağıtım",
      "nav.sub.ebook": "E-Kitap Formatı",
      "nav.menu": "Tüm menü",
      "nav.menu.main": "Ana menü",
      "nav.menu.open": "Menüyü aç",
      "nav.menu.close": "Menüyü kapat",
      "nav.credo":
        "Üretimi yücelten, emeği kutsayan bir yerden bakıyoruz dünyaya. Sözün kıymetini sadece çok satanlarda değil, doğru yüreklerde arıyoruz.",
      "lang.label": "Dil seçimi",
      "lang.tr": "Türkçe",
      "lang.de": "Almanca",

      /* ---------- Sahne ---------- */
      "cinema.label": "Yazardan Direkt tanıtım",
      "hero.h1": "STANDARTLARIN<br />ÖTESİNDE<br />YAYINCILIK",
      "hero.lede":
        "Her yazar, kendine ait bir ritimle ilerler. Yazardan Direkt, bu ritme kulak verir.",

      "step1.kicker": "Yazar Danışmanlığı",
      "step1.h2": "Kaleminizin Yanında, Hikâyenizin İçindeyiz.",
      "step1.text":
        "Yazarlık yolculuğunuzun ilk adımlarından itibaren yanınızdayız: fikrin şekillenmesinden yayın kararına kadar stratejik rehberlik, hedef kitle ve tür bütünlüğü danışmanlığı, birebir danışman ve bireysel geri bildirim.",

      "step2.kicker": "Editörlük Hizmeti",
      "step2.h2": "Her zaman Yazarın Yanında, Okura Giden Yolda",
      "step2.text":
        "Editörlük bir metni değiştirmekten çok onun özünü parlatmaktır: yazım tutarlılığı, yapı ve akış iyileştirmesi, anlam bütünlüğü ve son okuma güvencesi — yazarın sesine saygı duyan bir yaklaşımla.",

      "step3.kicker": "Amazon'da Yayınla",
      "step3.h2": "Bir Kitapla Başlar, Sınırları Aşan Her Yolculuk.",
      "step3.text":
        "İngilizceye çeviri ve Amazon desteğiyle kitabınız dünya raflarında yerini alsın. Kindle ve Print-on-Demand formatlarında küresel dağıtım; ISBN ve teknik gereklilikler bizde.",

      "step4.kicker": "İletişim",
      "step4.h2": "Kitabınızı birlikte yayına hazırlayalım.",

      "common.more": "Devamını oku",
      "scroll.hint": "KAYDIRIN",

      /* ---------- Kapak ---------- */
      "cover.label": "Kapak tasarımı",
      "cover.prev": "Önceki logo",
      "cover.next": "Sonraki logo",
      "cover.logo.brand": "Yazardan Direkt",
      "cover.logo.own": "Sizin logonuz",
      "cover.logo.own.text": "Logonuz\nburada olabilir",

      /* ---------- Hakkımızda ---------- */
      "about.p1":
        "Ticaretin hükmettiği yerlerde değil, yazarın sesiyle okurun vicdanının buluştuğu o görünmeyen yerdeyiz. Çünkü inanıyoruz: değer ne sistemden gelir ne vitrinden; değer, üretenden ve hissedenden gelir.",
      "about.p2":
        "Yayıncılığın özünü ne raflar belirler ne de satış stratejileri. Gerçek kıymet, bir yazarın iç sesiyle bir okurun yüreği arasında kurulan o sessiz ve sahici bağda saklıdır.",
      "about.p3":
        "Her üretimin ardında, çoğu zaman yalnız bir masa, uzun geceler ve içe dönük bir cesaret vardır. Biz o cesareti kutsal sayarız; çünkü kalemini paylaşan yazar olmasa, kelimeleri yüreğinde taşıyan okur olmasa, ne sektör kalır ne sistem.",
      "about.p4":
        "Yayıncılık bizim için bir ticaret değil, bir sorumluluktur. Rekabetin değil, emekle kurulan bir köprünün adıdır.",

      "stats.label": "Yazardan Direkt sayılarla",
      "stats.1.value": "9",
      "stats.1.label": "Yıllık yayıncılık deneyimi",
      "stats.2.value": "520",
      "stats.2.label": "Yayımlanmış eser",
      "stats.3.value": "410",
      "stats.3.label": "Yazarla iş birliği",
      "stats.4.value": "1000",
      "stats.4.label": "Alınan okur geri bildirimi",

      /* ---------- Değerler ---------- */
      "values.kicker": "Nasıl çalışıyoruz",
      "values.h2": "Yayıncılığı Bir Yoldaşlık Olarak Görüyoruz",
      "values.1.title": "Yazma Cesaretine Saygı",
      "values.1.text":
        "Her kitap, bir iç sesin cesaretidir. Biz, o sesi duyan ve yoldaşlık eden tarafız.",
      "values.2.title": "Anlatıya Eşlik Etmek",
      "values.2.text":
        "Eserinizin sadece teknik değil, duygusal ritmini de anlarız. Çünkü her anlatı, bir bütünlük ister.",
      "values.3.title": "İlk Adımı Kutsamak",
      "values.3.text":
        "İlk kitabını yayımlayan yazarlara rehberlik etmek en özel sorumluluklarımızdandır.",
      "values.4.title": "Sınırları Aşan Kitaplar",
      "values.4.text":
        "Eseriniz, yalnızca yerel raflarda değil, uluslararası okurların ellerinde de hayat bulabilir. Amazon gibi platformlara bu inançla hazırlarız.",
      "values.5.title": "Paylaşan Yayıncılık Anlayışı",
      "values.5.text":
        "Yol göstermek değil, birlikte yürümek. Her süreçte şeffaf, yakın ve dürüst bir bağ kurarız.",

      /* ---------- Hizmetler ---------- */

      "svc.consult.name": "Yazar Danışmanlığı",
      "svc.consult.text":
        "Fikrinizin şekillenme sürecinden yayın kararı aşamasına kadar, yazma deneyiminize stratejik bir bakışla eşlik ediyoruz. Hedef kitle, tür ve içerik bütünlüğü, başlık seçimi, zamanlama ve yayın modeli gibi konularda kişiye özel yönlendirme sunuyoruz.",
      "svc.consult.1": "Kişiye özel hizmet planı",
      "svc.consult.2": "Yayın öncesi hazırlık",
      "svc.consult.3": "Hedefe uygun rehberlik",
      "svc.consult.4": "Yayın sürecine eşlik",
      "svc.consult.5": "Sonuç odaklı yol haritası",

      "svc.editing.name": "Editörlük Hizmetleri",
      "svc.editing.text":
        "Anlatım tutarlılığından yapısal bütünlüğe, dil tonundan anlam akışına kadar dosyanızı dikkatle gözden geçiriyoruz. Biçim, içerik ve anlam arasında sağlıklı bir denge kurarak kaleminizin özünü korur, ifade gücünü artırırız.",
      "svc.editing.1": "Metinle duygudaşlık",
      "svc.editing.2": "Üslup ve dil tutarlılığı",
      "svc.editing.3": "Akış ve yapı düzenlemesi",
      "svc.editing.4": "Anlam ve biçim uyumu",
      "svc.editing.5": "Son okuma güvencesi",

      "svc.design.name": "Tasarım",
      "svc.design.text":
        "Tasarım, bir kitabın okuyucusuyla kurduğu ilk temastır. Kapak, mizanpaj, tipografi, illüstrasyon ve dijital uyumluluğu; yazarın anlatı tonu, hedef kitlesi ve yayımlanma amacıyla birlikte ele alıyoruz.",
      "svc.design.1": "Etki gücü yüksek kapak",
      "svc.design.2": "Sayfa tasarımı",
      "svc.design.3": "Tipografi-ritim uyumu",
      "svc.design.4": "İllüstratif görsel destek",
      "svc.design.5": "Dijital uyumlu tasarım",

      "svc.translation.name": "Çeviri",
      "svc.translation.text":
        "Bir metni çevirmek yalnızca dili değiştirmek değil, anlatının özünü başka bir dilde yeniden inşa etmektir. Her çeviri alanında yetkin çevirmenlerce hazırlanır ve ikinci bir kontrolde üslup ile tutarlılık açısından gözden geçirilir.",
      "svc.translation.1": "Disipline hâkim çeviri",
      "svc.translation.2": "Anlam ve üslup tutarlılığı",
      "svc.translation.3": "İki aşamalı kontrol",
      "svc.translation.4": "Kültürel uyumlandırma",
      "svc.translation.5": "Editörle uyum süreci",

      "svc.print.name": "Basım-Dağıtım",
      "svc.print.text":
        "Baskı ve dağıtım sürecini yazarın ihtiyacına göre planlıyor; istek üzerine basımdan yüksek tirajlara kadar farklı çözümler sunuyoruz. Seçkin kitabevleriyle iş birlikleri kuruyor, sipariş ve lojistik süreçlerini sizin yerinize yönetiyoruz.",
      "svc.print.1": "Baskı süreci danışmanlığı",
      "svc.print.2": "İstek üzerine basım",
      "svc.print.3": "Kitabevi ağına erişim",
      "svc.print.4": "Sipariş süreci takibi",
      "svc.print.5": "Geniş dağıtım ağı",

      "svc.ebook.name": "E-Kitap Formatı",
      "svc.ebook.text":
        "Metnin yapısını, görselleri, tipografiyi ve içerik akışını bir bütün olarak ele alıyor, her cihazda tutarlı bir okuma deneyimi sunacak şekilde uyarlıyoruz. ePub ve Mobi dosyalarınız platform standartlarına uygun biçimde teslim edilir.",
      "svc.ebook.1": "Görsel ve yazı uyumu",
      "svc.ebook.2": "ePub ve Mobi formatlama",
      "svc.ebook.3": "İçindekiler yapısı kurulumu",
      "svc.ebook.4": "Dosya ve sistem kontrolü",
      "svc.ebook.5": "Tüm platformlara uyum",

      /* ---------- Süreç ---------- */
      "process.kicker": "Süreç",
      "process.h2": "Fikirden Rafa, Adım Adım",
      "process.1.title": "Dosya değerlendirmesi",
      "process.1.text":
        "Eserinizi bize ulaştırın. Ön değerlendirmenin ardından size özel bir danışman ulaşır — henüz fikir aşamasındaki çalışmalar da dahil.",
      "process.2.title": "Yol haritası",
      "process.2.text":
        "Hedef kitle, tür, zamanlama ve yayın modeli birlikte belirlenir. Hangi adımların gerekli olduğuna siz karar verirsiniz.",
      "process.3.title": "Editörlük ve tasarım",
      "process.3.text":
        "Metin editörden geçer, kapak ve iç tasarım kurulur. Tüm adımlar yazarın onayıyla ilerler.",
      "process.4.title": "Basım ve dağıtım",
      "process.4.text":
        "Baskı, e-kitap ve dağıtım aynı takvimde yürür. Kitabınız kitabevlerinde, çevrimiçi platformlarda ve Heryerde Kitap'ta yerini alır.",
      "process.5.title": "Sınırların ötesi",
      "process.5.text":
        "İsteğe bağlı olarak İngilizce çeviri ve Amazon; Türkçe eserler için İstanbul Books üzerinden küresel dağıtım.",

      /* ---------- Global ---------- */
      "global.amazon.name": "Amazon'da Yayınla",
      "global.amazon.tag": "İngilizce + Global",
      "global.amazon.text":
        "Eserinizin İngilizceye çevrilmesinin ardından, Amazon'un global kitap platformlarında e-kitap (Kindle) ve Print-on-Demand sistemiyle dünyanın dört bir yanındaki okurlara ulaşmasını sağlıyoruz. Tüm teknik gereklilikler, ISBN alımı ve platforma uygun içerik düzenlemeleri tarafımızdan yürütülür.",
      "global.istanbul.name": "İstanbul Books",
      "global.istanbul.tag": "Türkçe + Global",
      "global.istanbul.text":
        "Türkçeyle yazılan her kitap, kendi coğrafyasını içinde taşır. İstanbul Books, Türkçe kitapları dünya çapında okurlarla buluşturan bir dağıtım ağıdır. İstek üzerine basım sayesinde kitabınız, tam da ihtiyaç duyulduğu anda dünyanın herhangi bir köşesinde basılıp okura ulaşır.",
      "global.istanbul.note":
        "Herhangi bir yayınevinden çıkmış kitabınızın yurt dışı yayın hakkı sizdeyse, İstanbul Books üzerinden Türkçe eserinizi uluslararası satışa sunabilirsiniz.",

      /* ---------- Ekip ---------- */
      "team.kicker": "Ekibimiz",
      "team.h2": "Yazardan Direkt Bir Sistem Değil, Bir Emek Alanıdır",
      "team.lede":
        "Yayımlanan her kitabın ardında, kelimeye saygı duyan, sürece inanan ve yazarla birlikte düşünen bir ekip bulunur.",
      "team.1.role": "Genel Koordinatör",
      "team.1.text":
        "Yayın sürecinin tüm aşamalarını titizlikle yöneten, vizyoner bir koordinasyonla ilerler.",
      "team.2.role": "Baş Editör",
      "team.2.text":
        "Metinlerin yalnızca dilini değil, anlamını da gözeten güçlü bir editöryal bakış sunar.",
      "team.3.role": "Yazar Danışmanı",
      "team.3.text":
        "Yazarlara tüm yaratım ve hazırlık sürecinde birebir eşlik eden, yol gösterici bir rehberdir.",
      "team.4.role": "Grafik Tasarımcı & Çizer",
      "team.4.text":
        "Kapaktan illüstrasyona, görselden bütünlüğe uzanan estetik dokunuşların mimarıdır.",
      "team.5.role": "Yayın Hazırlık & Tasarım Sorumlusu",
      "team.5.text":
        "Tasarım, dizgi ve matbaa öncesi tüm teknik süreçleri profesyonelce yönetir.",
      "team.6.role": "Mali İşler ve Muhasebe",
      "team.6.text":
        "Tüm finansal süreçleri şeffaflık ve titizlikle yönetir; ödemelerden raporlamaya güvenli bir işleyiş sağlar.",
      "team.7.role": "BT Operasyon ve Uygulama Yönetimi",
      "team.7.text":
        "Program kurulumları, lisanslamalar ve dijital güvenlik sistemlerinin teknik sorumlusudur.",
      "team.8.role": "Full Stack Web Geliştirici",
      "team.8.text":
        "Yazardan Direkt'in tüm web altyapısını, kullanıcı deneyimini ve yazılım geliştirmeyi üstlenir.",

      /* ---------- Yazarlarımız ---------- */
      "voices.kicker": "Yazarlarımız",
      "voices.h2": "Yazarlarımız Ne Diyor?",
      "voices.1.text":
        "Yazarlık serüvenim başladığında yayınevi konusunda çok tereddüt ediyordum. Hedefim hep dünyaya açılmak oldu ve Yazardan Direkt benim için en iyi seçimdi. Hem Türkçe hem İngilizce olarak tüm dünyada kitaplarım yayımlanıyor ve arkamda böyle çalışkan bir ekip olduğu için şanslıyım.",
      "voices.2.text":
        "Yazardan Direkt samimi, çalışkan ve deneyimli kadrosuyla güvenebileceğiniz, size aile sıcaklığını veren, yazılarınızı en güzel şekilde değerlendirip kitabınızı tüm kitlelere ulaştıran bir yayınevi.",
      "voices.3.text":
        "İlk kitabım Hafızamın Sekizinci Katı, doğru kapının önünde Yazardan Direkt'le hayata geçti. Yalnızca bir yayınevi değil, bana bir alan, bir nefes aralığı sundular. Tasarımdan hisse, başlıktan kâğıda kadar her detayda birlikte düşündük, birlikte taşıdık.",
      "voices.4.text":
        "Bir yazar olarak en çok zorlandığım şey ilk adımı atmak oldu; aradığımız ilk şey güven duygusudur. Ama Yazardan Direkt bundan daha fazlasını yaptı: işine aşkla bağlı, yüreği tertemiz insanlardan oluşan sıcak bir aile ortamı sundular.",
      "voices.5.text":
        "Ağacından Düşen Minik Kozalak, yeni bir yola çıkmış ve rotasını arıyordu. Derken yolu Yazardan Direkt ile kesişti. Anahtarını aldı, kapıyı çevirdi ve büyüleyici macera böylece başladı!",


      /* ---------- SSS ---------- */
      "faq.kicker": "Sık sorulan sorular",
      "faq.h2": "Merak Edilenler",
      "faq.1.q": "Tüm bu hizmetlerden ayrı ayrı mı yoksa bir paket olarak mı yararlanabilirim?",
      "faq.1.a":
        "Hizmetlerimiz modüler yapıdadır. İhtiyacınıza göre sadece bir adımı seçebilir ya da tüm süreci birlikte yürütebiliriz.",
      "faq.2.q": "Hazır bir dosyam yoksa da başvurabilir miyim?",
      "faq.2.a":
        "Elbette. Henüz fikir aşamasındaki çalışmalarınız için de danışmanlık ve yönlendirme desteği veriyoruz.",
      "faq.3.q": "Sürecin her adımında birebir iletişimde olur muyuz?",
      "faq.3.a":
        "Evet. Size özel danışmanınız sürecin başından sonuna kadar birebir eşlik eder ve ihtiyaçlarınıza göre yönlendirir.",
      "faq.4.q": "Editörlük yalnızca yazım ve dil bilgisi düzeltmesini mi kapsar?",
      "faq.4.a":
        "Hayır. Dil bilgisinin yanı sıra anlatım bütünlüğü, ton uyumu ve içerik akışı da değerlendirilir. Dosyanızın editörüyle tüm süreç boyunca düzenli iletişim kurabilirsiniz.",
      "faq.5.q": "Kapak tasarımında onayım alınıyor mu?",
      "faq.5.a":
        "Tüm adımlar yazarın onayıyla ilerler. Eserin niteliğine göre bir ana tasarım sunulur, gerekli durumlarda alternatifler değerlendirilir ve revize hakkı tanınır.",
      "faq.6.q": "Kaç adet basılıyor ve kitabımı kendim de satabilir miyim?",
      "faq.6.a":
        "Adet talebe göre belirlenir; genellikle düşük adetli, esnek baskı (print on demand) tercih edilir. Basılan kitapların bir kısmı yazara teslim edilir, yazar kişisel olarak satış yapabilir.",
      "faq.7.q": "E-kitap hangi formatta hazırlanıyor ve hangi platformlarda yayımlanıyor?",
      "faq.7.a":
        "Genellikle EPUB ve MOBI formatlarında hazırlanır, PDF alternatifi de sunulur. Amazon Kindle, Google Books, Kobo ve İdefix gibi global ve yerel platformlara uygun hâle getirilir.",
      "faq.8.q": "Hangi dillerde çeviri hizmeti veriliyor?",
      "faq.8.a":
        "İngilizce başta olmak üzere talebe göre farklı dillerde çeviri desteği sunulmaktadır. Süre, metnin uzunluğuna ve diline göre değişir; ortalama süre değerlendirme sonrası bildirilir.",

      /* ---------- İletişim ---------- */
      "contact.kicker": "İletişim",
      "contact.h2": "Eserinizi Bize Ulaştırın, Süreci Birlikte Başlatalım",
      "contact.lede":
        "Dosyanız bize ulaştığı andan itibaren süreç başlar. Ön değerlendirmenin ardından size özel bir danışman sizinle iletişime geçer.",
      "contact.phone.label": "Telefon",
      "contact.mail.label": "E-posta",
      "contact.hours.label": "Çalışma saatleri",
      "contact.hours.value": "Hafta içi 09:00 – 18:00",
      "contact.form.label": "İletişim formu",
      "contact.form.name": "İsim-Soyisim",
      "contact.form.email": "E-posta adresiniz",
      "contact.form.phone": "Telefon numaranız",
      "contact.form.message": "Eseriniz hakkında kısa bir not",
      "contact.form.send": "Gönder",
      "contact.form.hint":
        "Gönder'e bastığınızda e-posta programınız açılır ve mesajınız hazır olarak gelir.",

      /* ---------- Yeni bölümler ---------- */
      "leather.black": "Siyah",
      "leather.brown": "Kahve",
      "leather.bordeaux": "Bordo",
      "leather.navy": "Lacivert",
      "leather.olive": "Zeytin",
      "foil.gold": "Altın",
      "foil.silver": "Gümüş",
      "foil.copper": "Bakır",
      "foil.blind": "Kabartma",
      "cover.group.leather": "Deri",
      "cover.group.foil": "Yaldız",
      "common.goto": "Sayfaya git",
      "signposts.kicker": "Nereden başlayalım",
      "signposts.h2": "Yolunuzu Buradan Seçin",
      "sign.services.title": "Hizmetlerimiz",
      "sign.services.text": "Danışmanlıktan dağıtıma, bir kitabın hayat bulduğu altı durak.",
      "sign.about.title": "Hakkımızda",
      "sign.about.text": "Neden böyle çalıştığımız, kaç kitap yaptığımız ve kimlerle.",
      "sign.global.title": "Sınırların Ötesi",
      "sign.global.text": "Amazon'da İngilizce, İstanbul Books ile Türkçe: dünya rafları.",
      "sign.contact.title": "İletişim",
      "sign.contact.text": "Eserinizi gönderin; ön değerlendirmeden sonra danışmanınız arar.",
      "strip.kicker": "İlk adım",
      "strip.h2": "Kitabınızı birlikte yayına hazırlayalım.",
      "strip.cta": "İletişime geçin",
      "head.services.kicker": "Hizmetlerimiz",
      "head.services.h1": "Bir Kitabın Hayat Bulduğu Tüm Duraklar",
      "head.services.lede":
        "Her kitap bir fikirle başlar, ama sadece fikirle tamamlanmaz. Hizmetlerimiz modüler yapıdadır: ihtiyacınıza göre tek bir adımı seçebilir ya da tüm süreci birlikte yürütebiliriz.",
      "head.about.kicker": "Hakkımızda",
      "head.about.h1": "Kitapların Yolculuğa Dönüştüğü Yer",
      "head.about.lede":
        "Üretimi yücelten, emeği kutsayan bir yerden bakıyoruz dünyaya. Sözün kıymetini sadece çok satanlarda değil, doğru yüreklerde arıyoruz.",
      "head.global.kicker": "Amazon'da Yayınla",
      "head.global.h1": "Kaleminizin İzi, Artık Sınırların Ötesinde",
      "head.global.lede":
        "İngilizce eserleriniz için Amazon, Türkçe kitaplarınız için İstanbul Books yanınızda. Eserinizi dünyanın dört bir yanındaki okurlarla buluşturuyoruz.",
      "head.contact.kicker": "İletişim",
      "head.contact.h1": "Eserinizi Bize Ulaştırın, Süreci Birlikte Başlatalım",
      "head.contact.lede":
        "Dosyanız bize ulaştığı andan itibaren süreç başlar. Ön değerlendirmenin ardından size özel bir danışman sizinle iletişime geçer.",

      "world.kicker": "Nasıl işliyor",
      "world.h2": "Üç Adımda Dünya Rafları",
      "world.1.title": "Çeviri",
      "world.1.text":
        "Eseriniz, alanında yetkin çevirmenlerce İngilizceye çevrilir ve ikinci bir kontrolde üslup ile tutarlılık açısından gözden geçirilir.",
      "world.2.title": "Format ve ISBN",
      "world.2.text":
        "Kindle ve Print-on-Demand için dosya hazırlığı, ISBN alımı ve platforma uygun içerik düzenlemeleri tarafımızdan yürütülür.",
      "world.3.title": "Küresel dağıtım",
      "world.3.text":
        "Kitabınız Amazon'un tüm dünyadaki platformlarında satışa açılır; Türkçe eserler için aynı yolu İstanbul Books üzerinden kurarız.",
      /* ---------- Alt bilgi ---------- */
      "contact.mobile.label": "Cep telefonu",
      "footer.whatsapp": "WhatsApp Desteği",
      "footer.link.shop": "HeryerdeKitap – Kitap Satış",
      "footer.link.blog": "Blog",
      "footer.link.authors": "Yazarlarımız",
      "footer.link.about": "Hakkımızda",
      "footer.link.team": "Ekibimiz",
      "footer.link.global": "Amazon'da Yayınla",
      "footer.link.faq": "Sık sorulan sorular",
      "footer.credo":
        "Gücün yazarda, anlamın okurda olduğuna inanıyoruz. Bir kitabın raflarda yer alması değil, bir kalpte yer bulması önemlidir.",
      "footer.services": "Hizmetler",
      "footer.company": "Kurum",
      "footer.reach": "Bize ulaşın",
      "footer.rights": "Tüm hakları saklıdır.",
      "footer.top": "Başa dön",
    },

    /* =================================================================
       DEUTSCH
       ================================================================= */
    de: {
      "html.lang": "de",
      "meta.title": "Yazardan Direkt — Verlagsarbeit jenseits des Üblichen",
      "meta.description":
        "Verlagsarbeit jenseits des Üblichen. Autorenberatung, Lektorat, Gestaltung, Übersetzung, Druck und Vertrieb sowie Veröffentlichung auf Amazon.",

      /* ---------- Menü ---------- */
      "nav.brand": "Yazardan Direkt",
      "nav.services": "LEISTUNGEN",
      "nav.global": "AUF AMAZON VERÖFFENTLICHEN",
      "nav.about": "ÜBER UNS",
      "nav.contact": "KONTAKT",
      "nav.home": "STARTSEITE",
      "nav.team": "UNSER TEAM",
      "nav.authors": "UNSERE AUTORINNEN & AUTOREN",
      "nav.faq": "HÄUFIGE FRAGEN",
      "nav.shop": "HERYERDEKİTAP – BUCHVERKAUF",
      "nav.blog": "BLOG",
      "nav.sub.consult": "Autorenberatung",
      "nav.sub.editing": "Lektorat",
      "nav.sub.design": "Gestaltung",
      "nav.sub.translation": "Übersetzung",
      "nav.sub.print": "Druck und Vertrieb",
      "nav.sub.ebook": "E-Book-Format",
      "nav.menu": "Gesamtes Menü",
      "nav.menu.main": "Hauptmenü",
      "nav.menu.open": "Menü öffnen",
      "nav.menu.close": "Menü schließen",
      "nav.credo":
        "Wir sehen die Welt von einem Ort aus, der das Schaffen erhöht und die Arbeit achtet. Den Wert des Wortes suchen wir nicht allein in Bestsellerlisten, sondern in den richtigen Herzen.",
      "lang.label": "Sprachwahl",
      "lang.tr": "Türkisch",
      "lang.de": "Deutsch",

      /* ---------- Sahne ---------- */
      "cinema.label": "Yazardan Direkt — Einführung",
      "hero.h1": "VERLAGSARBEIT<br />JENSEITS DES<br />ÜBLICHEN",
      "hero.lede":
        "Jede Autorin, jeder Autor geht in einem eigenen Rhythmus voran. Yazardan Direkt hört diesem Rhythmus zu.",

      "step1.kicker": "Autorenberatung",
      "step1.h2": "An Ihrer Feder, mitten in Ihrer Geschichte.",
      "step1.text":
        "Von den ersten Schritten Ihres Schreibwegs an sind wir an Ihrer Seite: strategische Begleitung von der Idee bis zur Veröffentlichungsentscheidung, Beratung zu Zielgruppe und Genre, eine feste Ansprechperson und persönliche Rückmeldung.",

      "step2.kicker": "Lektorat",
      "step2.h2": "Immer an Ihrer Seite, auf dem Weg zu den Lesenden",
      "step2.text":
        "Lektorat heißt weniger, einen Text zu verändern, als seinen Kern zum Leuchten zu bringen: sprachliche Stimmigkeit, Aufbau und Fluss, Sinnzusammenhang und eine verlässliche Schlusskorrektur — in einer Haltung, die Ihre Stimme achtet.",

      "step3.kicker": "Auf Amazon veröffentlichen",
      "step3.h2": "Jede Reise über Grenzen hinweg beginnt mit einem Buch.",
      "step3.text":
        "Mit Übersetzung ins Englische und Amazon findet Ihr Buch seinen Platz in den Regalen der Welt. Weltweiter Vertrieb als Kindle-E-Book und Print-on-Demand; ISBN und technische Anforderungen übernehmen wir.",

      "step4.kicker": "Kontakt",
      "step4.h2": "Bringen wir Ihr Buch gemeinsam zur Veröffentlichung.",

      "common.more": "Mehr lesen",
      "scroll.hint": "SCROLLEN",

      /* ---------- Kapak ---------- */
      "cover.label": "Umschlaggestaltung",
      "cover.prev": "Vorheriges Logo",
      "cover.next": "Nächstes Logo",
      "cover.logo.brand": "Yazardan Direkt",
      "cover.logo.own": "Ihr Logo",
      "cover.logo.own.text": "Hier steht\nIhr Logo",

      /* ---------- Über uns ---------- */
      "about.p1":
        "Wir stehen nicht dort, wo der Handel regiert, sondern an jenem unsichtbaren Ort, an dem die Stimme der Schreibenden auf das Gewissen der Lesenden trifft. Denn wir glauben: Wert entsteht weder im System noch im Schaufenster — Wert entsteht bei denen, die schaffen, und bei denen, die fühlen.",
      "about.p2":
        "Über das Wesen des Verlegens entscheiden weder Regale noch Verkaufsstrategien. Der wahre Wert liegt in jener stillen, echten Verbindung zwischen der inneren Stimme der Schreibenden und dem Herzen der Lesenden.",
      "about.p3":
        "Hinter jedem Werk steht meist ein einsamer Schreibtisch, stehen lange Nächte und ein nach innen gewandter Mut. Diesen Mut halten wir heilig: ohne die, die ihre Feder teilen, und ohne die, die Worte im Herzen tragen, bliebe weder Branche noch System.",
      "about.p4":
        "Verlegen ist für uns kein Geschäft, sondern eine Verantwortung — nicht der Name eines Wettbewerbs, sondern einer Brücke, die aus Arbeit gebaut ist.",

      "stats.label": "Yazardan Direkt in Zahlen",
      "stats.1.value": "9",
      "stats.1.label": "Jahre Verlagserfahrung",
      "stats.2.value": "520",
      "stats.2.label": "Veröffentlichte Werke",
      "stats.3.value": "410",
      "stats.3.label": "Begleitete Autorinnen und Autoren",
      "stats.4.value": "1000",
      "stats.4.label": "Rückmeldungen von Lesenden",

      /* ---------- Werte ---------- */
      "values.kicker": "Wie wir arbeiten",
      "values.h2": "Wir verstehen Verlagsarbeit als Weggemeinschaft",
      "values.1.title": "Achtung vor dem Mut zu schreiben",
      "values.1.text":
        "Jedes Buch ist der Mut einer inneren Stimme. Wir sind die Seite, die diese Stimme hört und sie begleitet.",
      "values.2.title": "Die Erzählung begleiten",
      "values.2.text":
        "Wir erfassen nicht nur den handwerklichen, sondern auch den emotionalen Rhythmus Ihres Werkes. Denn jede Erzählung verlangt Ganzheit.",
      "values.3.title": "Den ersten Schritt ehren",
      "values.3.text":
        "Menschen bei ihrem ersten Buch zu begleiten gehört zu den Aufgaben, die uns am meisten bedeuten.",
      "values.4.title": "Bücher, die Grenzen überschreiten",
      "values.4.text":
        "Ihr Werk kann nicht nur in den Regalen vor Ort leben, sondern auch in den Händen internationaler Lesender. In dieser Überzeugung bereiten wir es für Plattformen wie Amazon vor.",
      "values.5.title": "Verlegen heißt teilen",
      "values.5.text":
        "Nicht den Weg weisen, sondern ihn gemeinsam gehen. In jedem Schritt entsteht eine offene, nahe und ehrliche Verbindung.",

      /* ---------- Leistungen ---------- */

      "svc.consult.name": "Autorenberatung",
      "svc.consult.text":
        "Von der Entstehung Ihrer Idee bis zur Entscheidung über die Veröffentlichung begleiten wir Ihr Schreiben mit einem strategischen Blick. Zu Zielgruppe, Genre und inhaltlicher Geschlossenheit, Titelwahl, Zeitplanung und Veröffentlichungsmodell beraten wir persönlich.",
      "svc.consult.1": "Persönlicher Leistungsplan",
      "svc.consult.2": "Vorbereitung vor der Veröffentlichung",
      "svc.consult.3": "Begleitung mit klarem Ziel",
      "svc.consult.4": "Begleitung durch den Veröffentlichungsprozess",
      "svc.consult.5": "Ergebnisorientierter Fahrplan",

      "svc.editing.name": "Lektorat",
      "svc.editing.text":
        "Von der sprachlichen Stimmigkeit bis zum Aufbau, vom Ton bis zum Sinnfluss lesen wir Ihr Manuskript aufmerksam durch. Wir schaffen ein tragfähiges Gleichgewicht zwischen Form, Inhalt und Bedeutung: Ihre Stimme bleibt, ihre Wirkung wächst.",
      "svc.editing.1": "Einfühlung in den Text",
      "svc.editing.2": "Stimmigkeit von Stil und Sprache",
      "svc.editing.3": "Fluss und Aufbau",
      "svc.editing.4": "Einklang von Sinn und Form",
      "svc.editing.5": "Verlässliche Schlusskorrektur",

      "svc.design.name": "Gestaltung",
      "svc.design.text":
        "Gestaltung ist die erste Berührung eines Buches mit seinen Lesenden. Umschlag, Satzspiegel, Typografie, Illustration und digitale Tauglichkeit entwickeln wir zusammen mit Ihrem Erzählton, Ihrer Zielgruppe und dem Zweck der Veröffentlichung.",
      "svc.design.1": "Umschlag mit Wirkung",
      "svc.design.2": "Seitengestaltung",
      "svc.design.3": "Typografie im Rhythmus des Textes",
      "svc.design.4": "Illustrative Unterstützung",
      "svc.design.5": "Gestaltung für Druck und Bildschirm",

      "svc.translation.name": "Übersetzung",
      "svc.translation.text":
        "Einen Text zu übersetzen heißt nicht, die Sprache zu wechseln, sondern den Kern der Erzählung in einer anderen Sprache neu zu bauen. Jede Übersetzung entsteht bei fachlich einschlägigen Übersetzerinnen und Übersetzern und wird in einem zweiten Durchgang auf Stil und Stimmigkeit geprüft.",
      "svc.translation.1": "Übersetzung mit Fachkenntnis",
      "svc.translation.2": "Stimmigkeit von Sinn und Stil",
      "svc.translation.3": "Zweistufige Prüfung",
      "svc.translation.4": "Kulturelle Anpassung",
      "svc.translation.5": "Abstimmung mit dem Lektorat",

      "svc.print.name": "Druck und Vertrieb",
      "svc.print.text":
        "Druck und Vertrieb planen wir nach Ihrem Bedarf — von Print-on-Demand bis zu hohen Auflagen. Wir arbeiten mit ausgewählten Buchhandlungen zusammen und übernehmen Bestellungen, Lager und Logistik für Sie.",
      "svc.print.1": "Beratung zum Druckprozess",
      "svc.print.2": "Druck auf Anfrage",
      "svc.print.3": "Zugang zum Buchhandelsnetz",
      "svc.print.4": "Verfolgung der Bestellungen",
      "svc.print.5": "Weites Vertriebsnetz",

      "svc.ebook.name": "E-Book-Format",
      "svc.ebook.text":
        "Textaufbau, Bilder, Typografie und Inhaltsfluss behandeln wir als Ganzes und richten sie so ein, dass auf jedem Gerät ein stimmiges Leseerlebnis entsteht. Ihre ePub- und Mobi-Dateien liefern wir nach den Standards der Plattformen aus.",
      "svc.ebook.1": "Einklang von Bild und Text",
      "svc.ebook.2": "ePub- und Mobi-Formatierung",
      "svc.ebook.3": "Aufbau des Inhaltsverzeichnisses",
      "svc.ebook.4": "Datei- und Systemprüfung",
      "svc.ebook.5": "Tauglich für alle Plattformen",

      /* ---------- Ablauf ---------- */
      "process.kicker": "Ablauf",
      "process.h2": "Von der Idee ins Regal, Schritt für Schritt",
      "process.1.title": "Sichtung des Manuskripts",
      "process.1.text":
        "Senden Sie uns Ihr Werk. Nach einer ersten Sichtung meldet sich eine Beraterin oder ein Berater bei Ihnen — auch wenn Ihre Arbeit noch im Ideenstadium ist.",
      "process.2.title": "Fahrplan",
      "process.2.text":
        "Zielgruppe, Genre, Zeitplan und Veröffentlichungsmodell legen wir gemeinsam fest. Welche Schritte nötig sind, entscheiden Sie.",
      "process.3.title": "Lektorat und Gestaltung",
      "process.3.text":
        "Der Text geht durchs Lektorat, Umschlag und Innengestaltung entstehen. Jeder Schritt geht erst mit Ihrer Zustimmung weiter.",
      "process.4.title": "Druck und Vertrieb",
      "process.4.text":
        "Druck, E-Book und Vertrieb laufen im selben Zeitplan. Ihr Buch findet seinen Platz im Buchhandel, auf Online-Plattformen und bei Heryerde Kitap.",
      "process.5.title": "Über die Grenzen hinaus",
      "process.5.text":
        "Auf Wunsch Übersetzung ins Englische und Amazon; für türkischsprachige Werke weltweiter Vertrieb über İstanbul Books.",

      /* ---------- Global ---------- */
      "global.amazon.name": "Auf Amazon veröffentlichen",
      "global.amazon.tag": "Englisch + weltweit",
      "global.amazon.text":
        "Nach der Übersetzung ins Englische erreicht Ihr Werk über die weltweiten Buchplattformen von Amazon als E-Book (Kindle) und über Print-on-Demand Lesende in aller Welt. Alle technischen Anforderungen, die ISBN und die plattformgerechte Aufbereitung übernehmen wir.",
      "global.istanbul.name": "İstanbul Books",
      "global.istanbul.tag": "Türkisch + weltweit",
      "global.istanbul.text":
        "Jedes auf Türkisch geschriebene Buch trägt seine eigene Landschaft in sich. İstanbul Books ist ein Vertriebsnetz, das türkischsprachige Bücher mit Lesenden weltweit zusammenbringt. Dank Print-on-Demand wird Ihr Buch genau dann gedruckt, wenn es gebraucht wird — an jedem Ort der Welt.",
      "global.istanbul.note":
        "Wenn Sie die Auslandsrechte an Ihrem bereits erschienenen Buch halten, können Sie Ihr türkischsprachiges Werk über İstanbul Books international anbieten.",

      /* ---------- Team ---------- */
      "team.kicker": "Unser Team",
      "team.h2": "Yazardan Direkt ist kein System, sondern ein Ort der Arbeit",
      "team.lede":
        "Hinter jedem veröffentlichten Buch steht ein Team, das das Wort achtet, an den Weg glaubt und gemeinsam mit den Schreibenden denkt.",
      "team.1.role": "Generalkoordination",
      "team.1.text":
        "Führt alle Phasen der Veröffentlichung mit Sorgfalt und einer vorausschauenden Koordination.",
      "team.2.role": "Leitendes Lektorat",
      "team.2.text":
        "Bringt einen starken lektorierenden Blick mit, der nicht nur die Sprache, sondern auch den Sinn der Texte im Auge behält.",
      "team.3.role": "Autorenberatung",
      "team.3.text":
        "Begleitet Schreibende persönlich durch den gesamten Prozess des Schaffens und der Vorbereitung.",
      "team.4.role": "Grafikdesign & Illustration",
      "team.4.text":
        "Gestaltet die ästhetischen Entscheidungen vom Umschlag über die Illustration bis zur Geschlossenheit des Bildes.",
      "team.5.role": "Satz & Druckvorstufe",
      "team.5.text":
        "Führt Gestaltung, Satz und alle technischen Schritte vor dem Druck professionell durch.",
      "team.6.role": "Finanzen & Buchhaltung",
      "team.6.text":
        "Führt alle finanziellen Abläufe offen und genau — von Zahlungen bis zur Auswertung, in einem verlässlichen Rahmen.",
      "team.7.role": "IT-Betrieb & Anwendungen",
      "team.7.text":
        "Verantwortet Installationen, Lizenzen und die Systeme der digitalen Sicherheit.",
      "team.8.role": "Full-Stack-Webentwicklung",
      "team.8.text":
        "Verantwortet die gesamte Web-Infrastruktur, die Benutzerführung und die Entwicklung von Yazardan Direkt.",

      /* ---------- Stimmen ---------- */
      "voices.kicker": "Unsere Autorinnen und Autoren",
      "voices.h2": "Was unsere Autorinnen und Autoren sagen",
      "voices.1.text":
        "Als mein Weg als Autorin begann, war ich beim Thema Verlag sehr unsicher. Mein Ziel war immer, hinaus in die Welt zu gehen — und Yazardan Direkt war für mich die beste Wahl. Meine Bücher erscheinen auf Türkisch und auf Englisch weltweit, und ich bin froh, ein so fleißiges Team hinter mir zu haben.",
      "voices.2.text":
        "Yazardan Direkt ist ein Verlag, dem man vertrauen kann: herzlich, fleißig und erfahren. Man fühlt sich wie in einer Familie, die Texte werden mit Sorgfalt gelesen und das Buch erreicht alle, die es erreichen soll.",
      "voices.3.text":
        "Mein erstes Buch, «Die achte Etage meines Gedächtnisses», kam mit Yazardan Direkt zur Welt — vor der richtigen Tür. Sie waren nicht nur ein Verlag: sie gaben mir einen Raum, einen Atemzug. Von der Gestaltung bis zum Gefühl, vom Titel bis zum Papier haben wir jedes Detail gemeinsam gedacht und gemeinsam getragen.",
      "voices.4.text":
        "Das Schwerste für mich als Autor war der erste Schritt; was man zuerst sucht, ist Vertrauen. Yazardan Direkt hat mehr gegeben: ein warmes, familiäres Umfeld aus Menschen, die ihre Arbeit lieben und ein reines Herz haben.",
      "voices.5.text":
        "«Der kleine Zapfen, der von seinem Baum fiel» hatte sich auf den Weg gemacht und suchte seine Richtung. Dann kreuzte sein Weg den von Yazardan Direkt. Er nahm seinen Schlüssel, drehte ihn in der Tür — und so begann das Abenteuer.",


      /* ---------- Häufige Fragen ---------- */
      "faq.kicker": "Häufige Fragen",
      "faq.h2": "Was oft gefragt wird",
      "faq.1.q": "Kann ich diese Leistungen einzeln buchen oder nur als Paket?",
      "faq.1.a":
        "Unsere Leistungen sind modular aufgebaut. Je nach Bedarf können Sie einen einzelnen Schritt wählen oder den gesamten Weg mit uns gehen.",
      "faq.2.q": "Kann ich mich auch ohne fertiges Manuskript melden?",
      "faq.2.a":
        "Selbstverständlich. Auch für Arbeiten, die noch im Ideenstadium sind, beraten und begleiten wir Sie.",
      "faq.3.q": "Habe ich in jedem Schritt eine persönliche Ansprechperson?",
      "faq.3.a":
        "Ja. Ihre Beraterin oder Ihr Berater begleitet Sie von Anfang bis Ende persönlich und richtet das Vorgehen nach Ihrem Bedarf aus.",
      "faq.4.q": "Umfasst das Lektorat nur Rechtschreibung und Grammatik?",
      "faq.4.a":
        "Nein. Neben der Grammatik werden auch die Geschlossenheit der Darstellung, der Einklang des Tons und der Inhaltsfluss geprüft. Mit dem Lektorat Ihres Manuskripts stehen Sie während des ganzen Prozesses in regelmäßigem Austausch.",
      "faq.5.q": "Wird der Umschlag mit mir abgestimmt?",
      "faq.5.a":
        "Jeder Schritt geht erst mit Ihrer Zustimmung weiter. Je nach Werk legen wir einen Hauptentwurf vor, prüfen bei Bedarf Alternativen und räumen ein Recht auf Überarbeitung ein.",
      "faq.6.q": "Wie hoch ist die Auflage, und darf ich mein Buch selbst verkaufen?",
      "faq.6.a":
        "Die Auflage richtet sich nach dem Bedarf; meist wird eine kleine, flexible Auflage (Print-on-Demand) gewählt. Ein Teil der gedruckten Bücher geht an Sie, und Sie dürfen selbst verkaufen.",
      "faq.7.q": "In welchem Format entsteht das E-Book, und wo erscheint es?",
      "faq.7.a":
        "In der Regel in EPUB und MOBI, auf Wunsch zusätzlich als PDF. Die Dateien werden für weltweite und lokale Plattformen wie Amazon Kindle, Google Books, Kobo und İdefix vorbereitet.",
      "faq.8.q": "In welche Sprachen wird übersetzt?",
      "faq.8.a":
        "In erster Linie ins Englische, auf Anfrage auch in weitere Sprachen. Die Dauer richtet sich nach Länge und Sprache des Textes; sie wird nach der Sichtung genannt.",

      /* ---------- Kontakt ---------- */
      "contact.kicker": "Kontakt",
      "contact.h2": "Senden Sie uns Ihr Werk — beginnen wir gemeinsam",
      "contact.lede":
        "Der Prozess beginnt in dem Moment, in dem Ihr Manuskript bei uns ist. Nach der ersten Sichtung meldet sich eine persönliche Ansprechperson bei Ihnen.",
      "contact.phone.label": "Telefon",
      "contact.mail.label": "E-Mail",
      "contact.hours.label": "Erreichbarkeit",
      "contact.hours.value": "Montag bis Freitag, 9 – 18 Uhr",
      "contact.form.label": "Kontaktformular",
      "contact.form.name": "Vor- und Nachname",
      "contact.form.email": "Ihre E-Mail-Adresse",
      "contact.form.phone": "Ihre Telefonnummer",
      "contact.form.message": "Eine kurze Notiz zu Ihrem Werk",
      "contact.form.send": "Absenden",
      "contact.form.hint":
        "Beim Absenden öffnet sich Ihr E-Mail-Programm mit der fertigen Nachricht.",

      /* ---------- Neue Abschnitte ---------- */
      "leather.black": "Schwarz",
      "leather.brown": "Braun",
      "leather.bordeaux": "Bordeaux",
      "leather.navy": "Dunkelblau",
      "leather.olive": "Olivgrün",
      "foil.gold": "Gold",
      "foil.silver": "Silber",
      "foil.copper": "Kupfer",
      "foil.blind": "Blindprägung",
      "cover.group.leather": "Leder",
      "cover.group.foil": "Prägung",
      "common.goto": "Zur Seite",
      "signposts.kicker": "Wo fangen wir an",
      "signposts.h2": "Wählen Sie hier Ihren Weg",
      "sign.services.title": "Leistungen",
      "sign.services.text": "Von der Beratung bis zum Vertrieb: die sechs Stationen eines Buches.",
      "sign.about.title": "Über uns",
      "sign.about.text": "Warum wir so arbeiten, wie viele Bücher daraus wurden und mit wem.",
      "sign.global.title": "Über die Grenzen",
      "sign.global.text":
        "Englisch über Amazon, Türkisch über İstanbul Books: die Regale der Welt.",
      "sign.contact.title": "Kontakt",
      "sign.contact.text":
        "Senden Sie Ihr Werk; nach der Sichtung meldet sich Ihre Ansprechperson.",
      "strip.kicker": "Der erste Schritt",
      "strip.h2": "Bringen wir Ihr Buch gemeinsam zur Veröffentlichung.",
      "strip.cta": "Kontakt aufnehmen",
      "head.services.kicker": "Leistungen",
      "head.services.h1": "Alle Stationen, an denen ein Buch lebendig wird",
      "head.services.lede":
        "Jedes Buch beginnt mit einer Idee und ist mit der Idee noch nicht fertig. Unsere Leistungen sind modular: Sie können einen einzelnen Schritt wählen oder den gesamten Weg mit uns gehen.",
      "head.about.kicker": "Über uns",
      "head.about.h1": "Der Ort, an dem Bücher zur Reise werden",
      "head.about.lede":
        "Wir sehen die Welt von einem Ort aus, der das Schaffen erhöht und die Arbeit achtet. Den Wert des Wortes suchen wir nicht allein in Bestsellerlisten, sondern in den richtigen Herzen.",
      "head.global.kicker": "Auf Amazon veröffentlichen",
      "head.global.h1": "Die Spur Ihrer Feder reicht nun über Grenzen hinaus",
      "head.global.lede":
        "Für Ihre englischsprachigen Werke steht Amazon bereit, für Ihre türkischsprachigen Bücher İstanbul Books. Wir bringen Ihr Werk zu Lesenden in aller Welt.",
      "head.contact.kicker": "Kontakt",
      "head.contact.h1": "Senden Sie uns Ihr Werk, beginnen wir gemeinsam",
      "head.contact.lede":
        "Der Prozess beginnt in dem Moment, in dem Ihr Manuskript bei uns ist. Nach der ersten Sichtung meldet sich eine persönliche Ansprechperson bei Ihnen.",

      "world.kicker": "Wie es läuft",
      "world.h2": "In drei Schritten in die Regale der Welt",
      "world.1.title": "Übersetzung",
      "world.1.text":
        "Ihr Werk wird von fachlich einschlägigen Übersetzerinnen und Übersetzern ins Englische übertragen und in einem zweiten Durchgang auf Stil und Stimmigkeit geprüft.",
      "world.2.title": "Format und ISBN",
      "world.2.text":
        "Die Dateien für Kindle und Print-on-Demand, die ISBN und die plattformgerechte Aufbereitung übernehmen wir.",
      "world.3.title": "Weltweiter Vertrieb",
      "world.3.text":
        "Ihr Buch wird auf allen Amazon-Plattformen weltweit verkäuflich; für türkischsprachige Werke bauen wir denselben Weg über İstanbul Books.",
      /* ---------- Fußzeile ---------- */
      "contact.mobile.label": "Mobil",
      "footer.whatsapp": "WhatsApp",
      "footer.link.shop": "HeryerdeKitap – Buchverkauf",
      "footer.link.blog": "Blog",
      "footer.link.authors": "Unsere Autorinnen & Autoren",
      "footer.link.about": "Über uns",
      "footer.link.team": "Unser Team",
      "footer.link.global": "Auf Amazon veröffentlichen",
      "footer.link.faq": "Häufige Fragen",
      "footer.credo":
        "Wir glauben, dass die Kraft bei den Schreibenden und der Sinn bei den Lesenden liegt. Nicht dass ein Buch im Regal steht, ist wichtig, sondern dass es in einem Herzen Platz findet.",
      "footer.services": "Leistungen",
      "footer.company": "Verlag",
      "footer.reach": "Erreichen Sie uns",
      "footer.rights": "Alle Rechte vorbehalten.",
      "footer.top": "Nach oben",
    },
  };

  /* ------------------------------------------------------------------ */

  const read = (key) => {
    const set = DICT[current] || DICT[DEFAULT];
    if (key in set) return set[key];
    // Fehlt ein Schlüssel in der Übersetzung, steht dort das Türkische --
    // besser als eine leere Stelle oder der rohe Schlüssel.
    if (key in DICT[DEFAULT]) return DICT[DEFAULT][key];
    return key;
  };

  const pick = () => {
    const url = new URLSearchParams(location.search).get("lang");
    if (url && DICT[url]) return url;
    let saved = null;
    try {
      saved = window.localStorage.getItem(STORE_KEY);
    } catch {
      // Privates Fenster oder gesperrter Speicher: dann eben ohne Gedächtnis.
    }
    if (saved && DICT[saved]) return saved;
    // Bewusst NICHT die Browsersprache: die Seite ist türkisch, Deutsch ist
    // die Übersetzung. Wer sie will, wählt sie -- und von da an bleibt sie
    // gewählt. Sonst bekäme ein türkischer Leser mit deutschem Browser die
    // Übersetzung statt des Originals.
    return DEFAULT;
  };

  let current = pick();

  function apply() {
    const html = document.documentElement;
    html.lang = read("html.lang");

    for (const el of document.querySelectorAll("[data-i18n]")) {
      el.textContent = read(el.dataset.i18n);
    }
    for (const el of document.querySelectorAll("[data-i18n-html]")) {
      el.innerHTML = read(el.dataset.i18nHtml);
    }
    for (const el of document.querySelectorAll("[data-i18n-attr]")) {
      for (const pair of el.dataset.i18nAttr.split(";")) {
        const at = pair.indexOf(":");
        if (at < 1) continue;
        el.setAttribute(pair.slice(0, at).trim(), read(pair.slice(at + 1).trim()));
      }
    }

    const title = document.querySelector("title");
    if (title) title.textContent = read("meta.title");
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", read("meta.description"));

    for (const btn of document.querySelectorAll("[data-lang]")) {
      const on = btn.dataset.lang === current;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", String(on));
    }

    document.dispatchEvent(new CustomEvent("yazar:lang", { detail: { lang: current } }));
  }

  function set(lang) {
    if (!DICT[lang] || lang === current) return;
    current = lang;
    try {
      window.localStorage.setItem(STORE_KEY, lang);
    } catch {
      // siehe oben
    }
    apply();
  }

  window.yazarI18n = {
    t: read,
    get lang() {
      return current;
    },
    set,
    apply,
    has: (lang) => Boolean(DICT[lang]),
  };

  apply();

  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-lang]");
    if (btn) set(btn.dataset.lang);
  });
})();
