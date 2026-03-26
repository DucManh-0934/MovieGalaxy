import { FaChessKing, FaHandPaper } from "react-icons/fa";
import { FaPhotoFilm } from "react-icons/fa6";
import { MdOutlineCellWifi } from "react-icons/md";

export const LISTMENU = [
    {
        icon : <FaPhotoFilm />,
        title : "Media Management",
        subMenu : [
            {
                name : "Movies", 
                path : "/admin/movies"
            },
            {
                name : "Episodes",
                path : "/admin/episodes"
            },
            {
                name: "Sections",
                path: "/admin/sections"
            }
        ]
        
    },
    {
        icon: <FaChessKing />,
        title: "Vip",
        subMenu: [
            {
                name: "Packages",
                path: "/admin/packages"
            },
            {
                name: "Features",
                path: "/admin/features"
            },
            {
                name: "Plans",
                path: "/admin/plans"
            }
        ]
    },
    {
        icon: <FaHandPaper />,
        title: "MetaData",
        subMenu: [
            {
                name: "Categories",
                path: "/admin/categories"
            },
            {
                name: "Movie_type",
                path: "/admin/movie_type"
            },
        ]
    },
    {
        icon : <MdOutlineCellWifi />,
        title: "Cast & Crew",
        subMenu: [
            {
                name: "Authors",
                path: "/admin/authors"
            },
            {
                name: "Characters",
                path: "/admin/characters"
            },
            {
                name: "Actors",
                path: "/admin/actors"
            }
        ]
    }
]

export const upload_preset  = "GalaxyMovie" ;
export const cloud_name = "dffgluvky" ;

