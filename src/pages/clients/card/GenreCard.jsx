import React, { useState, useEffect } from "react";
import { FaCaretRight } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import GenreCardTable from "./GenreCardTable";
import { filterMoviesByCategory } from "../../../services/reponsitory";

const colors = [
  "from-green-400 via-teal-500 to-red-400",
  "from-purple-400 via-pink-400 to-red-400",
  "from-orange-400 via-red-400 to-pink-400",
  "from-indigo-400 via-purple-400 to-pink-400",
  "from-blue-400 via-cyan-400 to-purple-400",
  "from-yellow-400 via-orange-400 to-red-400",
];

function GenreCard() {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [cateSnap, movieSnap] = await Promise.all([
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "Movies")),
      ]);

      setCategories(
        cateSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
      setMovies(movieSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  const filteredMovies = activeCategory
    ? filterMoviesByCategory(movies, categories, activeCategory.id)
    : [];

  return (
    <div className="text-white w-[97%] m-auto mt-5 flex flex-col gap-5">
      <div className="text-white text-2xl">What Are You Looking To See?</div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.slice(0,6).map((cate, i) => (
          <div
            key={cate.id}
            onClick={() => setActiveCategory(cate)}
            className={`h-36 rounded-xl flex flex-col justify-center items-start gap-2
              bg-gradient-to-br ${colors[i % colors.length]}
              hover:scale-105 transition duration-300 cursor-pointer`}
          >
            <b className="text-2xl ml-5">{cate.name}</b>
            <div className="flex ml-5">
              <button className="flex items-center font-poppins">
                View Topic
                <FaCaretRight />
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeCategory && (
        <GenreCardTable
          category={activeCategory}
          gradient={
            colors[
              categories.findIndex((c) => c.id === activeCategory.id) %
                colors.length
            ]
          }
          movies={filteredMovies}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </div>
  );
}

export default GenreCard;
