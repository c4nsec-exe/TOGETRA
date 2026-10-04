"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

export type AvatarGender =
  | "female"
  | "male";

export type AvatarConfig = {
  seed: string;
  gender: AvatarGender;
  avatarId: string;
  style: string;

  // Eski yapıyla uyumluluk
  skin?: string;
  hair?: string;
  eyes?: string;
  brows?: string;
  mouth?: string;
  outfit?: string;
  accessory?: string;
  background?: string;
  hairColor?: string;
  outfitColor?: string;
};

type AvatarCreatorProps = {
  value?: AvatarConfig;
  onChange?: (
    avatar: AvatarConfig
  ) => void;
  onChoosePhoto?: () => void;
};

type AvatarOption = {
  id: string;
  name: string;
  gender: AvatarGender;
  seed: string;
  background: string;
};

/*
==================================================
KADIN AVATARLAR
==================================================
*/

const FEMALE_AVATARS: AvatarOption[] = [
  {
    id: "female-01",
    name: "Luna",
    gender: "female",
    seed: "togetra-luna-young",
    background: "c7b8e8",
  },
  {
    id: "female-02",
    name: "Mia",
    gender: "female",
    seed: "togetra-mia-young",
    background: "f0b5ce",
  },
  {
    id: "female-03",
    name: "Nora",
    gender: "female",
    seed: "togetra-nora-young",
    background: "a9cde0",
  },
  {
    id: "female-04",
    name: "Dora",
    gender: "female",
    seed: "togetra-dora-young",
    background: "d9b8ec",
  },
  {
    id: "female-05",
    name: "Mina",
    gender: "female",
    seed: "togetra-mina-young",
    background: "e8c2b0",
  },
  {
    id: "female-06",
    name: "Eylül",
    gender: "female",
    seed: "togetra-eylul-young",
    background: "a8d2c8",
  },
  {
    id: "female-07",
    name: "Ada",
    gender: "female",
    seed: "togetra-ada-young",
    background: "d9c6a8",
  },
  {
    id: "female-08",
    name: "Mira",
    gender: "female",
    seed: "togetra-mira-young",
    background: "b6c5e8",
  },
];

/*
==================================================
ERKEK AVATARLAR
==================================================
*/

const MALE_AVATARS: AvatarOption[] = [
  {
    id: "male-01",
    name: "Emir",
    gender: "male",
    seed: "togetra-emir-young",
    background: "a9c8dc",
  },
  {
    id: "male-02",
    name: "Arda",
    gender: "male",
    seed: "togetra-arda-young",
    background: "b5d0c0",
  },
  {
    id: "male-03",
    name: "Efe",
    gender: "male",
    seed: "togetra-efe-young",
    background: "d7b59d",
  },
  {
    id: "male-04",
    name: "Mert",
    gender: "male",
    seed: "togetra-mert-young",
    background: "aaa2cb",
  },
  {
    id: "male-05",
    name: "Kaan",
    gender: "male",
    seed: "togetra-kaan-young",
    background: "93b7c6",
  },
  {
    id: "male-06",
    name: "Can",
    gender: "male",
    seed: "togetra-can-young",
    background: "d0b18f",
  },
  {
    id: "male-07",
    name: "Bora",
    gender: "male",
    seed: "togetra-bora-young",
    background: "9fa6c4",
  },
  {
    id: "male-08",
    name: "Kerem",
    gender: "male",
    seed: "togetra-kerem-young",
    background: "9ebdb8",
  },
];

const ALL_AVATARS = [
  ...FEMALE_AVATARS,
  ...MALE_AVATARS,
];

const DEFAULT_AVATAR: AvatarConfig = {
  seed: FEMALE_AVATARS[0].seed,
  gender: "female",
  avatarId: FEMALE_AVATARS[0].id,
  style: "big-smile",
};

/*
==================================================
AVATAR URL
==================================================
*/

function buildAvatarUrl(
  option: AvatarOption
) {
  const params =
    new URLSearchParams();

  params.set(
    "seed",
    option.seed
  );

  params.set(
    "backgroundColor",
    option.background
  );

  params.set(
    "backgroundType",
    "solid"
  );

  return `https://api.dicebear.com/10.x/big-smile/svg?${params.toString()}`;
}

/*
==================================================
AVATAR BUL
==================================================
*/

function findAvatar(
  config?: Partial<AvatarConfig>
) {
  if (
    config?.avatarId
  ) {
    const found =
      ALL_AVATARS.find(
        (avatar) =>
          avatar.id ===
          config.avatarId
      );

    if (found) {
      return found;
    }
  }

  if (
    config?.seed
  ) {
    const found =
      ALL_AVATARS.find(
        (avatar) =>
          avatar.seed ===
          config.seed
      );

    if (found) {
      return found;
    }
  }

  return FEMALE_AVATARS[0];
}

/*
==================================================
NORMALIZE
==================================================
*/

export function normalizeAvatar(
  value?: Partial<AvatarConfig> | null
): AvatarConfig {
  const found =
    findAvatar(value || {});

  return {
    ...DEFAULT_AVATAR,

    ...(value || {}),

    seed:
      found.seed,

    gender:
      found.gender,

    avatarId:
      found.id,

    style:
      "big-smile",
  };
}

/*
==================================================
DIŞA AKTARILAN AVATAR URL
==================================================
*/

export function createAvatarUrl(
  config: AvatarConfig
) {
  const found =
    findAvatar(config);

  return buildAvatarUrl(
    found
  );
}

/*
==================================================
AVATAR GÖRSELİ
==================================================
*/

function AvatarImage({
  option,
  className = "",
}: {
  option: AvatarOption;
  className?: string;
}) {
  return (
    <img
      src={buildAvatarUrl(
        option
      )}
      alt={`${option.name} avatar`}
      className={className}
    />
  );
}

/*
==================================================
ANA COMPONENT
==================================================
*/

export default function AvatarCreator({
  value,
  onChange,
  onChoosePhoto,
}: AvatarCreatorProps) {
  const initial =
    normalizeAvatar(value);

  const [
    gender,
    setGender,
  ] = useState<AvatarGender>(
    initial.gender
  );

  const [
    selectedId,
    setSelectedId,
  ] = useState(
    initial.avatarId ||
      FEMALE_AVATARS[0].id
  );

  useEffect(() => {
    if (!value) {
      return;
    }

    const normalized =
      normalizeAvatar(value);

    setGender(
      normalized.gender
    );

    setSelectedId(
      normalized.avatarId ||
        FEMALE_AVATARS[0].id
    );
  }, [value]);

  const avatars =
    useMemo(() => {
      return gender === "female"
        ? FEMALE_AVATARS
        : MALE_AVATARS;
    }, [gender]);

  const selectedAvatar =
    ALL_AVATARS.find(
      (avatar) =>
        avatar.id ===
        selectedId
    ) ||
    avatars[0];

  /*
  ================================================
  AVATAR SEÇ
  ================================================
  */

  const selectAvatar = (
    avatar: AvatarOption
  ) => {
    setSelectedId(
      avatar.id
    );

    const next: AvatarConfig = {
      seed: avatar.seed,
      gender: avatar.gender,
      avatarId: avatar.id,
      style: "big-smile",
    };

    onChange?.(next);

    try {
      localStorage.setItem(
        "togetra_custom_avatar",
        JSON.stringify(next)
      );
    } catch {
      // devam
    }
  };

  /*
  ================================================
  CİNSİYET DEĞİŞTİR
  ================================================
  */

  const changeGender = (
    nextGender: AvatarGender
  ) => {
    setGender(
      nextGender
    );

    const firstAvatar =
      nextGender ===
      "female"
        ? FEMALE_AVATARS[0]
        : MALE_AVATARS[0];

    setSelectedId(
      firstAvatar.id
    );

    const next: AvatarConfig = {
      seed:
        firstAvatar.seed,
      gender:
        firstAvatar.gender,
      avatarId:
        firstAvatar.id,
      style:
        "big-smile",
    };

    onChange?.(next);

    try {
      localStorage.setItem(
        "togetra_custom_avatar",
        JSON.stringify(next)
      );
    } catch {
      // devam
    }
  };

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0f1016]">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="border-b border-white/10 px-6 py-6 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-purple-300">
          AVATAR STUDIO
        </p>

        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Avatarını seç
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Sana en uygun avatarı seç
              ve profilinde kullan.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onChoosePhoto
            }
            className="min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.08] hover:text-white"
          >
            📷 Fotoğraf Kullan
          </button>
        </div>
      </div>

      {/* =====================================
          CİNSİYET
      ===================================== */}

      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              changeGender(
                "female"
              )
            }
            className={`flex min-h-14 flex-1 items-center gap-4 rounded-2xl border px-5 py-3 text-left transition ${
              gender ===
              "female"
                ? "border-purple-400/60 bg-purple-500/15"
                : "border-white/10 bg-white/[0.025] hover:border-white/20"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                gender ===
                "female"
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-white/40"
              }`}
            >
              ♀
            </span>

            <div>
              <p className="text-sm font-bold text-white">
                Kadın Avatarlar
              </p>

              <p className="text-xs text-white/30">
                {FEMALE_AVATARS.length} avatar
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              changeGender(
                "male"
              )
            }
            className={`flex min-h-14 flex-1 items-center gap-4 rounded-2xl border px-5 py-3 text-left transition ${
              gender ===
              "male"
                ? "border-purple-400/60 bg-purple-500/15"
                : "border-white/10 bg-white/[0.025] hover:border-white/20"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                gender ===
                "male"
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-white/40"
              }`}
            >
              ♂
            </span>

            <div>
              <p className="text-sm font-bold text-white">
                Erkek Avatarlar
              </p>

              <p className="text-xs text-white/30">
                {MALE_AVATARS.length} avatar
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* =====================================
          AVATAR ALANI
      ===================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr]">
        {/* SOL ÖNİZLEME */}

        <div className="border-b border-white/10 p-6 sm:p-8 xl:border-b-0 xl:border-r">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            ÖNİZLEME
          </p>

          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {selectedAvatar.name}
            </h3>

            <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">
              ✓ Seçili
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-[#11131b] p-3">
            <div className="aspect-square overflow-hidden rounded-[22px]">
              <AvatarImage
                option={
                  selectedAvatar
                }
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-white/30">
            Avatarını seçmen yeterli.
            Başka ayar yapmana gerek yok.
          </p>
        </div>

        {/* SAĞ GALERİ */}

        <div className="p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
            {gender ===
            "female"
              ? "KADIN AVATARLAR"
              : "ERKEK AVATARLAR"}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            Bir avatar seç
          </h3>

          <p className="mt-1 text-sm text-white/35">
            Avatarın profil fotoğrafın
            olarak kullanılacak.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {avatars.map(
              (avatar) => {
                const active =
                  selectedId ===
                  avatar.id;

                return (
                  <button
                    key={
                      avatar.id
                    }
                    type="button"
                    onClick={() =>
                      selectAvatar(
                        avatar
                      )
                    }
                    className={`group overflow-hidden rounded-[24px] border bg-[#12141c] text-left transition duration-300 ${
                      active
                        ? "border-purple-400 bg-purple-500/10 ring-1 ring-purple-400/30"
                        : "border-white/10 hover:-translate-y-1 hover:border-white/25"
                    }`}
                  >
                    <div className="aspect-square overflow-hidden bg-white/5">
                      <AvatarImage
                        option={
                          avatar
                        }
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                      />
                    </div>

                    <div className="flex items-center justify-between px-3 py-3">
                      <span className="text-sm font-bold text-white/75">
                        {
                          avatar.name
                        }
                      </span>

                      {active && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs font-black text-white">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}