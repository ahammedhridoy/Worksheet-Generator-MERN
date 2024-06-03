/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import apiRequest from "./../Config/config";

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryState, setCategoryState] = useState("");
  const [subcategory, setSubcategory] = useState([]);
  const [subCategoryState, setSubcategoryState] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [noQuestionsFound, setNoQuestionsFound] = useState(false);
  const imageUrl = "http://localhost:3000/uploads";

  // Fetch questions from the database
  const fetchQuestions = async () => {
    try {
      const { data } = await apiRequest.get(`/questions`);
      setQuestions(data || []);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  // Function to fetch categories
  const getCategories = async () => {
    try {
      const { data } = await apiRequest.get(`/categories`);
      setCategory(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Function to fetch subcategories
  const getsubCategories = async () => {
    try {
      const { data } = await apiRequest.get(`/sub-category`);
      setSubcategory(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter questions based on selected category, subcategory, and filter level
  const handleFilter = (cat, subCat, fltrLvl) => {
    const qsArray = [];

    // Loop through each question to check conditions
    questions.forEach((question) => {
      // Check conditions based on provided arguments
      const matchesCategory = cat ? question.category.name === cat : true;
      const matchesSubcategory = subCat
        ? question.subcategory?.name === subCat
        : true;
      const matchesFilterLevel =
        fltrLvl !== undefined
          ? Number(question.filterlevel) === Number(fltrLvl)
          : true;

      // If all provided conditions match, add to qsArray
      if (matchesCategory && matchesSubcategory && matchesFilterLevel) {
        qsArray.push(question);
      }
    });
    setFilteredQuestions(qsArray);
    setNoQuestionsFound(
      qsArray.length === 0 && (category || subcategory || filterLevel)
    );
  };

  // Reset
  const handleReset = () => {
    // setCategory();
    // setSubcategory("");
    setFilterLevel("1");
    setFilteredQuestions([]);
    setNoQuestionsFound(false);
  };

  useEffect(() => {
    getsubCategories();
    fetchQuestions();
    getCategories();
  }, []);
  return (
    <QuestionContext.Provider
      value={{
        questions,
        setQuestions,
        fetchQuestions,
        filterLevel,
        setFilterLevel,
        category,
        categoryState,
        setCategory,
        setCategoryState,
        subcategory,
        subCategoryState,
        setSubcategory,
        setSubcategoryState,
        handleFilter,
        handleReset,
        filteredQuestions,
        noQuestionsFound,
        getCategories,
        getsubCategories,
        imageUrl,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
