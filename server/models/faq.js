import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    cat_id: { type: String, required: true }, // Keep ID as a string (unique category ID)
    
    // Multi-language support for FAQ Category Name
    faq_cat_name: {
        en: { type: String, required: true },
        hi: { type: String, required: true },
        gu: { type: String, required: true }
    },

    // Multi-language support for Question
    question: {
        en: { type: String, required: true },
        hi: { type: String, required: true },
        gu: { type: String, required: true }
    },
    
    // Multi-language support for Answer
    answer: {
        en: { type: String, required: true },
        hi: { type: String, required: true },
        gu: { type: String, required: true }
    }

}, { timestamps: true });

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;
