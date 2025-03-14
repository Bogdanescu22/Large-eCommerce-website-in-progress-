import React,{useEffect,useState} from "react";
import { requestFormReset } from "react-dom";


const AdminLoginPage = () => {

const[password,setPassword]= useState("");
const[email, setEmail]= useState("");
const[email2, setEmail2] = useState("");
const[forgotForm, setForgotForm] = useState(false);
const[sendEmail, setSendEmail]= useState(false);


const ForgotPassword= () => {
if(!email2){
return
}

fetch('http://localhost:5000/admin/reset-password', {
method:"POST",
credentials: "include",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({
email2
})
})
.then((res)=> res.json())
.then((data) =>{
console.log("Review adăugat cu succes:", data);
})
.catch((error) => console.error("Eroare la fetch-ul pt resetarea parolei:", error))
}

const Login = () => {
fetch("/admin/login", {
credentials: "include",
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({
email, password})})
.then((res)=> {
if(!res.ok){
throw new Error("Eraore la fetch pt login");
}
return res.json()
})
.catch((error) =>{
console.error("Eroare la login", error);
})
}


const handleEmail =(e)=>{
const {value} = e.target;
setEmail(value)
console.log("Asta e password:",email)
};
    

const handlePassword =(passwordEvent)=>{
const {value} = passwordEvent.target;
if(value){
setPassword(value)
console.log("Asta e password:",password)
}};


const LoginFormDiv = () => {
return(
<div className={`admin-login-page-form ${forgotForm? "activeForm" : ""}`}>
<div><h1>DevSite Admin</h1></div>
<hr />
<div><input onChange={(e)=>handleEmail(e)} type="text" name="email" placeholder="Email"></input></div>
<div><input  onChange ={(passwordEvent)=>handlePassword(passwordEvent)} type="text" name="password" placeholder="Password"></input></div>
<div><button onClick={Login}>Log in</button></div>
<div><p onClick={()=> setForgotForm(!forgotForm)}>Ai uitat parola?</p></div>
</div>
)
}

const WaitingTimeDiv = () => {
  const [timeLeft, setTimeLeft] = useState(15);  
  const [message, setMessage] = useState("");
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive) return;  // Nu face nimic dacă timerul nu a fost pornit

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      },1000);

      return () => clearInterval(timer);
    } else {
      setMessage("Nu ai primit nimic? Retrimite!");
      setTimerActive(false);  // Oprește timerul
    }
  }, [timeLeft, timerActive]);

  return (
    <div className="waiting-time-reset-password">
      {timerActive ? (
        <p>Așteaptă {timeLeft} secunde</p>
      ) : (
        <p>{message}</p>
      )}
      {!timerActive && (
        <button onClick={() => {
          setTimeLeft(15);  
          setTimerActive(true);  
          setMessage("");
          ForgotPassword();
        }}>Trimite/Retrimite</button>
      )}
    </div>
  );
};
  

const ForgotPasswordForm = () => {
return(
<div className={`admin-forgot-password-form ${forgotForm? "" : "activeForgot"}`}>
<div><h1>DevSite Admin</h1></div>
<hr />
<p onClick={()=>setForgotForm(!forgotForm)}>Inapoi la LogIn</p>
<div className="admin-forgot-password-form-input"><input onChange={(event)=> setEmail2(event.target.value)} type="text" placeholder="Introdu adresa de email"></input></div>
<WaitingTimeDiv />
</div>
)
}

console.log("Asta e email2",email2)

return (
<div className="admin-login-page">
<main className="admin-login-page-main">
<LoginFormDiv />
<ForgotPasswordForm />
</main>
</div>

)
}

export default AdminLoginPage;