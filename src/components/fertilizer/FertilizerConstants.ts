
export const DEFAULT_COLORS = [
  "#9b87f5", // Violet clair
  "#7E69AB", // Violet
  "#6E59A5", // Violet foncé
  "#4CAF50", // Vert
  "#E5BE7F", // Jaune doux
  "#F5A962", // Orange doux
  "#6ECFF6", // Bleu clair
];

export const getRandomColor = () => {
  return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
};
