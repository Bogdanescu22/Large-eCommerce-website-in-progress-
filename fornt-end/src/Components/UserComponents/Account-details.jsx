
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AccountDetailsCardDiv from "./Account-details-card-div";
import ImageCropper from "../UserComponents/ImageCropper";
import { useNavigate } from "react-router";

function AccountDetails() {
  const [user, setUser] = useState(null);  // Inițializează user ca null
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [addPicture, setAddPicture] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (addPicture) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [addPicture]);

  // Fetch user
  useEffect(() => {
    fetch("https://api.devsite.cfd/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then(({ user }) => {
        setUser(user);  // Setează user-ul când datele au fost încărcate
      })
      .catch((error) => {
        console.error("Eroare:", error);
        setError("Eroare la încărcarea datelor utilizatorului");
      });
  }, []);

  // Fetch orders
  useEffect(() => {
    if (user && user.id) {
      fetch(`https://api.devsite.cfd/orders_fetch/${user.id}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((error) => console.error("Eroare:", error));
    }
  }, [user]);

  // Șterge fotografia de profil
  const deleteProfilePhoto = () => {
    if (!user || !user.id) return;  // Verifică dacă user-ul și user.id sunt disponibile
    fetch(`https://api.devsite.cfd/profile-picture/delete/${user.id}`, {
      credentials: "include",
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setUser((prev) => ({ ...prev, profile_picture: null }));
      })
      .catch((error) => console.error("Eroare la ștergere:", error));
  };

  // Setează imaginea decupată după salvare
  const handleSave = (imageUrl) => {
    setUser((prev) => ({ ...prev, profile_picture: imageUrl }));
    setAddPicture(false);
  };

  // Renderizarea componentei
  if (!user) {
    return <div>Se încarcă...</div>;  // Afișează un mesaj de încărcare până când user-ul este disponibil
  }

  return (
    <div className={`account-details-page ${addPicture ? "activeChange" : ""}`}>
      {addPicture && (
        <div className="blur-overlay">
          <div className="add-picture-div">
            <div className="add-picture-title-close-button-div">
              <h3>Pozitionați și redimensionați imaginea</h3>
              <button onClick={() => setAddPicture(false)}>X</button>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setSelectedImage(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />

            {selectedImage && (
              <ImageCropper
                user_id={user.id}  // Folosește user.id acum că e definit
                imageSrc={selectedImage}
                onSave={handleSave}
                onClose={() => setSelectedImage(null)}
              />
            )}
          </div>
        </div>
      )}

      <Header />
      <main>
        <div className="details-div">
          <h1>Detalii cont:</h1>
          <div className="user-profile-photo-div">
            <div className="picture-div">
              <img
                src={user.profile_picture ? `https://api.devsite.cfd${user.profile_picture}` : "/default-profile.png"}
                alt="Profil"
              />
              <span onClick={() => setAddPicture(true)}>✏️</span>
            </div>
            <button onClick={deleteProfilePhoto}>Șterge fotografia</button>
          </div>
          <p>Nume utilizator: <span>{user.displayname}</span></p>
          <p>ID utilizator: <span>{user.id}</span></p>
          <p>Adresa: <span>{user.address || "N/A"}</span></p>
        </div>

        <button onClick={() => (window.location.href = "https://api.devsite.cfd/logout")}>Logout</button>

        {error && <div className="error-message">{error}</div>}

        <div className="details-orders-history-div">
          <h2>Istoric comenzi:</h2>
          <div className="orders-history-cards-div">
            <AccountDetailsCardDiv />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AccountDetails;

