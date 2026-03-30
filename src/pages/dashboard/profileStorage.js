const PROFILE_KEY = 'pdamsurvey_surveyor_profiles';

const DEFAULT_PROFILES = [
  {
    id: '1',
    fullName: 'Oktarina Nida Sidebang',
    employeeNumber: '12345678975',
    phoneNumber: '',
    email: '',
    role: 'Surveyor 1',
  },
  {
    id: '2',
    fullName: 'Fatih Ibnu Wildansani',
    employeeNumber: '12345676896',
    phoneNumber: '',
    email: '',
    role: 'Surveyor 2',
  },
  {
    id: '3',
    fullName: 'Bintang Kurniawan',
    employeeNumber: '123456756343',
    phoneNumber: '',
    email: '',
    role: 'Surveyor 3',
  },
];

function normalizeProfiles(input) {
  if (!Array.isArray(input)) {
    return DEFAULT_PROFILES;
  }

  return DEFAULT_PROFILES.map((defaultProfile) => {
    const saved = input.find((item) => String(item?.id) === String(defaultProfile.id));
    return {
      ...defaultProfile,
      ...(saved && typeof saved === 'object' ? saved : {}),
    };
  });
}

export function getSurveyorProfiles() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      return DEFAULT_PROFILES;
    }

    return normalizeProfiles(JSON.parse(raw));
  } catch {
    return DEFAULT_PROFILES;
  }
}

export function getSurveyorProfileById(profileId) {
  return getSurveyorProfiles().find((profile) => String(profile.id) === String(profileId)) || DEFAULT_PROFILES[0];
}

export function saveSurveyorProfile(profileId, profile) {
  const currentProfiles = getSurveyorProfiles();
  const nextProfiles = currentProfiles.map((item) => {
    if (String(item.id) !== String(profileId)) {
      return item;
    }

    return {
      ...item,
      ...profile,
      id: item.id,
    };
  });

  localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfiles));
  return nextProfiles.find((item) => String(item.id) === String(profileId)) || nextProfiles[0];
}

export { DEFAULT_PROFILES };
