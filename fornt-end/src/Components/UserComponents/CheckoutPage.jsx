import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const CheckOutPage = () => {
  const [billingInfo, setBillingInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    city: "",
    county: "",
    postal_code: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [user_id, setUser_Id] = useState(null);
  const [total, setTotal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState();
  const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

  // 1. Asigură-te că obții userId din momentul în care este disponibil
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUser_Id(data.user.id);
        console.log("Utilizatorul este:", data.user.id);
      })
      .catch((err) => console.error("Eroare la obtinerea utilizatorului", err));
  }, []);

  // 2. Obține produsele din coș
  useEffect(() => {
    if (!user_id) return;
    fetch(`http://localhost:5000/cart/data/${user_id}`, { credentials: "include" })
      .then((res) => {
        console.log("Răspuns server:", res); // Log pentru răspunsul HTTP
        return res.json();
      })
      .then((data) => {
        console.log("Datele din coș:", data); // Log pentru datele din coș
        setCartItems(data);
      })
      .catch((err) => console.error("Eroare la obtinerea produselor din cos", err));
  }, [user_id]);

  // 3. Obține totalul coșului
  useEffect(() => {
    if (!user_id) return;
    fetch(`http://localhost:5000/cart/total/${user_id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.total);
        console.log("Totalul este:", data.total);
      })
      .catch((err) => console.error("Eroare la obtinerea totalului", err));
  }, [user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setBillingInfo({ ...billingInfo, country: value, city: "" });
    } else {
      setBillingInfo({ ...billingInfo, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    console.log("Aste e raspunsul e din handleSubmit" ,e);
    e.preventDefault();
    
    const { full_name, email, phone, country, address, city, county, postal_code } = billingInfo;

    if (!full_name || !email || !phone || !country || !address || !city || !county || !postal_code) {
      alert("Toate câmpurile sunt obligatorii!"); // Afișează alertă dacă există câmpuri lipsă
      return; // Oprește execuția funcției și nu trimite formularul
    }
   
    console.log("Datele de facturare:", billingInfo); // Log pentru datele de facturare

    fetch(`http://localhost:5000/billing_info/${user_id}`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(billingInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Datele primite in billing_info(front-end):", data);
        setBillingInfo(data);
      })
      .catch((err) => console.error("Eroare la trimiterea datelor de facturare", err));
  };

  // Functia de trimitere comenzii
  const orders = () => {
    return fetch(`http://localhost:5000/orders/${user_id}`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total_price: total, payment_method: paymentMethod, billing_id: billingInfo.id }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Datele primite:", result);
        if (!result || result.length === 0) {
          console.error("⚠️ Eroare: răspunsul API nu conține date!");
          return null;
        }
        console.log("order_id:", result[0].id); // Accesăm primul obiect din array
        const order_id = result[0].id;
        return order_id;
      })
      .catch((err) => {
        console.error("Eroare la trimiterea comenzii", err);
        return null; // returnează null în caz de eroare
      });
  };

  // Functia de trimitere produse in comanda
  const order_items = (order_id) => {
    cartItems.forEach((item) => {
      console.log("Produs trimis:", item); // Verifică ce date sunt trimise
      fetch("http://localhost:5000/order_items", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product_price,
          order_id: order_id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Produs adăugat în order_items:", data);
        })
        .catch((err) => console.error("❌ Eroare la trimiterea produsului:", err));
    });
  };

  // Procesul complet al comenzii
  const handleOrderProcess = (e) => {
    console.log("Asta e raspunsul din handleOrderProcess", e);
    e.preventDefault();
    orders().then((order_id) => {
      if (order_id) {
        console.log("order_id primit:", order_id); // Log pentru verificare
        order_items(order_id); // Folosește newOrderId aici
      } else {
        console.error("Eroare: newOrderId nu a fost primit!");
      }
    });
  };

  const citiesByCountry = {
    Romania: [
      "București",
      "Cluj-Napoca",
      "Timișoara",
      "Iași",
      "Constanța",
      "Brașov",
      "Craiova",
      "Galați",
      "Ploiești",
      "Oradea",
      "Bacău",
      "Arad",
      "Sibiu",
      "Bistrița",
      "Brăila",
      "Baia Mare",
      "Râmnicu Vâlcea",
      "Suceava",
      "Târgu Mureș",
      "Focșani",
    ],
    Franta: [
      "Paris",
      "Marseille",
      "Lyon",
      "Toulouse",
      "Nice",
      "Nantes",
      "Strasbourg",
      "Montpellier",
      "Bordeaux",
      "Lille",
      "Rennes",
      "Reims",
      "Le Havre",
      "Saint-Étienne",
      "Toulon",
      "Le Mans",
      "Aix-en-Provence",
      "Clermont-Ferrand",
      "Brest",
      "Limoges",
    ],
    Belgia: [
      "Bruxelles",
      "Antwerpen",
      "Ghent",
      "Charleroi",
      "Liège",
      "Brugge",
      "Namur",
      "Leuven",
      "Mons",
      "La Louvière",
      "Kortrijk",
      "Hasselt",
      "Mechelen",
      "Sint-Niklaas",
      "Oostende",
      "Aalst",
      "Seraing",
      "Tournai",
      "Genk",
      "Beringen",
    ],
    Suedia: [
      "Stockholm",
      "Gothenburg",
      "Malmö",
      "Uppsala",
      "Västerås",
      "Örebro",
      "Linköping",
      "Helsingborg",
      "Jönköping",
      "Norrköping",
      "Lund",
      "Umeå",
      "Borås",
      "Sundsvall",
      "Karlstad",
      "Trollhättan",
      "Eskilstuna",
      "Gävle",
      "Växjö",
      "Kalmar",
    ],
    Polonia: [
      "Warszawa",
      "Kraków",
      "Łódź",
      "Wrocław",
      "Poznań",
      "Gdańsk",
      "Szczecin",
      "Bydgoszcz",
      "Lublin",
      "Białystok",
      "Katowice",
      "Gdynia",
      "Częstochowa",
      "Radom",
      "Sosnowiec",
      "Toruń",
      "Kielce",
      "Rzeszów",
      "Gliwice",
      "Zabrze",
    ],
  };

  const countiesByCountry = {
    Romania: [
      "Alba",
      "Arad",
      "Argeș",
      "Bacău",
      "Bihor",
      "Bistrița-Năsăud",
      "Botoșani",
      "Brăila",
      "Brașov",
      "București",
      "Buzău",
      "Călărași",
      "Caraș-Severin",
      "Cluj",
      "Constanța",
      "Covasna",
      "Dâmbovița",
      "Dolj",
      "Galați",
      "Giurgiu",
      "Gorj",
      "Harghita",
      "Hunedoara",
      "Ialomița",
      "Iași",
      "Ilfov",
      "Maramureș",
      "Mehedinți",
      "Mureș",
      "Neamț",
      "Olt",
      "Prahova",
      "Satu Mare",
      "Sălaj",
      "Sibiu",
      "Suceava",
      "Teleorman",
      "Timiș",
      "Tulcea",
      "Vaslui",
      "Vâlcea",
      "Vrancea",
    ],
    Franta: [
      "Ain",
      "Aisne",
      "Allier",
      "Alpes-de-Haute-Provence",
      "Hautes-Alpes",
      "Alpes-Maritimes",
      "Ardèche",
      "Ardennes",
      "Ariège",
      "Aube",
      "Aude",
      "Aveyron",
      "Bouches-du-Rhône",
      "Calvados",
      "Cantal",
      "Charente",
      "Charente-Maritime",
      "Cher",
      "Corrèze",
      "Côte-d'Or",
      "Côtes-d'Armor",
      "Creuse",
      "Dordogne",
      "Doubs",
      "Drôme",
      "Eure",
      "Eure-et-Loir",
      "Finistère",
      "Gard",
      "Haute-Garonne",
      "Gers",
      "Gironde",
      "Hérault",
      "Ille-et-Vilaine",
    ],
    Belgia: [
      "Bruxelles-Capitală",
      "Antwerpen",
      "Flandra de Est",
      "Hainaut",
      "Liège",
      "Flandra de Vest",
      "Namur",
      "Flandra de Brabant",
      "Hainaut",
      "Flandra de Vest",
      "Limburg",
    ],
    Suedia: [
      "Stockholm",
      "Västra Götaland",
      "Skåne",
      "Uppsala",
      "Västmanland",
      "Örebro",
      "Östergötland",
      "Helsingborg",
      "Jönköping",
      "Norrköping",
      "Lund",
      "Västerbotten",
      "Kronoberg",
      "Kalmar",
    ],
    Polonia: [
      "Dolnośląskie",
      "Kujawsko-pomorskie",
      "Lubelskie",
      "Lubuskie",
      "Łódzkie",
      "Małopolskie",
      "Mazowieckie",
      "Opolskie",
      "Podkarpackie",
      "Podlaskie",
      "Pomorskie",
      "Śląskie",
      "Świętokrzyskie",
      "Warmińsko-mazurskie",
      "Wielkopolskie",
      "Zachodniopomorskie",
    ],
  };

  return (
    <div className="CheckOutPage-div">
      <Header />
      <main>
        <div className="billingData-form-div">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Nume complet"
              onChange={handleChange}
            />
            <br />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <br />
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Telefon"
              onChange={handleChange}
            />
            <br />
            <select id="country" value={billingInfo.country} name="country" onChange={handleChange}>
              <option  value="">Selecteaza țara</option>
              {Object.keys(citiesByCountry).map((country) => (
                <option  key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <br />
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Adresa"
              onChange={handleChange}
            />
            <br />
            <select id="city" value={billingInfo.city} name="city" onChange={handleChange}>
              <option value="">Selecteaza orasul/localitatea</option>
              {billingInfo.country &&
                citiesByCountry[billingInfo.country].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
            <br />
            <select id="county" value={billingInfo.county} name="county" onChange={handleChange}>
              <option value="">Selecteaza judetul</option>
              {billingInfo.country &&
                countiesByCountry[billingInfo.country].map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
            </select>
            <br />
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              placeholder="Cod poștal"
              onChange={handleChange}
            />
            <br />
          </form>
        </div>
        <div className="checkOutForm-div">
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              amount={total}
              handleBillingInfoSubmit={handleSubmit}
              handleOrderProcess={handleOrderProcess}
            />
          </Elements>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckOutPage;