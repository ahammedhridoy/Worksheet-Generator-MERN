import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center error min-h-[100vh]">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-7xl">Error 404</h1>
        <h4 className="text-3xl">Content Not Found </h4>
        <Button className="w-auto">
          <Link to={"/"}>Go Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
