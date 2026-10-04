"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
};

const DEFAULT_PROFILE: UserProfile = {
  username: "cansu",
  email: "",
  firstName: "Cansu",
  lastName: "",
  photo: "",
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<UserProfile>(DEFAULT_PROFILE);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [photoPreview, setPhotoPreview] =
    useState("");

  /* =====================================
     PROFİLİ YÜKLE
  ===================================== */

  useEffect(() => {
    try {
      const savedProfile =
        localStorage.getItem("togetra_profile");

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);

        setProfile({
          username:
            parsed.username ||
            DEFAULT_PROFILE.username,

          email:
            parsed.email ||
            DEFAULT_PROFILE.email,

          firstName:
            parsed.firstName ||
            DEFAULT_PROFILE.firstName,

          lastName:
            parsed.lastName ||
            DEFAULT_PROFILE.lastName,

          photo:
            parsed.photo || "",
        });

        setPhotoPreview(
          parsed.photo || ""
        );

        return;
      }

      const savedUser =
        localStorage.getItem("togetra_user");

      if (savedUser) {
        const parsedUser =
          JSON.parse(savedUser);

        setProfile({
          username:
            parsedUser.username ||
            DEFAULT_PROFILE.username,

          email:
            parsedUser.email ||
            DEFAULT_PROFILE.email,

          firstName:
            parsedUser.firstName ||
            DEFAULT_PROFILE.firstName,

          lastName:
            parsedUser.lastName ||
            DEFAULT_PROFILE.lastName,

          photo:
            parsedUser.photo || "",
        });

        setPhotoPreview(
          parsedUser.photo || ""
        );
      }
    } catch (error) {
      console.error(
        "Profil yüklenemedi:",
        error
      );
    }
  }, []);

  /* =====================================
     PROFİL GÜNCELLE
  ===================================== */

  const updateProfile = (
    field:
      | "username"
      | "email"
      | "firstName"
      | "lastName",
    value: string
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================
     FOTOĞRAF
  ===================================== */

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage(
        "Lütfen bir görsel dosyası seç."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage(
        "Profil fotoğrafı en fazla 5 MB olabilir."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result === "string"
      ) {
        setPhotoPreview(
          reader.result
        );

        setProfile((previous) => ({
          ...previous,
          photo: reader.result as string,
        }));

        setMessage("");
      }
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview("");

    setProfile((previous) => ({
      ...previous,
      photo: "",
    }));

    setMessage("");
  };

  /* =====================================
     KAYDET
  ===================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");

    if (!profile.username.trim()) {
      setMessage(
        "Kullanıcı adı boş bırakılamaz."
      );
      return;
    }

    if (!profile.email.trim()) {
      setMessage(
        "E-posta adresi boş bırakılamaz."
      );
      return;
    }

    if (
      newPassword &&
      newPassword.length < 6
    ) {
      setMessage(
        "Yeni şifre en az 6 karakter olmalı."
      );
      return;
    }

    if (
      newPassword &&
      !currentPassword
    ) {
      setMessage(
        "Yeni şifre için mevcut şifreni gir."
      );
      return;
    }

    setSaving(true);

    try {
      localStorage.setItem(
        "togetra_profile",
        JSON.stringify(profile)
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setCurrentPassword("");
      setNewPassword("");

      setMessage(
        "Profil başarıyla kaydedildi."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Profil kaydedilirken bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================
     HESAP SİL
  ===================================== */

  const deleteAccount = () => {
    const confirmed =
      window.confirm(
        "Hesabını silmek istediğinden emin misin?"
      );

    if (!confirmed) return;

    localStorage.removeItem(
      "togetra_profile"
    );

    localStorage.removeItem(
      "togetra_user"
    );

    localStorage.removeItem(
      "togetra_custom_avatar"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "userId"
    );

    router.push("/register");
  };

  return (
    <main className="min-h-screen bg-[#080912] text-white">

      {/* =====================================
          TOP BAR
      ===================================== */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080912]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-3"
          >
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_16px_rgba(168,85,247,0.45)]" />

            <span className="text-xl font-black tracking-[0.28em] sm:text-2xl">
              TOGETRA
            </span>
          </button>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                {profile.firstName ||
                  profile.username}
              </p>

              <p className="mt-0.5 text-xs text-white/30">
                Profil
              </p>
            </div>

            {/* FOTOĞRAF */}
            <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-purple-400/50 bg-[#17181f]">

              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl text-white/20">
                  👤
                </div>
              )}

            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">

        {/* =====================================
            SOL MENÜ
        ===================================== */}

        <aside className="hidden min-h-[calc(100vh-76px)] w-[220px] shrink-0 border-r border-white/10 lg:block">

          <div className="p-4">

            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-white/50 transition hover:bg-white/[0.04] hover:text-white"
            >
              <span className="text-lg">
                ⌂
              </span>

              <span className="text-sm font-semibold">
                Ana Sayfa
              </span>
            </button>

          </div>

        </aside>

        {/* =====================================
            MAIN
        ===================================== */}

        <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {/* BAŞLIK */}

          <section className="mx-auto mb-7 max-w-[1250px]">

            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-purple-300">
              PROFİL
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Profilini özelleştir
            </h1>

            <p className="mt-3 text-sm text-white/40 sm:text-base">
              Profil bilgilerini düzenle ve
              TOGETRA'da kendini yansıt.
            </p>

          </section>

          {/* =====================================
              FORM
          ===================================== */}

          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-[1250px] space-y-6"
          >

            {/* =====================================
                FOTOĞRAF
            ===================================== */}

            <section
              id="profile-photo"
              className="rounded-[30px] border border-white/10 bg-[#101016] p-5 sm:p-7"
            >

              <div className="flex flex-col gap-6 md:flex-row md:items-center">

                {/* FOTOĞRAF ÖNİZLEME */}

                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#17181f]">

                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profil fotoğrafı"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-white/15">
                      📷
                    </div>
                  )}

                </div>

                {/* FOTOĞRAF BİLGİLERİ */}

                <div className="flex-1">

                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
                    FOTOĞRAF
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Profil fotoğrafı
                  </h2>

                  <p className="mt-1 text-sm text-white/35">
                    Profilinde kullanmak
                    istediğin fotoğrafı ekle.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">

                    {/* FOTOĞRAF SEÇ */}

                    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 text-sm font-semibold transition hover:opacity-90">

                      📷 Fotoğraf Seç

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handlePhotoChange
                        }
                        className="hidden"
                      />

                    </label>

                    {/* FOTOĞRAFI KALDIR */}

                    {photoPreview && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="min-h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/45 transition hover:bg-white/10 hover:text-white"
                      >
                        Fotoğrafı Kaldır
                      </button>
                    )}

                  </div>

                  <p className="mt-3 text-xs text-white/20">
                    JPG, PNG veya WEBP · Maksimum 5 MB
                  </p>

                </div>

              </div>

            </section>

            {/* =====================================
                KİŞİSEL BİLGİLER
            ===================================== */}

            <section className="rounded-[30px] border border-white/10 bg-[#101016] p-5 sm:p-7">

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
                HESAP
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Kişisel bilgiler
              </h2>

              <p className="mt-1 text-sm text-white/35">
                Profilinde görünecek temel
                bilgileri düzenle.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                  label="Ad"
                  value={profile.firstName}
                  placeholder="Adın"
                  onChange={(value) =>
                    updateProfile(
                      "firstName",
                      value
                    )
                  }
                />

                <Field
                  label="Soyad"
                  value={profile.lastName}
                  placeholder="Soyadın"
                  onChange={(value) =>
                    updateProfile(
                      "lastName",
                      value
                    )
                  }
                />

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-white/60">
                    Kullanıcı adı
                  </label>

                  <div className="flex">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-l-xl border border-r-0 border-white/10 bg-[#202026] text-white/30">
                      @
                    </div>

                    <input
                      type="text"
                      value={profile.username}
                      onChange={(event) =>
                        updateProfile(
                          "username",
                          event.target.value.replace(
                            /\s/g,
                            ""
                          )
                        )
                      }
                      className="h-12 w-full rounded-r-xl border border-white/10 bg-[#17171e] px-4 text-white outline-none transition focus:border-purple-400/50"
                      placeholder="kullaniciadi"
                    />

                  </div>

                </div>

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-white/60">
                    E-posta
                  </label>

                  <input
                    type="email"
                    value={profile.email}
                    onChange={(event) =>
                      updateProfile(
                        "email",
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#17171e] px-4 text-white outline-none transition focus:border-purple-400/50"
                    placeholder="ornek@email.com"
                  />

                </div>

              </div>

            </section>

            {/* =====================================
                ŞİFRE
            ===================================== */}

            <section className="rounded-[30px] border border-white/10 bg-[#101016] p-5 sm:p-7">

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
                GÜVENLİK
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Şifre
              </h2>

              <p className="mt-1 text-sm text-white/35">
                Hesap şifreni güncelle.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <PasswordField
                  label="Mevcut şifre"
                  value={currentPassword}
                  show={showCurrentPassword}
                  placeholder="Mevcut şifren"
                  onChange={
                    setCurrentPassword
                  }
                  onToggle={() =>
                    setShowCurrentPassword(
                      (previous) =>
                        !previous
                    )
                  }
                />

                <PasswordField
                  label="Yeni şifre"
                  value={newPassword}
                  show={showNewPassword}
                  placeholder="Yeni şifren"
                  onChange={setNewPassword}
                  onToggle={() =>
                    setShowNewPassword(
                      (previous) =>
                        !previous
                    )
                  }
                />

              </div>

              <div className="mt-5 rounded-2xl border border-purple-400/10 bg-purple-500/[0.04] px-4 py-4">

                <p className="text-sm font-semibold text-white/70">
                  🔐 Güvenli şifre
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Yeni şifren en az 6
                  karakter olmalı.
                </p>

              </div>

            </section>

            {/* =====================================
                MESAJ
            ===================================== */}

            {message && (
              <div
                aria-live="polite"
                className="rounded-2xl border border-purple-400/20 bg-purple-500/[0.08] px-4 py-4 text-sm text-purple-200"
              >
                {message}
              </div>
            )}

            {/* =====================================
                KAYDET
            ===================================== */}

            <button
              type="submit"
              disabled={saving}
              className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold shadow-xl shadow-purple-500/10 transition hover:opacity-90 disabled:opacity-50"
            >
              {saving
                ? "Kaydediliyor..."
                : "💾 Profili Kaydet"}
            </button>

          </form>

          {/* =====================================
              HESAP
          ===================================== */}

          <section className="mx-auto mt-6 max-w-[1250px] rounded-[30px] border border-red-400/10 bg-red-500/[0.035] p-5 sm:p-7">

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-300">
              HESAP
            </p>

            <h2 className="mt-2 text-lg font-bold text-red-200">
              Hesap işlemleri
            </h2>

            <p className="mt-2 text-sm text-white/35">
              Hesabına ait yerel profil
              bilgilerini kaldırır.
            </p>

            <button
              type="button"
              onClick={deleteAccount}
              className="mt-5 min-h-11 rounded-xl border border-red-400/20 bg-red-500/10 px-5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              🗑️ Hesabı Sil
            </button>

          </section>

          <footer className="mx-auto max-w-[1250px] py-10 text-center">

            <p className="text-sm text-white/20">
              TOGETRA · Your people.
              Your room. Your time.
            </p>

          </footer>

        </div>
      </div>
    </main>
  );
}

/* =========================================
   FIELD
========================================= */

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-white/60">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-12 w-full rounded-xl border border-white/10 bg-[#17171e] px-4 text-white outline-none transition focus:border-purple-400/50"
      />

    </div>
  );
}

/* =========================================
   PASSWORD
========================================= */

function PasswordField({
  label,
  value,
  show,
  placeholder,
  onChange,
  onToggle,
}: {
  label: string;
  value: string;
  show: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-white/60">
        {label}
      </label>

      <div className="relative">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-white/10 bg-[#17171e] px-4 pr-12 text-white outline-none transition focus:border-purple-400/50"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          {show
            ? "🙈"
            : "👁️"}
        </button>

      </div>

    </div>
  );
}