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
import { EpisodeProvider } from "./contexts/EpisodeProvide.jsx";
import { AuthProvider } from "./contexts/AuthProvide.jsx";
import { LoginProvider } from "./contexts/LoginProvide.jsx";
import { NotificationProvider } from "./contexts/NotificationProvide.jsx";
import { LikeProvider } from "./contexts/LikeProvide.jsx";
import { FeaturesProvider } from "./contexts/FeaturesProvide.jsx";
import { CommentProvider } from "./contexts/CommentProvide.jsx";
import { WatchHistoryProvider } from "./contexts/WatchHistoryProvide.jsx";
import { PackageProvider } from "./contexts/PackageProvide.jsx";
import { RentProvider } from "./contexts/RentProvide.jsx";

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
                      <EpisodeProvider>
                        <AuthProvider>
                          <LoginProvider>
                            <NotificationProvider>
                              <LikeProvider>
                                <FeaturesProvider>
                                  <CommentProvider>
                                    <WatchHistoryProvider>
                                      <PackageProvider>
                                        <RentProvider>
                                          <App />
                                        </RentProvider>
                                      </PackageProvider>
                                    </WatchHistoryProvider>
                                  </CommentProvider>
                                </FeaturesProvider>
                              </LikeProvider>
                            </NotificationProvider>
                          </LoginProvider>
                        </AuthProvider>
                      </EpisodeProvider>
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
