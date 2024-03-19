/**
 * Clean the redirect path to remove the protocol and domain to hopefully prevent open redirects
 * @param redirect The redirect path
 * @returns The cleaned redirect path
 */
const redirectCleaner = (redirect: string) => {
  return redirect.replace(/(http(s)?:\/\/)|(\.\.\/)/g, "");
};

export default redirectCleaner;
