import FAQ from "../models/faq.js";  

// ✅ Add FAQ (Supports Multi-language, auto-fills missing translations)
export const addFaq = async (req, res) => {
    try {
        const { cat_id, faq_cat_name, question, answer, language } = req.body;

        // Validate required fields
        if (!cat_id || !faq_cat_name || !question || !answer || !language) {
            return res.status(400).json({ 
                message: "All fields are required", 
                error: "Missing required fields"
            });
        }

        // Auto-fill missing translations with the selected language's value
        const languages = ["en", "hi", "gu"];
        for (let lang of languages) {
            if (!faq_cat_name[lang]) {
                faq_cat_name[lang] = faq_cat_name[language];
            }
            if (!question[lang]) {
                question[lang] = question[language];
            }
            if (!answer[lang]) {
                answer[lang] = answer[language];
            }
        }

        const newFaq = new FAQ({ cat_id, faq_cat_name, question, answer });
        await newFaq.save();

        res.status(201).json({ message: "FAQ added successfully", faq: newFaq });
    } catch (error) {
        res.status(500).json({ message: "Error adding FAQ", error: error.message });
    }
};

// ✅ Get All FAQs (Supports Multi-language)
export const getFaqs = async (req, res) => {
    try {
        const { lang = "en" } = req.query; // Get language from query params (default to English)

        const faqs = await FAQ.find();

        // Format response based on selected language
        const localizedFaqs = faqs.map(faq => ({
            cat_id: faq.cat_id,
            faq_cat_name: faq.faq_cat_name[lang] || faq.faq_cat_name["en"],
            question: faq.question[lang] || faq.question["en"],
            answer: faq.answer[lang] || faq.answer["en"]
        }));

        res.status(200).json(localizedFaqs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs", error: error.message });
    }
};
