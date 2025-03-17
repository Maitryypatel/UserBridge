import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateFAQ, fetchFAQById } from "../api/faqApi"; 

function EditFAQ() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFAQ = async () => {
      try {
        const fetchedFaq = await fetchFAQById(id); 
        if (fetchedFaq) {
          setFaq(fetchedFaq);
        } else {
          setError("FAQ not found");
        }
      } catch (err) {
        setError("Failed to fetch FAQ. Please try again.");
        console.error("Error loading FAQ:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadFAQ();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!faq) return;

    try {
      await updateFAQ(id, faq);
      navigate("/faq-list");
    } catch (err) {
      setError("Failed to update FAQ. Please try again.");
      console.error("Update Error:", err.message);
    }
  };

  if (loading) return <p>Loading FAQ...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!faq) return <p className="text-red-500">FAQ not found.</p>;

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold">Edit FAQ</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          placeholder="Category ID"
          value={faq.cat_id}
          onChange={(e) => setFaq({ ...faq, cat_id: e.target.value })}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          placeholder="Category Name"
          value={faq.faq_cat_name}
          onChange={(e) => setFaq({ ...faq, faq_cat_name: e.target.value })}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          placeholder="Question"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
          className="border p-2 w-full mb-2"
          required
        />
        <textarea
          placeholder="Answer"
          value={faq.answer}
          onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
          className="border p-2 w-full mb-2"
          required
        ></textarea>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Update FAQ
        </button>
      </form>
    </div>
  );
}

export default EditFAQ;
