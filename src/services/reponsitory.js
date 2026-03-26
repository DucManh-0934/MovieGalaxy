export const objectById = (data, id) => {
  return data.find((item) => item.id === id);
}

export const convertDescription = (description) => {
  return description.length > 100 ? description.slice(0, 100) + "..." : description;
}