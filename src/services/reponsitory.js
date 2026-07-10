export const objectById = (data, id) => {
  return data.find((item) => item.id === id);
}



export const convertDescription = (description) => {
  return description.length > 80 ? description.slice(0, 80) + "..." : description;
}
export const filterMoviesByCountry = (movies, title) => {
  const countryName = countryNameMap[title] || title;
  return movies.filter((movie) => movie.countryId === countryName);
};
export const filterMoviesByCategory = (movies, categories, categoryId) => {
  return movies.filter((movie) => {
    if (!movie.listCate || movie.listCate.length === 0) return false;

    return movie.listCate.some((cateId) => {
      const cate = objectById(categories, cateId);
      return cate?.id === categoryId;
    });
  });
};
export const countryNameMap = {
  Korea: "Hàn Quốc",
  Chinese: "Trung Quốc",
  Thailand: "Thái Lan",
};