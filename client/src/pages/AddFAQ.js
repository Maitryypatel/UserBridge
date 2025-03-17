import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addFAQ } from "../api/faqApi";
import { useTranslation } from "react-i18next";

function AddFAQ() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(i18n.language || "en");

  // FAQ data now stores multi-language question and answer objects,
  // and a "category" string that will be mapped to faq_cat_name.
  const [faq, setFaq] = useState({
    category: "",
    question: { en: "", hi: "", gu: "" },
    answer: { en: "", hi: "", gu: "" },
  });

  // Update i18n language when language state changes
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Handle input change for multi-language fields (question and answer)
  const handleInputChange = (e, field) => {
    setFaq((prev) => ({
      ...prev,
      [field]: { ...prev[field], [language]: e.target.value },
    }));
  };

  // Handle category dropdown change
  const handleCategoryChange = (e) => {
    setFaq((prev) => ({ ...prev, category: e.target.value }));
  };

  // On submit, transform the state into a payload matching backend expectations.
  // The payload includes:
  //   - cat_id: fixed as "123"
  //   - faq_cat_name: an object mapping languages to the selected category name
  //   - question: multi-language question object
  //   - answer: multi-language answer object
  //   - language: the selected language
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      cat_id: "123",
      faq_cat_name: {
        en: faq.category,
        hi: faq.category,
        gu: faq.category,
      },
      question: faq.question,
      answer: faq.answer,
      language: language,
    };
    try {
      await addFAQ(payload);
      navigate("/faq-list");
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold">{t("add_faq")}</h1>
      
      {/* Language Selector */}
      <div className="mb-4">
        <label className="mr-2">{t("select_language")}:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="gu">ગુજરાતી</option>
        </select>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4">
        {/* Category Dropdown (same as in FAQList.js) */}
        <select
          value={faq.category}
          onChange={handleCategoryChange}
          className="border p-2 w-full mb-5"
          required
        >
          <option value="">{t("all_categories")}</option>
          <option value="General">{t("general")}</option>
          <option value="Account Management">{t("account_management")}</option>
          <option value="Role & Permissions">{t("role_permissions")}</option>
          <option value="Security & Privacy">{t("security_privacy")}</option>
          <option value="Troubleshooting">{t("troubleshooting")}</option>
        </select>
        
        {/* Question Input */}
        <input
          type="text"
          placeholder={t("question")}
          value={faq.question[language] || ""}
          onChange={(e) => handleInputChange(e, "question")}
          className="border p-2 w-full mb-3"
          required
        />
        
        {/* Answer Input */}
        <textarea
          placeholder={t("answer")}
          value={faq.answer[language] || ""}
          onChange={(e) => handleInputChange(e, "answer")}
          className="border p-2 w-full mb-3"
          required
        ></textarea>
        
        <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded">
          {t("submit", { lng: language })}
        </button>
      </form>
    </div>
  );
}

export default AddFAQ;
