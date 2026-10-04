"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const KVKK_STORAGE_KEY = "togetra_kvkk_read";

export default function KvkkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromRegister = searchParams.get("from") === "register";

  function confirmRead() {
    /*
      Register sayfasına haber ver.
    */
    localStorage.setItem(KVKK_STORAGE_KEY, "true");

    /*
      Eğer KVKK yeni sekmede açıldıysa
      ana register sekmesine mesaj gönder.
    */
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "TOGETRA_KVKK_READ",
        },
        window.location.origin
      );

      window.close();

      /*
        window.close() tarayıcı tarafından engellenirse
        aşağıdaki yönlendirme çalışır.
      */
      setTimeout(() => {
        router.push("/register?kvkk=1");
      }, 150);
      
      return;
    }

    /*
      Normal şekilde açılmışsa kayıt sayfasına dön.
    */
    router.push("/register?kvkk=1");
  }

  return (
    <main className="min-h-screen bg-[#09070d] text-white">
      {/* HEADER */}

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
            Ana Sayfa
          </Link>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        {/* TITLE */}

        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
            TOGETRA • KVKK
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            KVKK Aydınlatma Metni
          </h1>

          <p className="mt-5 leading-8 text-white/60">
            Bu metin, TOGETRA kapsamında kişisel verilerin
            işlenmesine ilişkin kullanıcıları bilgilendirmek amacıyla
            hazırlanmış proje taslağıdır.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-7 text-amber-100/80">
            <strong>Önemli:</strong> Bu metin proje geliştirme
            aşamasındaki taslaktır. Gerçek veri sorumlusu bilgileri,
            veri akışları, kullanılan servisler ve saklama süreleri
            kesinleştiğinde güncellenmelidir.
          </div>
        </div>

        {/* SECTIONS */}

        <div className="space-y-5">
          {/* 1 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              1. Veri Sorumlusu
            </h2>

            <p className="leading-8 text-white/65">
              TOGETRA hizmetinin veri sorumlusu bilgileri, proje
              gerçek bir hizmet olarak yayına alınmadan önce açıkça
              belirtilmelidir.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/45">
              [Şirket / kişi adı]
              <br />
              [Adres]
              <br />
              [KVKK iletişim e-posta adresi]
            </div>
          </section>

          {/* 2 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              2. İşlenen Kişisel Veriler
            </h2>

            <ul className="list-disc space-y-3 pl-5 text-white/65">
              <li>
                Ad ve soyad gibi kimlik bilgileri.
              </li>

              <li>
                Kullanıcı adı ve e-posta adresi.
              </li>

              <li>
                Profil görseli ve kullanıcı tarafından eklenen
                profil bilgileri.
              </li>

              <li>
                Oda kodu, oda türü ve oda üyeliğiyle ilişkili
                bilgiler.
              </li>

              <li>
                Mesajlaşma özelliği kapsamında oluşabilecek
                iletişim verileri.
              </li>

              <li>
                Hizmetin güvenliği için gerekli olabilecek teknik
                kayıtlar.
              </li>
            </ul>
          </section>

          {/* 3 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              3. Kişisel Verilerin İşlenme Amaçları
            </h2>

            <ul className="list-disc space-y-3 pl-5 text-white/65">
              <li>
                Kullanıcı hesabının oluşturulması ve yönetilmesi.
              </li>

              <li>
                Oda oluşturma ve oda erişiminin sağlanması.
              </li>

              <li>
                Mesajlaşma, görüntülü görüşme ve oyun
                özelliklerinin sunulması.
              </li>

              <li>
                Hizmet güvenliğinin sağlanması.
              </li>

              <li>
                Teknik problemlerin tespit edilmesi ve
                giderilmesi.
              </li>

              <li>
                Uygulanabilir hukuki yükümlülüklerin yerine
                getirilmesi.
              </li>
            </ul>
          </section>

          {/* 4 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              4. Kişisel Verilerin Toplanma Yöntemi
            </h2>

            <p className="leading-8 text-white/65">
              Veriler; kullanıcıların kayıt, profil, oda, mesajlaşma
              ve diğer hizmetleri kullanması sırasında elektronik
              ortamlar üzerinden elde edilebilir. Kullanılan gerçek
              teknolojiler ve veri akışları üretim altyapısı
              kesinleştiğinde ayrıca belirlenmelidir.
            </p>
          </section>

          {/* 5 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              5. Kişisel Verilerin Aktarılması
            </h2>

            <p className="leading-8 text-white/65">
              Kişisel verilerin üçüncü kişilere veya hizmet
              sağlayıcılarına aktarılıp aktarılmayacağı, gerçek
              TOGETRA altyapısı kesinleştiğinde açıklanmalıdır.
              Barındırma, e-posta, görüntülü görüşme, analitik veya
              başka servisler kullanılması halinde ilgili veri
              aktarımları gerçek sisteme göre belirlenmelidir.
            </p>
          </section>

          {/* 6 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              6. Kişisel Verilerin Güvenliği
            </h2>

            <p className="leading-8 text-white/65">
              TOGETRA&apos;nın üretim sürümünde kişisel verilerin
              korunması amacıyla uygun teknik ve idari tedbirlerin
              uygulanması hedeflenmektedir. Bunlar arasında erişim
              yetkilendirmesi, güvenli parola saklama, oturum
              güvenliği, sunucu tarafı doğrulama ve güvenlik
              kayıtları gibi mekanizmalar bulunabilir.
            </p>
          </section>

          {/* 7 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              7. Kişisel Verilerin Saklanma Süresi
            </h2>

            <p className="leading-8 text-white/65">
              Kişisel veriler, ilgili işleme amacı ve uygulanabilir
              hukuki yükümlülükler bakımından gerekli olduğu süre
              boyunca saklanmalıdır. Gerçek saklama süreleri veri
              kategorilerine göre belirlenmelidir.
            </p>
          </section>

          {/* 8 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              8. İlgili Kişinin Hakları
            </h2>

            <p className="leading-8 text-white/65">
              İlgili kişilerin kişisel verileri kapsamında
              yürürlükteki mevzuattan doğan hakları bulunmaktadır.
              Başvuru yöntemi ve iletişim kanalı gerçek veri
              sorumlusu bilgileri kesinleştiğinde açık şekilde
              belirtilmelidir.
            </p>
          </section>

          {/* 9 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              9. Başvuru
            </h2>

            <p className="leading-8 text-white/65">
              Kişisel verilere ilişkin başvurular için aşağıdaki
              iletişim bilgileri gerçek proje bilgileriyle
              doldurulmalıdır.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/45">
              [Şirket / kişi adı]
              <br />
              [Adres]
              <br />
              [KVKK başvuru e-posta adresi]
            </div>
          </section>

          {/* 10 */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold">
              10. Güncelleme
            </h2>

            <p className="leading-8 text-white/65">
              TOGETRA&apos;nın veri işleme faaliyetleri, altyapısı veya
              kullanılan hizmetleri değiştikçe bu Aydınlatma Metni
              de güncellenmelidir.
            </p>

            <p className="mt-4 text-sm text-white/35">
              Son güncelleme: Proje geliştirme aşamasında
            </p>
          </section>
        </div>

        {/* READ CONFIRMATION */}

        <section className="mt-8 rounded-3xl border border-purple-400/20 bg-purple-500/[0.06] p-6 sm:p-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
              Metnin sonu
            </p>

            <h2 className="mt-3 text-xl font-bold sm:text-2xl">
              KVKK Aydınlatma Metni&apos;ni okudun mu?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/45">
              Kayıt sayfasına dönmek için aşağıdaki butonu
              kullanabilirsin.
            </p>

            <button
              type="button"
              onClick={confirmRead}
              className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-white/90 sm:w-auto"
            >
              ✓ Okudum ve devam et
            </button>
          </div>
        </section>

        {/* FOOTER LINKS */}

        <div className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs text-white/30">
          <Link
            href="/privacy"
            className="transition hover:text-white/60"
          >
            Gizlilik Politikası
          </Link>

          <span>•</span>

          <Link
            href="/terms"
            className="transition hover:text-white/60"
          >
            Kullanım Koşulları
          </Link>

          <span>•</span>

          <Link
            href="/cookies"
            className="transition hover:text-white/60"
          >
            Çerez Politikası
          </Link>

          <span>•</span>

          <Link
            href="/data-deletion"
            className="transition hover:text-white/60"
          >
            Veri Silme
          </Link>
        </div>
      </div>
    </main>
  );
}