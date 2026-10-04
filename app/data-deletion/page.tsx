"use client";

import Link from "next/link";

export default function DataDeletionPage() {
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
            TOGETRA • Veri Kontrolü
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Hesap ve Veri Silme
          </h1>

          <p className="mt-5 leading-8 text-white/60">
            Kullanıcının hesabını kapatması ve hesabıyla ilişkili verilerin
            silinmesine yönelik süreci açıklamak için hazırlanmıştır.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-7 text-amber-100/80">
            <strong>Önemli:</strong> Gerçek silme işlemi backend ve veritabanı
            oluşturulduktan sonra bu sayfadaki süreçle birebir
            eşleştirilmelidir.
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              1. Hesabımı nasıl silebilirim?
            </h2>

            <p className="leading-8 text-white/65">
              Kullanıcı, hesabını TOGETRA profil veya hesap ayarları
              bölümündeki hesap silme seçeneği üzerinden kapatabilmelidir.
              Alternatif bir başvuru kanalı kullanılacaksa gerçek destek veya
              başvuru adresi burada gösterilmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              2. Hangi bilgiler silinebilir?
            </h2>

            <ul className="list-disc space-y-3 pl-5 text-white/65">
              <li>Hesap bilgileri.</li>

              <li>Profil bilgileri ve profil görseli.</li>

              <li>
                Kullanıcıya bağlı oda ve uygulama kayıtları, teknik mimariye
                göre.
              </li>

              <li>
                Kullanıcı mesajları ve diğer kullanıcı içerikleri, gerçek
                saklama politikasına göre.
              </li>

              <li>
                Kullanıcıya ait diğer kişisel veriler, uygulanabilir
                süreçlere göre.
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              3. Güvenlik kayıtları
            </h2>

            <p className="leading-8 text-white/65">
              Güvenlik, kötüye kullanımın önlenmesi veya teknik sorunların
              araştırılması amacıyla oluşturulan bazı kayıtların gerçek
              saklama politikasına göre belirli sürelerle tutulması gerekebilir.
              Bu kayıtların türleri ve saklama süreleri gerçek veri envanteri
              oluşturulduğunda belirlenmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              4. Hesap silme işleminin güvenliği
            </h2>

            <p className="leading-8 text-white/65">
              Üretim sürümünde hesap silme işleminin yalnızca yetkili kullanıcı
              tarafından yapılabilmesi için uygun kimlik doğrulama ve
              yetkilendirme kontrolleri uygulanmalıdır.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              5. Silme işleminin sonucu
            </h2>

            <p className="leading-8 text-white/65">
              Hesap silme işlemi tamamlandığında kullanıcıya işlemin sonucu
              açık bir şekilde gösterilmelidir. İşlem sırasında bazı
              bilgilerin tutulması gerekiyorsa bunun nedeni gerçek süreç ve
              ilgili açıklamalarla uyumlu şekilde belirtilmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              6. KVKK ile ilgili başvurular
            </h2>

            <p className="leading-8 text-white/65">
              Kişisel verilere ilişkin başvurular için TOGETRA&apos;nın
              belirleyeceği resmi iletişim kanalı kullanılmalıdır.
            </p>

            <Link
              href="/kvkk"
              className="mt-5 inline-flex rounded-xl border border-purple-400/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/20"
            >
              KVKK Aydınlatma Metni →
            </Link>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">7. İletişim</h2>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm leading-7 text-white/50">
                [Şirket / kişi adı]
                <br />
                [Adres]
                <br />
                [Destek e-posta adresi]
                <br />
                [KVKK başvuru e-posta adresi]
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">8. Son güncelleme</h2>

            <p className="leading-8 text-white/65">
              Son güncelleme tarihi: Proje geliştirme aşamasında.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}