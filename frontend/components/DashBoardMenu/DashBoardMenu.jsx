import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdPersonAdd } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";

const DashBoardMenu = () => {
  return (
    <div className="dash-menu">
      <div className="flex flex-col items-center justify-center gap-4 p-2 dash-menu-arap">
        <NavLink
          to={"/dashboard"}
          className="flex items-center justify-center gap-2"
        >
          <MdDashboard className="text-2xl" />
          Dashboard
        </NavLink>
        <NavLink
          to={"/add-question"}
          className="flex items-center justify-center gap-2"
        >
          <IoMdAddCircleOutline className="text-2xl" />
          Add Question
        </NavLink>
        <NavLink
          to={"/add-user"}
          className="flex items-center justify-center gap-2"
        >
          <IoMdPersonAdd className="text-2xl" />
          Add User
        </NavLink>
        <NavLink
          to={"/all-user"}
          className="flex items-center justify-center gap-2"
        >
          <FaUser className="text-2xl" />
          All User
        </NavLink>
        <NavLink
          to={"/create/category"}
          className="flex items-center justify-center gap-2"
        >
          <IoIosCreate className="text-2xl" />
          Create Category
        </NavLink>
        <NavLink
          to={"/create/subcategory"}
          className="flex items-center justify-center gap-2"
        >
          <IoIosCreate className="text-2xl" />
          Create Subcategory
        </NavLink>
      </div>
    </div>
  );
};

export default DashBoardMenu;
