import React, { useEffect, useState } from "react"
import AdminHeader from "./AdminHeader";
import ApprovalReviewsCard from "../AdminComponents/ApprovalReviewCards";



const ApprovalReviewsPage = () => {

const [review, setReview]= useState([]);
const [zoomImage, setZoomImage] = useState(false);
const [srcImage, setSrcImage] = useState(null);
const [forbid, setForbid] = useState(false);
const [forbidReason, setForbidReason] = useState(null);
const [forbidCardDetails, setForbidCardDetails] = useState(null);


useEffect(() => {
fetch("http://localhost:5000/admin/reviews_for_approval", {credentials: "include"})
.then((res)=> res.json())
.then((data)=> {
console.log(data);
console.log("✅ Este array?", Array.isArray(data))
setReview(data);
})
.catch((error)=> {
console.error("Eroare:", error);
})
},[])

const handleButton = (events, prop) => {
  if (review.length === 0) {
    alert("Nu sunt recenzii de aprobat!");
    return;
  }


  fetch("http://localhost:5000/admin/send_reviews", {
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
      motiv_respingere: prop.motiv_respingere,
      status: events.target.value
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Recenzia a fost trimisă cu succes!");
      console.log(data);
    })
    .catch((error) => {
      console.error("Eroare:", error);
    });
};

const zoomImageFunction = (img) => {
setZoomImage(true)
setSrcImage(img.target.src);
console.log(img.target.src);
};

const handleForbidButton = ()=> {
setForbid(true)
};

const setForbidReasonFunction = (event) => {
setForbidReason(event.target.value)};
console.log(forbidReason);



return (
  <div className="admin-approval-reviews-page">
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
            handleButton={(events) => handleButton(events, prop)}
            zoomImageFunction={zoomImageFunction}
            handleForbidButton={handleForbidButton}
          />
        ))}
      </div>
    </main>

    {zoomImage && (
      <div
        className="zoom-overlay"
      >
        <div className="close-button-admin-approve-page"><button onClick={()=>setZoomImage(false)}>X</button></div>
        <div className="zoom-overlay-background"><img src={srcImage} alt="Zoomed" className="zoomed-image" /></div>
      </div>
    )}

    {forbid && (
      <div className="forbid-overlay">
      <div className="close-fobid-button-div"><button onClick={()=>setForbid(false)} className="close-fobid-button">X</button></div>
      <div className="forbid-overlay1"> 
        <div className="forbid-overlay-form-div">
          <h2>Motiv respingere</h2>
          <div className="forbid-overlay-form">
            <textarea onChange={(e)=>setForbidReasonFunction(e)} className="forbid-overlay-textarea" placeholder="Scrie motivul respingerii"></textarea>
          </div>
           <button value="forbid" onClick={handleButton}>Trimite</button>  
             </div>
      </div>
      </div>

    )}

  </div>
);


}


export default ApprovalReviewsPage