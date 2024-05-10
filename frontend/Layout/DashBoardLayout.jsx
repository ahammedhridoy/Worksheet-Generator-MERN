import { Outlet } from "react-router-dom";
import DashBoardMenu from "../components/DashBoardMenu/DashBoardMenu";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

const DashBoardLayout = () => {
  return (
    <div className="dash-layout">
      <Header />
      <div className="container">
        <div className="border shadow dash-wrap bg-card">
          <div className="flex items-center justify-center border shadow-lg dash-left bg-card min-h-auto md:min-h-screen">
            <DashBoardMenu />
          </div>
          <div className="flex items-center justify-center border shadow-lg dash-right bg-card md:min-h-screen min-h-auto">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashBoardLayout;
