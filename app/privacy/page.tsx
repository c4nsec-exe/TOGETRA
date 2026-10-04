"use client";

import Link from "next/link";

export default function PrivacyPage() {
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
            TOGETRA • Gizlilik
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Gizlilik Politikası
          </h1>

          <p className="mt-5 leading-8 text-white/60">
            Bu metin, TOGETRA&apos;nın kullanıcı gizliliğine yaklaşımını sade
            biçimde açıklar. KVKK Aydınlatma Metni&apos;nin yerine geçmez.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-7 text-amber-100/80">
            <strong>Önemli:</strong> Bu metin proje taslağıdır. TOGETRA&apos;nın
            gerçek şirket/veri sorumlusu bilgileri, altyapısı, veri akışları
            ve üçüncü taraf hizmetleri kesinleştiğinde yeniden kontrol
            edilmelidir.
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              1. Gizliliğe yaklaşım
            </h2>

            <p className="leading-8 text-white/65">
              TOGETRA; hesap, oda, mesajlaşma, görüntülü görüşme ve oyun
              özellikleri sunan özel bir iletişim ve eğlence platformu olarak
              tasarlanmıştır. Amaç, kullanıcıların tanıdığı kişilerle özel bir
              oda içinde birlikte vakit geçirebilmesidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              2. Hangi bilgiler işlenebilir?
            </h2>

            <ul className="list-disc space-y-3 pl-5">
              <li className="leading-7 text-white/65">
                Hesap bilgileri: ad, soyad, kullanıcı adı, e-posta ve hesapla
                ilişkili teknik bilgiler.
              </li>

              <li className="leading-7 text-white/65">
                Profil bilgileri: kullanıcının kendi eklediği profil
                bilgileri ve profil görseli.
              </li>

              <li className="leading-7 text-white/65">
                Oda bilgileri: oda kodu, oda türü, katılımcı ve yetkilendirme
                bilgileri.
              </li>

              <li className="leading-7 text-white/65">
                İletişim bilgileri: kullanıcıların platform içinde oluşturduğu
                mesajlar ve bunlarla ilişkili teknik kayıtlar.
              </li>

              <li className="leading-7 text-white/65">
                Teknik veriler: cihaz, tarayıcı, bağlantı ve güvenlik olayları
                gibi hizmetin çalışması için gerekli olabilecek bilgiler.
              </li>

              <li className="leading-7 text-white/65">
                Kamera ve mikrofon: görüntülü görüşme sırasında tarayıcının
                kullanıcıdan istediği medya izinleri.
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              3. Bilgiler ne için kullanılır?
            </h2>

            <ul className="list-disc space-y-3 pl-5">
              <li className="leading-7 text-white/65">
                Hesap oluşturmak ve kullanıcıyı doğrulamak.
              </li>

              <li className="leading-7 text-white/65">
                Özel odaları oluşturmak, katılımcıları yetkilendirmek ve oda
                güvenliğini sağlamak.
              </li>

              <li className="leading-7 text-white/65">
                Mesajlaşma, görüntülü görüşme ve oyun özelliklerini
                çalıştırmak.
              </li>

              <li className="leading-7 text-white/65">
                Kötüye kullanım ve güvenlik olaylarını tespit etmeye yardımcı
                olmak.
              </li>

              <li className="leading-7 text-white/65">
                Destek taleplerini yanıtlamak ve teknik sorunları gidermek.
              </li>

              <li className="leading-7 text-white/65">
                Yürürlükteki hukuki yükümlülüklerin yerine getirilmesi.
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              4. Veri paylaşımı
            </h2>

            <p className="leading-8 text-white/65">
              Kişisel verilerin kimlerle ve hangi amaçla paylaşılacağı,
              TOGETRA&apos;nın gerçek altyapısı kesinleştikten sonra açıkça
              belirtilmelidir. Özellikle barındırma, e-posta, görüntülü
              görüşme, analitik veya ödeme gibi üçüncü taraf hizmetler
              kullanılırsa bunlar güncel politikada ayrıca belirtilmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              5. Güvenlik
            </h2>

            <p className="leading-8 text-white/65">
              TOGETRA&apos;nın üretim sürümünde güvenli parola saklama, oturum
              güvenliği, erişim yetkilendirmesi, sunucu tarafı doğrulama,
              giriş denemesi sınırlama ve güvenlik kayıtları gibi teknik
              tedbirlerin uygulanması hedeflenmektedir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              6. Saklama ve silme
            </h2>

            <p className="leading-8 text-white/65">
              Veriler, ilgili işleme amacı ve uygulanabilir hukuki
              yükümlülükler bakımından gerekli olduğu sürece tutulmalıdır.
              Gerçek saklama süreleri, TOGETRA&apos;nın veri envanteri ve
              teknik altyapısı kesinleştiğinde belirlenmelidir.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              7. Kullanıcının hakları
            </h2>

            <p className="leading-8 text-white/65">
              Kullanıcıların kişisel verileriyle ilgili hakları ve başvuru
              yöntemleri ayrıca TOGETRA&apos;nın KVKK Aydınlatma
              Metni&apos;nde açıklanır.
            </p>

            <Link
              href="/kvkk"
              className="mt-5 inline-flex rounded-xl border border-purple-400/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/20"
            >
              KVKK Aydınlatma Metni →
            </Link>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              8. Değişiklikler
            </h2>

            <p className="leading-8 text-white/65">
              TOGETRA&apos;nın altyapısı, kullanılan hizmetler veya veri işleme
              amaçları değişirse bu Gizlilik Politikası da güncellenmelidir.
              Son güncelleme tarihi sayfada görünür şekilde tutulmalıdır.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              9. İletişim
            </h2>

            <p className="leading-8 text-white/65">
              Şirket / veri sorumlusu bilgileri, açık adres, gizlilik e-posta
              adresi ve KVKK başvuru kanalı gerçek bilgiler kesinleştiğinde
              buraya eklenmelidir.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm leading-7 text-white/50">
                [Şirket / kişi adı]
                <br />
                [Adres]
                <br />
                [Gizlilik e-posta adresi]
                <br />
                [KVKK başvuru e-posta adresi]
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              10. Son güncelleme
            </h2>

            <p className="leading-8 text-white/65">
              Son güncelleme tarihi: Proje geliştirme aşamasında.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}