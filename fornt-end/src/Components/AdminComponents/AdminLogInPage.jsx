import React, { useEffect, useState } from "react";

const LoginFormDiv = ({ setEmail, setPassword, Login, setForgotForm }) => {
  return (
    <div className="admin-login-page-form">
      <div><h1>DevSite Admin</h1></div>
      <hr />
      <div>
        <input 
          type="text" 
          name="email" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div>
        <input 
          type="password"
          name="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <div>
        <button onClick={Login}>Log in</button>
      </div>
      <div>
        <p onClick={() => setForgotForm(true)}>Ai uitat parola?</p>
      </div>
    </div>
  );
};

const WaitingTimeDiv = ({ ForgotPassword }) => {
  const [timeLeft, setTimeLeft] = useState(15);  
  const [message, setMessage] = useState("");
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setMessage("Nu ai primit nimic? Retrimite!");
      setTimerActive(false);
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

const ForgotPasswordForm = ({ setEmail2, ForgotPassword, setForgotForm }) => {
  return (
    <div className="admin-forgot-password-form">
      <div><h1>DevSite Admin</h1></div>
      <hr />
      <p onClick={() => setForgotForm(false)}>Inapoi la LogIn</p>
      <div className="admin-forgot-password-form-input">
        <input 
          onChange={(e) => setEmail2(e.target.value)} 
          type="text" 
          placeholder="Introdu adresa de email" 
        />
      </div>
      <WaitingTimeDiv ForgotPassword={ForgotPassword} />
    </div>
  );
};

const AdminLoginPage = () => {
  const [password, setPassword] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [email2, setEmail2] = useState(""); 
  const [forgotForm, setForgotForm] = useState(false); 

  const ForgotPassword = () => { 
    if (!email2) return;

    fetch("http://localhost:5000/admin/reset-password", { 
      method: "POST", 
      credentials: "include", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email2 }) 
    })
      .then((res) => res.json()) 
      .then((data) => console.log("Email trimis:", data)) 
      .catch((error) => console.error("Eroare la resetare parolă:", error)); 
  };

  const Login = (e) => { 
    e.preventDefault(); 
    fetch("/admin/login", { 
      credentials: "include", 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email, password }) 
    })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la fetch pt login");
        return res.json();
      })
      .then((data) => console.log("Login cu succes:", data))
      .catch((error) => console.error("Eroare la login", error));
  };

  return (
    <div className="admin-login-page">
      <main className="admin-login-page-main">
        {!forgotForm ? (
          <LoginFormDiv 
            setEmail={setEmail}
            setPassword={setPassword}
            Login={Login}
            setForgotForm={setForgotForm}
          />
        ) : (
          <ForgotPasswordForm 
            setEmail2={setEmail2}
            ForgotPassword={ForgotPassword}
            setForgotForm={setForgotForm}
          />
        )}
      </main>
    </div>
  );
};

export default AdminLoginPage;
