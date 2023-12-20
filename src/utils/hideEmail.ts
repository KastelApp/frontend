export const hideEmail = (email: string) => {
  const atIndex = email.indexOf("@");
  if (atIndex !== -1) {
    const prefix = email.substring(0, atIndex);
    const hiddenPrefix = prefix.length > 6 ? "***" : "*".repeat(prefix.length);
    return hiddenPrefix + email.substring(atIndex);
  }
  return email;
};
