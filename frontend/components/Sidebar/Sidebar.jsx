import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { QuestionContext } from "./../../context/questionContext";
import { useState } from "react";

const Sidebar = () => {
  const [sidebarCategoryState, setSidebarCategoryState] = useState("");
  const [sidebarSubCategoryState, setSidebarSubCategoryState] = useState("");
  const [sidebarSubCategory, setSidebarSubCategory] = useState({});
  const { category, filterLevel, setFilterLevel, handleFilter, handleReset } =
    useContext(QuestionContext);

  return (
    <div>
      <Card className="w-[100%] p-5 min-h-screen rounded-none sidebar-wrap">
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle className="text-3xl">Filter By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid items-center w-full gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={sidebarCategoryState}
                    onValueChange={(value) => {
                      const selectedCategory = category.find(
                        (selCat) => selCat.name === value
                      );
                      setSidebarCategoryState(value);
                      setSidebarSubCategory(selectedCategory);
                    }}
                  >
                    <SelectTrigger id="category-filter">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {category &&
                        category.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {sidebarSubCategory.subcategories &&
                sidebarSubCategory.subcategories?.length > 0 ? (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="sub-category">
                      {sidebarSubCategory.subcategories
                        ? "Sub Category"
                        : "First select parent category"}
                    </Label>
                    <Select
                      value={sidebarSubCategoryState}
                      onValueChange={(value) =>
                        setSidebarSubCategoryState(value)
                      }
                    >
                      <SelectTrigger id="sub-category-filter">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {sidebarSubCategory.subcategories &&
                          sidebarSubCategory.subcategories?.map((subCat) => (
                            <SelectItem key={subCat.name} value={subCat.name}>
                              {subCat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="level">Level</Label>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger id="level-filter">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem>Select Level</SelectItem>
                      <SelectItem value="1">Level 1</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button
              onClick={() =>
                handleFilter(
                  sidebarCategoryState,
                  sidebarSubCategoryState,
                  filterLevel
                )
              }
            >
              Filter
            </Button>
          </CardFooter>
        </Card>
      </Card>
    </div>
  );
};

export default Sidebar;
