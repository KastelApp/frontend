function getInitials(name) {
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  } else {
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
}

export default getInitials;
