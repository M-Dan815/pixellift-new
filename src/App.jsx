import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Home from "./pages/Home.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from './components/Footer.jsx';

// --- All the features of the app ---
import AmazonScraper from "./components/AmazonScraper.jsx";
import BackgroundGeneration from "./components/BackgroundGeneration.jsx";
import BackgroundRemoval from "./components/BackgroundRemoval.jsx";
import EbayScraper from "./components/EbayScraper.jsx";
import ShopifyScraper from "./components/ShopifyScraper.jsx";
import ImageOptimization from "./components/ImageOptimization.jsx";
import Merge from "./components/Merge.jsx";
import Report from "./components/Report.jsx";

import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Payment from './pages/Payment.jsx'
import Cards from './pages/Cards.jsx'
import Auth from './pages/Auth.jsx'
import Amazon from "./pages/Amazon.jsx";
import Ebay from "./pages/Ebay.jsx";
import Shopify from "./pages/Shopify.jsx";
import View from "./pages/View.jsx";
import FreeTrialNotification from "./components/FreeTrialNotification";
import Terms from "./pages/Terms.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";

// --- Scroll-to-top helper ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { user, trialDaysLeft } = useAuth();
  const [userPlan, setUserPlan] = useState("Free");

  useEffect(() => {
    const user = localStorage.getItem("user");
  
    if(user){
      const parsedUser= JSON.parse(user);
      setUserPlan(parsedUser.planName)
    }
  }, [])
  return (
    <>
      <ScrollToTop />  
      <Navbar userPlan={userPlan} />
      {user && <FreeTrialNotification daysLeft={trialDaysLeft} />}
      <Routes>
        <Route path="/" element={<Home user={user} setUserPlan={setUserPlan}/>} />
        <Route path="/auth" element={<Auth setUserPlan={setUserPlan} />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/payment" element={<Payment user={user} setUserPlan={setUserPlan} />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/about" element={<About />} />
        <Route path="/amazon" element={<Amazon />} />
        <Route path="/ebay" element={<Ebay />} />
        <Route path="/shopify" element={<Shopify />} />
        <Route path="/view" element={<View />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;