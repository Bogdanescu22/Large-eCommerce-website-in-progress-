import React, {useState, useEffect} from "react";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const CheckoutForm= ({paymentMethod, setPaymentMethod, amount, handleBillingInfoSubmit, handleOrderProcess}) => {

const stripe = useStripe();
const elements = useElements();
const [clientSecret, setClientSecret] = useState();
const currency = "usd";
const navigate = useNavigate();

useEffect (() => {

if( amount <= 0 || !currency) {
console.log("Campurile amount si currency sunt obligatorii")
return
};

fetch("http://localhost:5000/create-payment-intent",{
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({amount, currency})
})
.then((res) => res.json())
.then((data) => setClientSecret(data.clientSecret))
}, [amount])



const createPayment = async () => {
if (!elements || !stripe) {
console.log("Elements sau stripe lipsesc in createPayment")
return
};

const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {payment_method:{card: elements.getElement(CardElement)}});

if(error) {
console.error("Plata a eșuat:", error.message);
alert("Eroare la plata cu cardul!")
} else if (
paymentIntent.status === "succeeded"
){console.log("Plata reusita!"); alert("Plata finalizata cu succes!"); navigate("payment/success") }
};


const CardPayment = () => {

if (paymentMethod === "card") {
return (
<div className="cardForm-div">
<CardElement />
<button onClick={()=> {createPayment(); handleBillingInfoSubmit(); handleOrderProcess()}}>Plateste</button>
</div>
)} else if (paymentMethod === "courier") {
return (
<button onClick={(e)=> {handleBillingInfoSubmit(e); handleOrderProcess(e)}}>Plaseaza comanda</button>
)
}};



return (
<div className="checkoutForm">
  <h2>Metode de plata</h2>

  <div>
   <input type="checkbox" id="courier" name="courier" value="courier" onChange={() =>{setPaymentMethod("courier")}} checked={paymentMethod === "courier"} className="custom-checkbox"></input>
   <label htmlFor="courier" className="checkbox-label"> Plata la livrare</label>
  </div>

  <div>
   <input type="checkbox" id="card" name="card" value="card" onChange={()=>{setPaymentMethod("card")}} checked={paymentMethod === "card"} className="custom-checkbox"></input>
   <label htmlFor="card"className="checkbox-label" >Card de debit sau de credit</label>
  </div>
    
  <div className="card-payment">
  <CardPayment />
  </div>



</div>
)
};

export default CheckoutForm;