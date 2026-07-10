import React from "react";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Categories from "../pages/admin/metadata/categories/Categories";
import Countries from "../pages/admin/metadata/countries/Countries";
import { Route, Router, Routes } from "react-router-dom";
import Movies from "../pages/admin/media_management/movies/Movies";
import Episode from "../pages/admin/media_management/episodes/Episode";
import Movietype from "../pages/admin/metadata/movietypes/Movietype";
import Section from "../pages/admin/media_management/sections/Section";
import Feature from "../pages/admin/vip/features/Feature";
import Package from "../pages/admin/vip/packages/Package";
import Plan from "../pages/admin/vip/plans/Plan";
import Actor from "../pages/admin/cast_crew/actors/Actor";
import Charactor from "../pages/admin/cast_crew/charactors/Charactor";
import Author from "../pages/admin/cast_crew/authors/Author";
import UserPage from "../pages/admin/user_management/UserPage";

function AdminRouter(props) {
  const routers = [
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/admin/categories",
      element: <Categories />,
    },
    {
      path: "/admin/movie_type",
      element: <Movietype />,
    },
    {
      path: "/admin/episodes",
      element: <Episode/>
    },
    {
      path: "/admin/movies",
      element: <Movies />,
    },
    {
      path: "/admin/sections",
      element: <Section />,
    },
    {
      path: "/admin/features",
      element: <Feature />,
    },
    {
      path: "/admin/packages",
      element: <Package />,
    },
    {
      path: "/admin/plans",
      element: <Plan />,
    },
    {
      path: "/admin/authors",
      element: <Author />,
    },
    {
      path: "/admin/actors",
      element: <Actor />,
    },
    {
      path: "/admin/characters",
      element: <Charactor />,
    },
    {
      path: "/admin/UserPage",
      element: <UserPage />,
    },
  ];
  return(
  <div>
    <Routes>
      {routers.map((e, i) => (
        <Route key={i} path={e.path} element={e.element} />
      ))}
    </Routes>
  </div>);
}

export default AdminRouter;
