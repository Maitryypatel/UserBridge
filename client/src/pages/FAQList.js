import { useEffect, useState } from "react";
import { fetchFAQs, deleteFAQ } from "../api/faqApi";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";

function FAQList() {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0); // ReactPaginate uses zero-based index
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    const getFAQs = async () => {
      setLoading(true);
      try {
        const data = await fetchFAQs({ page: page + 1, limit: 4, search, category, language });
        setFaqs(data.faqs || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqs([]);
      }
      setLoading(false);
    };
    getFAQs();
  }, [page, search, category, language]);

  const handleDelete = async (id) => {
    if (window.confirm(t("confirm_delete"))) {
      try {
        await deleteFAQ(id);
        setFaqs((prevFaqs) => {
          const updatedFaqs = prevFaqs.filter((faq) => faq._id !== id);
          if (updatedFaqs.length === 0 && page > 0) {
            setPage(page - 1); // Go to previous page if last item on current page is deleted
          }
          return updatedFaqs;
        });
      } catch (error) {
        console.error("Error deleting FAQ:", error);
      }
    }
  };

  const handleSearchChange = debounce((value) => {
    setSearch(value);
    setPage(0); // Reset to first page on new search
  }, 500);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">{t("faq_management")}</h1>

      <div className="mb-4">
        <label>{t("select_language")}: </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="gu">ગુજરાતી</option>
        </select>
      </div>

      <input
        type="text"
        placeholder={t("search_faq")}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      >
        <option value="">{t("all_categories")}</option>
        <option value="General">{t("general")}</option>
        <option value="Account Management">{t("account_management")}</option>
        <option value="Role & Permissions">{t("role_permissions")}</option>
        <option value="Security & Privacy">{t("security_privacy")}</option>
        <option value="Troubleshooting">{t("troubleshooting")}</option>
      </select>

      <Link to="/add-faq" className="bg-blue-500 text-white px-4 py-2 mb-5 inline-block rounded">
        {t("add_faq")}
      </Link>

      {loading ? (
        <p className="text-center text-gray-500">{t("loading_faqs")}</p>
      ) : faqs.length > 0 ? (
        <ul className="mt-5">
          {faqs.map((faq) => (
            <li
              key={faq._id}
              className="border p-4 my-2 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {faq?.question?.[language] || faq?.question?.en || "No question available"}
                </h2>
                <p>{faq?.answer?.[language] || faq?.answer?.en || "No answer available"}</p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                <Link to={`/edit-faq/${faq._id}`} className="bg-yellow-500 text-white px-3 py-1 rounded-lg">
                  {t("edit")}
                </Link>
                <button onClick={() => handleDelete(faq._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg">
                  {t("delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">{t("no_faqs")}</p>
      )}

      <div className="mt-4 flex justify-center">
        <ReactPaginate
          previousLabel={t("previous")}
          nextLabel={t("next")}
          breakLabel="..."
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => setPage(selected)}
          containerClassName="pagination flex gap-2 justify-center mt-4"
          activeClassName="bg-blue-500 text-white px-2 rounded"
          disabledClassName="opacity-50 cursor-not-allowed"
          forcePage={page} 
        />
      </div>
    </div>
  );
}

export default FAQList;
