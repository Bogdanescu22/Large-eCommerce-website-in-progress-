import React from "react";


const ApprovalReviewsCard = ({userId, productId, description, starsReviews, imageUrl, handleButton,}) => {
return(
<div className="reviewApproval-div">
  <div className="whole-card-without-buttons">
    <div className="cardApprovalReview-div-image-and-details">
      <div className="detailsApprovalReview-div">
        <h3>User ID: <span>{userId}</span></h3>
        <h3>Product ID: <span>{productId}</span></h3>
        <div>
        {[1, 2, 3, 4, 5].map((star) => (
        <span
        key={productId}
        style={{fontSize: "24px",color: star <= starsReviews ? "gold" : "grey"}}
        >★
        </span>))}
        </div>
      </div>
      <div className="imageApprovalReview-div"><img src={imageUrl != null? imageUrl : "https://olg.cc/wp-content/uploads/2015/01/placehold-800x500.jpg"}></img></div>
    </div>
    <div>
      <div className="descriptionApprovalReview-div">
        <h2>Descriere</h2>
        <div><p>{description}</p></div>
      </div>
    </div>
    </div>
    <div>
      <div className="buttonsApprovalReview-div">
        <div className="approveButton-div"><button onClick={handleButton}>Aproba</button></div>
        <div className="rejectButton-div"><button onClick={handleButton}>Respinge</button></div>
      </div>
    </div>
  </div>
)
}

export default ApprovalReviewsCard