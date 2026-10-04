"use client";

import Link from "next/link";

export default function LegalFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/20">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="text-xl font-black tracking-[0.25em] text-white"
            >
              TOGETRA
            </Link>

            <p className="mt-3 text-sm text-white/45">
              Your people. Your room. Your time.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              Yasal & Gizlilik
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link
                href="/kvkk"
                className="text-white/55 transition hover:text-white"
              >
                KVKK
              </Link>

              <Link
                href="/privacy"
                className="text-white/55 transition hover:text-white"
              >
                Gizlilik Politikası
              </Link>

              <Link
                href="/terms"
                className="text-white/55 transition hover:text-white"
              >
                Kullanım Koşulları
              </Link>

              <Link
                href="/cookies"
                className="text-white/55 transition hover:text-white"
              >
                Çerez Politikası
              </Link>

              <Link
                href="/data-deletion"
                className="text-white/55 transition hover:text-white"
              >
                Hesap & Veri Silme
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-xs text-white/30">
          © {new Date().getFullYear()} TOGETRA. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}