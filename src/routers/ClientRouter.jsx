import React from "react";
import { Route, Routes } from "react-router-dom";
import TableWatch from "../pages/clients/watch/TableWatch";
import Main from "../pages/clients/main/Main";
import InforPage from "../pages/clients/inforpage/InforPage";
import Account from "../pages/clients/infor/Account";
import Continued from "../pages/clients/infor/Continued";
import ListMovie from "../pages/clients/infor/ListMovie";
import Favourite from "../pages/clients/infor/Favourite";
import Notification from "../pages/clients/infor/Notification";
import RegisFeaPack from "../pages/clients/FeaturesPack/RegisFeaPack";
import BuyFeaPack from "../pages/clients/FeaturesPack/BuyFeaPack";
import RentMovie from "../pages/clients/rentmovie/RentMovie";
import RentMovieBuy from "../pages/clients/rentmovie/RentMovieBuy";
import CheckOutMovie from "../pages/clients/rentmovie/CheckOutMovie";
import FilmRent from "../pages/clients/infor/FilmRent";

function ClientRouter(props) {
  const routers = [
    {
      path: "/",
      element: <Main />,
    },
    {
      path: "/table-watch/:id",
      element: <TableWatch />,
    },
    {
      path: "/auinformation",
      element: <InforPage />,
      subRoutes: [
        { index: true, element: <Account /> },
        { path: "continued", element: <Continued /> },
        { path: "notification", element: <Notification /> },
        { path: "listMovie", element: <ListMovie /> },
        { path: "favourite", element: <Favourite /> },
        { path: "filmrent", element: <FilmRent /> },
      ],
    },
    {
      path: "/register-pack",
      element: <RegisFeaPack />,
    },
    {
      path: "/buy-pack/:id",
      element: <BuyFeaPack />,
    },
    {
      path: "/rent-movie",
      element: <RentMovie />,
    },
    {
      path: "/rent-movie-buy/:id",
      element: <RentMovieBuy/>,
    },
    {
      path: "/check-out/",
      element: <CheckOutMovie/>,
    },
  ];
  const renderRoutes = (routeArray) => {
    return routeArray.map((route, i) => (
      <Route
        key={i}
        index={route.index}
        path={route.path}
        element={route.element}
      >
        {route.subRoutes && renderRoutes(route.subRoutes)}
      </Route>
    ));
  };

  return (
    <div>
      <Routes>{renderRoutes(routers)}</Routes>
    </div>
  );
}

export default ClientRouter;
