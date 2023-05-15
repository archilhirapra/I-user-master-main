import React, { useState, useEffect} from "react";

// ** Next Imports
import { useRouter } from "next/router";
import Modal from "../components/Modal";
import AuthPages from "../components/Auth/AuthPages";


import Footer from "src/components/Footer";
import HeaderHome from "src/components/HeaderHome";
import { TermsAndConditionsModalContent } from "src/shared/TermsAndConditionsModalContent";
//seo
import { TermsSeo } from "../seo/seo";
function Termsandcondition() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (window.localStorage.getItem("accessToken")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const [loginModalOpen, setLoginModalOpen] = useState(() => {
    return !!router.query.requireAuth ?? false;
  });

  const toggleLoginModal = () => {
    setLoginModalOpen((old) => !old);
  };
  const closeLoginModal = () => setLoginModalOpen(false);
  return (
    <>
      <TermsSeo />
      <Modal isOpen={loginModalOpen} onClose={closeLoginModal}>
        <AuthPages />
      </Modal>
      <HeaderHome onClickLogin={toggleLoginModal} isLoggedIn={isLoggedIn} />
      {TermsAndConditionsModalContent}
      <Footer />
    </>
  );
}
Termsandcondition.authGuard = false;
export default Termsandcondition;
