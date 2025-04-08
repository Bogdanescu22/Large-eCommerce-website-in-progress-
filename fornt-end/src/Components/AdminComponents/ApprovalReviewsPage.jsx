import React, { useEffect, useState } from "react"
import AdminHeader from "./AdminHeader";
import ApprovalReviewsCard from "../AdminComponents/ApprovalReviewCards";



const ApprovalReviewsPage = () => {

const [review, setReview]= useState([]);


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

const handleButton = () => {
  fetch("http://localhost:5000/admin/send_reviews", {
    credentials: "include",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: review.user_id,
      product_id: review.product_id,
      review_stars: review.review_stars,
      description: review.description,
      profile_picture: review.image_url,
      image_url: review.image_url,
      motiv_respingere: review.motiv_respingere,
    })
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


return(
<div className="admin-approval-reviews-page">
<AdminHeader />
<main className="admin-approval-reviews-panel-main">
<h1>Reviews Approval</h1>
<div>
{review.map((prop) => (
 <ApprovalReviewsCard
 key={prop.user_id}
 userId={prop.user_id}
 productId={prop.product_id}
 description={prop.description}
 starsReviews={prop.review_stars}
 imageUrl={prop.image_url}
 handleButton= {handleButton}
 />
  ))}
  </div>
</main>
</div>
)
}


export default ApprovalReviewsPage