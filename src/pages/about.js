import React, { useState, useEffect} from "react";

// ** Next Imports
import { useRouter } from "next/router";
import Modal from "../components/Modal";
import AuthPages from "../components/Auth/AuthPages";

import HeaderHome from "src/components/HeaderHome";
import Footer from "src/components/Footer";
import { AboutUsModalContent } from "src/shared/AboutUsModalContent";
//seo
import { AboutSeo } from "../seo/seo";
function About() {
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
      <AboutSeo />
      <Modal isOpen={loginModalOpen} onClose={closeLoginModal}>
        <AuthPages />
      </Modal>
      <HeaderHome onClickLogin={toggleLoginModal} isLoggedIn={isLoggedIn} />
      {AboutUsModalContent}
      <Footer />
    </>
  );
}
About.authGuard = false;
export default About;
