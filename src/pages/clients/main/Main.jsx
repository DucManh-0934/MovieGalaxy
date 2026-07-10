import React from "react";
import SlidesBanner from "../slides/SlidesBanner";
import SlidesCountry from "../slides/SlidesCountry";
import SlidesMovie from "../slides/SlidesMovie";
import MovieList from "../slides/MovieList";
import GenreCard from "../card/GenreCard";
import Banner from "../banner/Banner";
import Comment from "../comment/Comment";

function Main(props) {
  return (
    <div>
      <SlidesBanner />
      <GenreCard/>
      <div className="bg-gray-800 p-5 mt-5 flex gap-10 flex-col w-[95vw] m-auto rounded-2xl">
        <SlidesCountry title={"Korea"} />
        <SlidesCountry title={"Chinese"} />
        <SlidesCountry title={"Thailand"} />
      </div>
      <SlidesMovie />
        <Banner/>
      <MovieList />
    </div>
  );
}

export default Main;
