import React, { useEffect, useState } from "react";
import {
  RiFacebookBoxFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiMailSendFill,
  RiMapPin5Fill,
  RiPinterestFill,
  RiTimeFill,
  RiTwitterFill,
  RiYoutubeFill,
} from "react-icons/ri";

import Image from "next/future/image";
import { PrivacyPolicyModalContent } from "src/shared/PrivacyPolicyModalContent";
import Modal from "../components/Modal";
import { AboutUsModalContent } from "src/shared/AboutUsModalContent";
import { TermsAndConditionsModalContent } from "src/shared/TermsAndConditionsModalContent";
import axios from "axios";
import miscApiConfigs from "src/configs/miscApiConfigs";
import Link from "next/link";
import Router from "next/router";
function Footer() {
  useEffect(() => {
    fetchAppLink();
  }, []);

  const [aboutUsModal, setAboutUsModal] = useState(false);
  const [termsAndConditionsModal, setTermsAndConditionsModal] = useState(false);
  const [privacyPolicyModal, setPrivacyPolicyModal] = useState(false);

  const [appLink, setAppLink] = useState(null);
  const fetchAppLink = async () => {
    // setIsSubsPackagesLoading(true);
    const response = await axios.get(miscApiConfigs.appLinkEndpoint, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
        Authorization:
          "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzcxZjliODFkZjZiYTI5ODk4MWYxOTEiLCJyb2xlIjoidXNlciIsInRpbWUiOjE2NzEyNTI2NzU0MTAsImlhdCI6MTY3MTI1MjY3NSwiZXhwIjoxNzAyNzg4Njc1fQ.q7hCmk6YiJKffMGc1kTj5IFT5cq_IkpHP2ZrgD56QE0",
      },
    });
    setAppLink(response.data.data.data);
    // setIsSubsPackagesLoading(false)
  };

  return (
    <>
      <Modal isOpen={aboutUsModal} onClose={() => setAboutUsModal(false)}>
        {AboutUsModalContent}
      </Modal>
      <Modal
        isOpen={termsAndConditionsModal}
        onClose={() => setTermsAndConditionsModal(false)}>
        {TermsAndConditionsModalContent}
      </Modal>
      <Modal
        isOpen={privacyPolicyModal}
        onClose={() => setPrivacyPolicyModal(false)}>
        {PrivacyPolicyModalContent}
      </Modal>
      <footer className=" bg-primary text-white">
        <div className="container flex flex-col justify-between gap-4 border-b-2 border-white/20 py-8 md:flex-row md:py-10">
          <div>
            <div className="text-xl font-bold md:text-3xl">
              GET STARTED TODAY!
              <div className="mt-2 font-normal md:ml-3 md:mt-0 md:inline md:text-xl md:font-medium">
                +1(919) 438-0450
              </div>
            </div>
            <div className="mt-8 space-y-3 md:space-y-2">
              <div className="flex gap-4 md:text-lg">
                <RiTimeFill className="shrink-0" size={23} />
                <span>
                  Mon - Fri 7am - 7pm
                  <br />
                  Sat 9am - 3pm
                </span>
              </div>
              <div className="flex gap-4 md:text-lg">
                <RiMapPin5Fill className="shrink-0" size={23} />
                <span>1810 Martin Luther King Jr PkwyDurham, NC 27707</span>
              </div>
              <div className="flex cursor-pointer gap-4 md:text-lg">
                <RiMailSendFill
                  className=" shrink-0 cursor-pointer"
                  size={23}
                />
                <span
                  onClick={() => {
                    window.open("mailto:contact@deluxecleanersnc.com");
                  }}>
                  contact@deluxecleanersnc.com
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 min-w-[15rem] md:mt-0">
            <h2 className="text-xl font-semibold">Need to know</h2>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="inline-block cursor-pointer hover:underline">
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="inline-block cursor-pointer hover:underline">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="inline-block cursor-pointer hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container flex flex-col items-center gap-4 py-6 md:flex-row-reverse">
          <div className="mb-4 items-center md:mb-0 md:ml-auto md:flex">
            <div className="text-center md:text-xl">Download our app</div>

            {appLink && (
              <>
                <div className="mt-4 flex flex-col gap-4 md:mt-0 md:ml-10 md:flex-row">
                  <Link
                    href={{
                      pathname: appLink.find(
                        (item) => item.deviceType == "Android"
                      ).apkLink,
                    }}>
                    <div className="flex cursor-pointer items-center rounded-xl bg-black py-2 px-3">
                      <img
                        src="/images/google-play.png"
                        className="h-8 w-8 object-contain"
                        alt=""
                      />
                      <div className="ml-3 w-32 text-white">
                        <div className="text-sm font-medium">GET IT ON</div>
                        <div className="text-lg font-bold leading-5">
                          Google Play
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={{
                      pathname: appLink.find((item) => item.deviceType == "Ios")
                        .apkLink,
                    }}>
                    <div className="flex cursor-pointer items-center rounded-xl bg-black py-2 px-3">
                      <img
                        src="/images/app-store.png"
                        className="h-8 w-8 object-contain"
                        alt=""
                      />
                      <div className="ml-3 w-32 text-white">
                        <div className="text-sm font-medium">
                          Download on the
                        </div>
                        <div className="text-lg font-bold leading-5">
                          App Store
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-8 lg:flex-row">
            <Link href="/">
              <img
                src={"/images/app-logo.png"}
                width={160}
                height={90}
                className="w-32 cursor-pointer object-contain object-center"
                alt="Logo"
              />
            </Link>
            <div>
              <div className="mb-2 flex gap-3">
                <a
                  href="https://www.facebook.com/DeLuxeCleanersNC/"
                  target="_blank"
                  rel="noreferrer">
                  <RiFacebookBoxFill className="cursor-pointer" size={24} />
                </a>
                <a
                  href="https://www.instagram.com/deluxecleanersnc/"
                  target="_blank"
                  rel="noreferrer">
                  <RiInstagramFill className="cursor-pointer" size={24} />
                </a>
                <a
                  href="https://www.youtube.com/@deluxecleaners4757"
                  target="_blank"
                  rel="noreferrer">
                  <RiYoutubeFill className="cursor-pointer" size={24} />
                </a>
                {/*<a*/}
                {/*    href=""*/}
                {/*    target="_blank"*/}
                {/*    rel="noreferrer">*/}
                {/*  <RiTwitterFill className="cursor-pointer" size={24} />*/}
                {/*</a>*/}
                {/*<a*/}
                {/*  href=""*/}
                {/*  target="_blank"*/}
                {/*  rel="noreferrer">*/}
                {/*  <RiLinkedinBoxFill className="cursor-pointer" size={24} />*/}
                {/*</a>*/}
                {/*<a*/}
                {/*  href=""*/}
                {/*  target="_blank"*/}
                {/*  rel="noreferrer">*/}
                {/*  <RiPinterestFill className="cursor-pointer" size={24} />*/}
                {/*</a>*/}
              </div>
              <div className="text-center">&copy; 2023 SparkleUp is powered by Deluxe Cleaners. All Rights Reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
