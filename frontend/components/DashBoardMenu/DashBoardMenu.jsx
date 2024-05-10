import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DashBoardMenu = () => {
  return (
    <div className="dash-menu">
      <div className="flex flex-col items-center justify-center gap-4 p-2 dash-menu-arap">
        <Button variant="outline">
          <Link to={"/dashboard"}>Dashboard</Link>
        </Button>
        <Button variant="outline">
          <Link to={"/add-question"}>Add Question</Link>
        </Button>
        <Button variant="outline">
          <Link to={"/add-user"}>Add User</Link>
        </Button>
        <Button variant="outline">
          <Link to={"/all-user"}>All User</Link>
        </Button>
        <Button variant="outline">
          <Link to={"/create/category"}>Create Category</Link>
        </Button>
        <Button variant="outline">
          <Link to={"/create/subcategory"}>Create Subcategory</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashBoardMenu;
