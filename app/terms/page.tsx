"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#09070d] text-white">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-[0.25em] text-white"
          >
            TOGETRA
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Ana sayfa
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
            TOGETRA • Kurallar
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Kullanım Koşulları
          </h1>

          <p className="mt-5 leading-8 text-white/60">
            TOGETRA platformunun kullanımı sırasında kullanıcıların uyması
            beklenen temel kuralları ve sorumlulukları açıklar.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-7 text-amber-100/80">
            <strong>Önemli:</strong> Bu metin proje taslağıdır. Gerçek hizmet
            kapsamı, şirket bilgileri ve teknik altyapı kesinleştiğinde
            hukuki inceleme yapılmalıdır.
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">1. TOGETRA&apos;nın amacı</h2>

            <p className="leading-8 text-white/65">
              TOGETRA; kullanıcıların tanıdığı kişilerle özel odalar
              oluşturmasına, görüntülü görüşmesine, mesajlaşmasına ve birlikte
              oyun oynamasına olanak sağlayan bir iletişim ve eğlence
              platformu olarak tasarlanmıştır.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">2. Hesap oluşturma</h2>

            <ul className="list-disc space-y-3 pl-5 text-white/65">
              <li>Kullanıcı kayıt sırasında doğru bilgiler vermelidir.</li>

              <li>
                Kullanıcı kendi hesabının güvenliğinden ve giriş bilgilerinin
                korunmasından sorumludur.
              </li>

              <li>
                Başka bir kişinin hesabına izinsiz erişmeye çalışmak yasaktır.
              </li>

              <li>
                Hesap bilgileri üçüncü kişilerle gereksiz şekilde
                paylaşılmamalıdır.
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">3. Özel odalar</h2>

            <p className="mb-4 leading-8 text-white/65">
              TOGETRA odaları kullanıcıların tanıdıkları kişilerle birlikte
              vakit geçirmesi amacıyla oluşturulur.
            </p>

            <ul className="list-disc space-y-3 pl-5 text-white/65">
              <li>
                Oda kodu veya bağlantısı yalnızca paylaşılması uygun görülen
                kişilerle paylaşılmalıdır.
              </li>

              <li>
                Kullanıcılar odaya katılan diğer kişilerin gizliliğine ve
                haklarına saygı göstermelidir.
              </li>

              <li>
                Oda erişim bilgilerinin kötüye kullanılması yasaktır.
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              4. Görüntülü görüşme ve mikrofon kullanımı
            </h2>

            <p className="leading-8 text-white/65">
              Görüntülü görüşme özelliğinde kamera ve mikrofon izinleri
              tarayıcı üzerinden kullanıcıya sorulabilir. Kullanıcı, bu
              izinlerin hangi cihaz ve tarayıcıya ait olduğunu kontrol
              etmelidir. Görüşmelerin kaydedilip kaydedilmediği, gerçek
              sistemin teknik yapısına göre ayrıca açıklanmalıdır.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              5. Kabul edilmeyen kullanımlar
            </h2>

            <ul className="list-disc space-y-3 pl-5 text-white/65">
              <li>
                Başka kullanıcıları taciz etmek, tehdit etmek veya zorbalık
                yapmak.
              </li>

              <li>
                Başka kişilerin özel bilgilerini izinsiz paylaşmak.
              </li>

              <li>
                Yetkisiz erişim veya güvenlik mekanizmalarını aşmaya çalışmak.
              </li>

              <li>
                Kötü amaçlı yazılım veya zararlı içerik dağıtmak.
              </li>

              <li>Spam veya dolandırıcılık amacıyla platformu kullanmak.</li>

              <li>Başka bir kişinin kimliğine bürünmek.</li>

              <li>
                Platformun çalışmasını engelleyecek veya bozacak faaliyetlerde
                bulunmak.
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              6. Mesajlar ve kullanıcı içerikleri
            </h2>

            <p className="leading-8 text-white/65">
              Kullanıcıların gönderdiği mesajlar ve oluşturduğu diğer
              içeriklere ilişkin saklama, silme, raporlama ve erişim
              kuralları gerçek TOGETRA altyapısına göre belirlenmelidir.
              Kullanıcılar, paylaşma yetkisine sahip olmadıkları içerikleri
              platform üzerinden paylaşmamalıdır.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">7. Hesabın kapatılması</h2>

            <p className="leading-8 text-white/65">
              Kullanıcı hesabını kapatmak istediğinde TOGETRA üzerinde
              sunulan hesap silme yöntemlerini kullanabilir. Uygulanabilir
              saklama yükümlülükleri veya güvenlik kayıtları bulunması halinde
              bu kayıtların tutulma süresi ayrıca belirlenmelidir.
            </p>

            <Link
              href="/data-deletion"
              className="mt-5 inline-flex rounded-xl border border-purple-400/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/20"
            >
              Hesap ve Veri Silme →
            </Link>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">8. Hizmet değişiklikleri</h2>

            <p className="leading-8 text-white/65">
              TOGETRA&apos;nın özellikleri, oyunları, oda yapısı veya diğer
              hizmetleri zaman içinde değişebilir. Önemli değişiklikler
              meydana geldiğinde ilgili sayfalar güncellenmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">9. İletişim</h2>

            <p className="leading-8 text-white/65">
              Kullanım koşullarıyla ilgili iletişim bilgileri gerçek proje
              bilgileri kesinleştiğinde burada gösterilmelidir.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/50">
              [Şirket / kişi adı]
              <br />
              [Destek e-posta adresi]
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">10. Son güncelleme</h2>

            <p className="leading-8 text-white/65">
              Son güncelleme tarihi: Proje geliştirme aşamasında.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}