export const getColorClass = (id: string) => {
  const colors = [
    "card--pink",
    "card--purple",
    "card--blue",
    "card--green",
    "card--yellow",
  ];

  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i);
  }

  return colors[hash % colors.length];
};
