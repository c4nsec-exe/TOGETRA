"use client";

import Link from "next/link";

export default function CookiesPage() {
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
            TOGETRA • Çerezler
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Çerez Politikası
          </h1>

          <p className="mt-5 leading-8 text-white/60">
            Bu sayfa, TOGETRA&apos;da çerezler ve benzeri teknolojiler
            kullanılması halinde kullanıcıya yapılacak açıklamalar için
            hazırlanmıştır.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-7 text-amber-100/80">
            <strong>Önemli:</strong> Kullanılan teknolojiler gerçek sistem
            kesinleştiğinde tek tek kontrol edilmelidir.
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">1. Çerez nedir?</h2>

            <p className="leading-8 text-white/65">
              Çerezler, bir internet sitesinin kullanıcı deneyimini
              geliştirmek, oturum yönetmek, güvenliği desteklemek veya belirli
              tercihleri hatırlamak amacıyla cihaz üzerinde bilgi saklamasına
              yardımcı olan teknolojilerdir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              2. TOGETRA&apos;da hangi teknolojiler kullanılabilir?
            </h2>

            <ul className="list-disc space-y-3 pl-5 text-white/65">
              <li>
                Oturum yönetimi için gerekli teknolojiler.
              </li>

              <li>
                Güvenlik amacıyla kullanılabilecek teknik mekanizmalar.
              </li>

              <li>
                Kullanıcı tercihlerini hatırlamaya yardımcı olan teknolojiler.
              </li>

              <li>
                Hizmetin kullanımını anlamaya yönelik analitik teknolojiler,
                gerçekten kullanıldığı takdirde.
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              3. Tarayıcı depolaması
            </h2>

            <p className="leading-8 text-white/65">
              Geliştirme aşamasındaki frontend demoda bazı kullanıcı bilgileri
              tarayıcının localStorage alanında tutulabilir. localStorage,
              HTTP çereziyle aynı teknoloji değildir. Üretim sürümünde
              kullanılacak depolama yöntemi gerçek mimariye göre yeniden
              belirlenmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              4. Zorunlu teknolojiler
            </h2>

            <p className="leading-8 text-white/65">
              Hizmetin çalışması veya güvenliğinin sağlanması için zorunlu
              olan teknolojiler varsa bunların amacı ve kullanım kapsamı
              kullanıcıya açık şekilde anlatılmalıdır.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              5. Analitik teknolojiler
            </h2>

            <p className="leading-8 text-white/65">
              TOGETRA&apos;da ileride ziyaretçi ölçümü, kullanım istatistikleri
              veya benzeri analitik hizmetler kullanılırsa hangi hizmetin,
              hangi amaçla ve hangi teknolojiyle kullanıldığı gerçek sisteme
              göre bu sayfaya eklenmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              6. Üçüncü taraf teknolojileri
            </h2>

            <p className="leading-8 text-white/65">
              E-posta hizmeti, analiz hizmeti, barındırma, video görüşmesi
              veya başka üçüncü taraf servisleri kullanılması halinde ilgili
              teknolojiler ve veri akışları gerçek servis sağlayıcılarına göre
              ayrı ayrı belirtilmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              7. Kullanıcı tercihleri
            </h2>

            <p className="leading-8 text-white/65">
              Kullanıcıya zorunlu olmayan çerez veya benzeri teknolojiler için
              tercih sunulacaksa, tercih ekranı ve ayarları TOGETRA&apos;nın
              gerçek teknoloji listesine göre hazırlanmalıdır.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">8. Güncellemeler</h2>

            <p className="leading-8 text-white/65">
              TOGETRA&apos;da kullanılan çerez veya benzeri teknolojiler
              değiştiğinde bu Çerez Politikası da güncellenmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">9. İletişim</h2>

            <p className="leading-8 text-white/65">
              Çerezler ve benzeri teknolojiler hakkında iletişim bilgileri
              gerçek proje bilgileri kesinleştirildiğinde burada
              gösterilmelidir.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}