import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import ApprovalReviewsCard from "../AdminComponents/ApprovalReviewCards";
import { Helmet } from "react-helmet"; // ✅ Adaugă acest import


const ApprovalReviewsPage = () => {
  const [review, setReview] = useState([]);
  const [zoomImage, setZoomImage] = useState(false);
  const [srcImage, setSrcImage] = useState(null);
  const [forbid, setForbid] = useState(false);
  const [forbidReason, setForbidReason] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetch("https://api.devsite.cfd/admin/reviews_for_approval", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Recenzii:", data);
        setReview(data);
      })
      .catch((error) => {
        console.error("Eroare la fetch recenzii:", error);
      });
  }, []);

  const handleButton = (event, prop) => {
    if (review.length === 0) {
      alert("Nu sunt recenzii de aprobat!");
      return;
    }

    fetch("https://api.devsite.cfd/admin/send_reviews", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: prop.user_id,
        product_id: prop.product_id,
        review_stars: prop.review_stars,
        description: prop.description,
        profile_picture: prop.profile_picture,
        image_url: prop.image_url,
        motiv_respingere: forbidReason,
        status: event.target.value,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        // Șterge review din backend și apoi din state
        fetch(`https://api.devsite.cfd/verified_review/${prop.id}`, {
          credentials: "include",
          method: "DELETE",
        })
          .then((res) => res.json())
          .then(() => {
            setReview((prev) => prev.filter((item) => item.id !== prop.id));
          })
          .catch((err) => console.error("Eroare la DELETE:", err));
      })
      .catch((error) => {
        console.error("Eroare la trimiterea recenziei:", error);
      });
  };

  const zoomImageFunction = (img) => {
    setZoomImage(true);
    setSrcImage(img.target.src);
  };

  const handleForbidButton1 = (prop) => {
    setForbid(true);
    setSelectedReview(prop);
  };

  const setForbidReasonFunction = (event) => {
    setForbidReason(event.target.value);
  };

  return (
    <div className="admin-approval-reviews-page">
      <Helmet>
                    <title>Admin Login - DevSite</title>
                    <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminHeader />
      <main className="admin-approval-reviews-panel-main">
        <h1>Reviews Approval</h1>

        <div>
          {review.map((prop) => (
            <ApprovalReviewsCard
              key={prop.id}
              userId={prop.user_id}
              productId={prop.product_id}
              description={prop.description}
              starsReviews={prop.review_stars}
              imageUrl={prop.image_url}
              motiv_respingere={forbidReason}
              handleButton={(e) => handleButton(e, prop)}
              zoomImageFunction={zoomImageFunction}
              handleForbidButton1={() => handleForbidButton1(prop)}
            />
          ))}
        </div>
      </main>

      {zoomImage && (
        <div className="zoom-overlay">
          <div className="close-button-admin-approve-page">
            <button onClick={() => setZoomImage(false)}>X</button>
          </div>
          <div className="zoom-overlay-background">
            <img src={srcImage} alt="Zoomed" className="zoomed-image" />
          </div>
        </div>
      )}

      {forbid && selectedReview && (
        <div className="forbid-overlay">
          <div className="close-fobid-button-div">
            <button
              onClick={() => {
                setForbid(false);
                setForbidReason("");
              }}
              className="close-fobid-button"
            >
              X
            </button>
          </div>
          <div className="forbid-overlay1">
            <div className="forbid-overlay-form-div">
              <h2>Motiv respingere</h2>
              <div className="forbid-overlay-form">
                <textarea
                  onChange={setForbidReasonFunction}
                  className="forbid-overlay-textarea"
                  placeholder="Scrie motivul respingerii"
                ></textarea>
              </div>
              <button
                value="forbid"
                onClick={(e) => {
                  handleButton(e, selectedReview);
                  setForbid(false);
                }}
              >
                Trimite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalReviewsPage;

