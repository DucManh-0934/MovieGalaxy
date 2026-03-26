import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CategoriesProvider } from "./contexts/CategoryProvide.jsx";
import { MovieTypeProvider } from "./contexts/MovieTypeProvide.jsx";
import { CharacterProvider } from "./contexts/CharactorProvide.jsx";
import { AuthorProvider } from "./contexts/AuthorProvide.jsx";
import { ActorProvider } from "./contexts/ActorProvide.jsx";
import { MovieProvider } from "./contexts/MoviePrivide.jsx";
import { PlanProvider } from "./contexts/PlanProvide.jsx";
import { SectionProvider } from "./contexts/SectionPrivide.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CategoriesProvider>
        <MovieTypeProvider>
          <CharacterProvider>
            <AuthorProvider>
              <ActorProvider>
                <MovieProvider>
                  <PlanProvider>
                    <SectionProvider>
                      <App />
                    </SectionProvider>
                  </PlanProvider>
                </MovieProvider>
              </ActorProvider>
            </AuthorProvider>
          </CharacterProvider>
        </MovieTypeProvider>
      </CategoriesProvider>
    </BrowserRouter>
  </StrictMode>,
);
