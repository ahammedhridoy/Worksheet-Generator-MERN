import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QuestionProvider } from "../context/questionContext.jsx";
import Home from "../pages/Home/Home.jsx";
import ErrorPage from "./../pages/ErrorPage/ErrorPage";
import Layout from "../Layout/Layout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoardLayout from "../Layout/DashBoardLayout.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Login from "../pages/Login/Login.jsx";
import AddUser from "../pages/AddUser/AddUser.jsx";
import AddQuestion from "./../pages/AddQuestion/AddQuestion";
import ForgotPassword from "./../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./../pages/ResetPassword/ResetPassword";
import { AuthProvider } from "../context/authcontext";
import AllUser from "./../pages/AllUser/AllUser";
import EditQuestion from "./../pages/EditQuestion/EditQuestion";
import { Toaster } from "react-hot-toast";
import CreateCategory from "./../pages/Creategory/CreateCategory";
import CreateSubcategory from "./../pages/Creategory/CreateSubcategory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "/",
    element: <DashBoardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/add-user",
        element: <AddUser />,
      },
      {
        path: "/add-question",
        element: <AddQuestion />,
      },
      {
        path: "/all-user",
        element: <AllUser />,
      },
      {
        path: "/question/edit/:id",
        element: <EditQuestion />,
      },
      {
        path: "/create/category",
        element: <CreateCategory />,
      },
      {
        path: "/create/subcategory",
        element: <CreateSubcategory />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster />
    <AuthProvider>
      <QuestionProvider>
        <RouterProvider router={router} />
      </QuestionProvider>
    </AuthProvider>
  </React.StrictMode>
);
