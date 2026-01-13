// lib/validateProfile.ts

export function isValidCSBProfile(url: string) {
  const pattern =
    /^https:\/\/www\.skills\.google\/public_profiles\/[a-zA-Z0-9-]+$/;

  return pattern.test(url.trim());
}
