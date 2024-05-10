import Sidebar from "./../../components/Sidebar/Sidebar";
import HomeMain from "./../../components/HomeMain/HomeMain";

function Home() {
  return (
    <div className="container bg-card">
      <div className="flex gap-[2%] mt-[55px] home-wrap flex-col md:flex-row min-h-screen">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="home-main">
          <HomeMain />
        </div>
      </div>
    </div>
  );
}

export default Home;
