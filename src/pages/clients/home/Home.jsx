import React from "react";
import Header from "../../../components/clients/Header";
import Footer from "../../../components/clients/Footer";
import ClientRouter from "../../../routers/ClientRouter";
function Home(props) {
  return (
    <div>
       <Header />
       <ClientRouter/>
       <Footer/>   
    </div>
  );
}

export default Home;
