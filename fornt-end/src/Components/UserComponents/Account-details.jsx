import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CardDetailsPage from "./CardDetailsPage";
import { useNavigate } from "react-router";
import AccountDetailsCardDiv from "./Account-details-card-div";

function AccountDetails() {
  const [user, setUser] = useState({}); // Inițializăm ca obiect gol
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);  // State pentru erori
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();
  const [clickSvg, setClickSvg] = useState(false);
  const [user_id, setUser_id] = useState(null);
  const [deletePicture, setDeletePicture]= useState(false);
  const [addPicture,setAddPicture]=useState(false);
  const [newPicture, setNewPicture]= useState("");

  useEffect(()=> {
   if(addPicture){
   document.body.classList.add("no-scroll")
   } else if(!addPicture){
    document.body.classList.remove("no-scroll")
   }
  },[addPicture])

  const deleteProfilePhoto = () => {
  if(!user_id){
  return console.log("user_id nu e disponibil", user_id)
  }
  fetch(`http://localhost:5000/profile-picture/delete/${user_id}`, {
  credentials:"include",
  method:"DELETE",
  })
  .then((res)=>res.json())
  .then((data)=> 
  console.log("Fotografia a fost stearsa", data))
  .catch((error)=> console.error("Eroare la stergerea fotografiei de profil", error))
  }

  // Fetch user
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Eroare la obținerea utilizatorului");
        }
        return res.json();
      })
      .then(({ user }) => {setUser(user);setUser_id(user.id)} )
      .catch((error) => console.error("Eroare:", error));
  }, []);

  // Fetch orders - DEPENDENȚĂ PE user.id
  useEffect(() => {
    console.log("User ID înainte de fetch:", user.id); 
    if (!user.id) {
      console.log("ID-ul utilizatorului nu este definit.");
      return;  // Ieși din useEffect dacă user.id nu este definit
    }
    fetch(`http://localhost:5000/orders_fetch/${user.id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Răspuns server orders_fetch:", data)
        setOrders(data);
      })
      .catch((error) => console.error("Eroare:", error));
  }, [user.id]);
  

  const addNewPicture = () => {
  fetch(`http://localhost:5000/profile-picture/add/${user_id}`, {
  credentials: "include",
  method:"PATCH",
  headers:{"Content-type":"application/json"},
  body: JSON.stringify({profile_picture:newPicture})
  })
  .then((res)=> res.json())
  .then((data)=> console.log("Fotografia de profil a fost actualizata:", data))
  .catch((error) => console.error("Eroare la fetch-ul pt schimbarea fotografiei de profil:", error))
  }

  return (
    <div className={`account-details-page ${addPicture ? "activeChange" : ""}`}>
    {addPicture && 
       <div className="blur-overlay">
         <div className="add-picture-div">
           <div className="add-picture-title-close-button-div">
             <div><h3>Pozitionati si redimensionati imaginea</h3></div>
             <div><button onClick={() => { setAddPicture(false); setClickSvg(false) }}>X</button>
             </div>
           </div>
           <div className="add-picture-adjust-picture-div">
            <div className="add-picture-adjust-picture-frame-div">
            <img src="Images/Apple-AirPods-hero-240909-lp.jpg.landing-big_2x (1).jpg"></img>
            <div className="add-picture-adjust-picture-square-focus-div">
            </div>
            </div>
           </div>
           <div className="add-picture-magnifier-div"></div>
           <div className="add-picture-ok-button-div"></div>
         </div>
       </div>
       }
      <Header />
      <main>
        <div className="details-logout-div">
          <div className="details-div">
            <h1>Detalii cont:</h1>
            <div className="user-profile-photo-div">
            <div className="picture-div">
            <img src={deletePicture? "" : user.profile_picture}></img>
            <span><svg onClick={()=>setClickSvg(!clickSvg)} 
             xmlns="http://www.w3.org/2000/svg" 
             viewBox="0 0 24 24" 
             width="20" 
             height="20" 
             fill="none" 
             stroke="white" 
             strokeWidth="1" 
             strokeLinecap="round" 
             strokeLinejoin="round"
            >
           <path d="M3 21l3-1 13-13-2-2-13 13-1 3z" />
           <path d="M14 7l3 3" />
           <path d="M2 22l4-1-3-3z" />
           <path d="M16 5l3 3 3-3-3-3z" />
           </svg>
           </span>
           </div>
           <div className={`delete-add-profile-photo-div ${clickSvg? "active" : ""} `}>
              <div onClick={()=>setAddPicture(true)}><p>Schimba fotografia</p></div>
              <div onClick={()=>{deleteProfilePhoto(); setDeletePicture(true); setClickSvg(false)}}><p>Sterge fotografia</p></div>
           </div>
            </div>
            {user ? (
              <>
                <p>Nume utilizator: <span className="details-span">{user.displayname}</span></p>
                <p>ID utilizator: <span className="details-span">{user.id}</span></p>
                <p>Adresa: <span className="details-span">{user.address || "N/A"}</span></p>
              </>
            ) : (
              <p>Se încarcă...</p>
            )}
          </div>
          <div className="details-logout-button">
            <button className="details-logout" onClick={() => window.location.href = "http://localhost:5000/logout"}>
              Logout
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}  {/* Afișează eroarea */}
        </div>
        <div className="details-orders-history-div">
          <h2>Istoric comenzi:</h2>
          <div className="orders-history-cards-div">
           <AccountDetailsCardDiv 
          />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AccountDetails;
