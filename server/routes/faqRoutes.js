import express from "express";
import FAQ from "../models/faq.js";
import { addFaq } from "../controllers/faqController.js";

const router = express.Router();

// ✅ Add FAQ (POST)
router.post("/", addFaq);

// ✅ Get All FAQs (Pagination, Search, Category Filter, Multi-language Support)
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", category = "", lang = "en" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = { deleted: { $ne: true } }; // Exclude soft-deleted FAQs

    if (search) {
      filter.$or = [
        { [`question.${lang}`]: { $regex: search, $options: "i" } },
        { [`answer.${lang}`]: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter["faq_cat_name.en"] = category; // Default filter by category (English)
    }

    const projection = {
      cat_id: 1,
      [`faq_cat_name.${lang}`]: 1,
      [`question.${lang}`]: 1,
      [`answer.${lang}`]: 1,
      createdAt: 1
    };

    const faqs = await FAQ.find(filter, projection)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalFAQs = await FAQ.countDocuments(filter);

    res.json({
      totalFAQs,
      currentPage: page,
      totalPages: Math.ceil(totalFAQs / limit),
      faqs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Get FAQ by ID (Multi-language Support)
router.get("/:id", async (req, res) => {
  try {
    const { lang = "en" } = req.query;

    const projection = {
      cat_id: 1,
      [`faq_cat_name.${lang}`]: 1,
      [`question.${lang}`]: 1,
      [`answer.${lang}`]: 1,
      createdAt: 1
    };

    const faq = await FAQ.findById(req.params.id, projection);

    if (!faq || faq.deleted) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update FAQ (Supports Multi-language Fields)
router.put("/:id", async (req, res) => {
  try {
    const updatedFaq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFaq) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    res.json(updatedFaq);
  } catch (error) {
    res.status(400).json({ error: "Update Failed" });
  }
});

// ✅Soft Delete FAQ
// router.delete("/:id", async (req, res) => {
//   try {
//     const faq = await FAQ.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
//     if (!faq) {
//       return res.status(404).json({ error: "FAQ not found" });
//     }
//     res.json({ message: "FAQ deleted successfully (soft delete applied)", faq });
//   } catch (error) {
//     res.status(500).json({ error: "Delete Failed" });
//   }
// });


router.delete("/:id", async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    res.json({ message: "FAQ permanently deleted", faq });
  } catch (error) {
    res.status(500).json({ error: "Delete Failed" });
  }
});


export default router;
