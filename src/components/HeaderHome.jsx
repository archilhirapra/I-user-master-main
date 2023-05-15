import { Fragment, useEffect, useState } from "react";
import { TicketIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/future/image";
import { RiMenu5Fill, RiNotification2Fill, RiUser3Fill } from "react-icons/ri";
import Head from "next/head";
import Link from "next/link";
import Modal from "./Modal";
import { useAuth } from "src/hooks/useAuth";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import miscApiConfigs from "src/configs/miscApiConfigs";
import axios from "axios";
import { AboutUsModalContent } from "src/shared/AboutUsModalContent";

const contactUsSchema = yup.object().shape({
  email: yup.string().email().required("Email is a required field"),
  subject: yup.string().required("Subject is a required field"),
  message: yup.string().required("Message is a required field"),
});


const NavList = ({ setContactUsOpen, setAboutUsOpen, toggleMenu }) =>
(
  <ul className="flex flex-col gap-3 font-medium md:flex-row md:items-center md:font-normal">
    <li>
      <Link href="/services">
        <a className="inline-block p-2">Services</a>
      </Link>
    </li>
    <li>
      <Link href="/subscription">
        <a className="inline-block p-2">Subscription</a>
      </Link>
    </li>
    <li>
      <Link href="/about">
        <a className="inline-block p-2">About Us</a>
      </Link>
    </li>
    <li>
      <button
        onClick={() => { toggleMenu(); setContactUsOpen(true) }}
        className="inline-block p-2"
      >
        Contact Us
      </button>
    </li>
  </ul>
);



function HeaderHome({ onClickLogin, aboutModalOpen }) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [apiError, setApiError] = useState({
    error: false,
    message: "",
  });

  const { user } = useAuth()

  const [contactUsOpen, setContactUsOpen] = useState(false);
  const [aboutUsOpen, setAboutUsOpen] = useState(false);

  const { asPath } = useRouter();

  const toggleMenu = () => {
    setSideMenuOpen((old) => !old);
  };


  useEffect(() => {
    setSideMenuOpen(false);
  }, [asPath]);

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(contactUsSchema),
  });

  const onFormSubmit = async (data) => {
    setIsSending(true)
    try {
      const response = await axios.post(miscApiConfigs.contactUsEndpoint, data);
      setContactUsOpen(false);
      setSuccessModalOpen(true);
      reset();
    } catch (error) {
      setContactUsOpen(false);
      setSuccessModalOpen(true);
      setApiError({
        error: true,
        message: error.response.data.message || "Something went wrong! Try again later!!!",
      })
    }
    setIsSending(false)
  };

  return (
    <>
      <Head>
        <meta name="theme-color" content="#185ADB" />
      </Head>
      {
        contactUsOpen && (
          <Modal isOpen={contactUsOpen} onClose={() => {reset();setContactUsOpen(false)}}>
            <div className="flex h-full flex-col">
              <div className="border-b p-6 md:p-8">
                <p className="text-lg font-medium">Contact us</p>
                <p className="text-sm">
                  1810 Martin Luther King Jr PkwyDurham, +1-234234242,
                  asdas@gmail.com
                </p>
              </div>
              <div className="flex grow flex-col gap-8 overflow-auto p-6 md:flex-row md:p-8">
                <div className="w-full space-y-4" >
                  <div className="space-y-1">
                    <label htmlFor="email">Your Email</label>
                    <input {...register("email")} type="text" className="input" />
                    <span className='text-red-500 text-sm'>
                      {errors.email?.message}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="subject">Subject</label>
                    <input {...register("subject")} type="text" className="input" />
                    <span className='text-red-500 text-sm'>
                      {errors.subject?.message}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="message">Message</label>
                    <textarea {...register("message")} className="input resize-none" rows={5} />
                    <span className='text-red-500 text-sm'>
                      {errors.message?.message}
                    </span>
                  </div>
                  <button onClick={handleSubmit(onFormSubmit)} disabled={isSending} className="btn-primary">{isSending ? 'Sending...' : 'Send Message'}</button>
                </div>
                <div className="w-full space-y-1 font-medium">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28077922.270867474!2d-94.53151051003421!3d30.789149919660197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1669463259117!5m2!1sen!2snp"
                    className="h-48 w-full md:h-full"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </Modal>
        )
      }
      {
        successModalOpen && <Modal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
          <div className="flex h-full flex-col">

            <div className="border-b p-6 md:p-8">
              <p className={`text-2xl ${apiError.error ? 'text-red-500' : 'text-green-500'} font-bold`}>{apiError.error ? 'Opps!' : 'Message Sent'}</p>
              <p className="text-sm capitalize">
                {
                  apiError.error ? apiError.message : 'Thank you for contacting us. We will get back to you soon!'
                }
              </p>
            </div>
          </div>
        </Modal>
      }
      {
        aboutUsOpen &&
        <Modal isOpen={aboutUsOpen} onClose={() => setAboutUsOpen(false)}>
          {AboutUsModalContent}
        </Modal>
      }

      <header className="sticky top-0 z-50 w-full border-b border-gray-50/10 bg-primary">
        <div className="container flex items-center py-2">
          <Link href="/">
            <a>
              <img
                src={"/images/app-logo.png"}
                width={160}s
                height={90}
                className="w-28 object-contain object-left py-1 lg:object-center"
                alt="Logo"
              />
            </a>
          </Link>

          <div className="ml-8 hidden text-white md:block"><NavList setAboutUsOpen={setAboutUsOpen} setContactUsOpen={setContactUsOpen} toggleMenu={toggleMenu} /></div>
          <div className="ml-auto hidden gap-2 md:flex">
            {/*if user isn't logged in*/}

            {
              !user ? (
                <>
                  <button
                    onClick={onClickLogin}
                    className="ml-6 rounded-lg py-3 px-6 font-semibold text-white hover:bg-white hover:text-primary"
                  >
                    <span>Login</span>
                  </button>
                  <button onClick={() => router.push("/account/services")} className="rounded-lg bg-white px-6 py-3 font-semibold text-primary hover:bg-white/90">
                    Book Now
                  </button>
                </>) : (

                <>
                  <button onClick={() => router.push("/account/bookings")} className="ml-6 inline-flex rounded-lg bg-white py-3 px-6 font-semibold text-primary hover:bg-white/90">
                    <RiUser3Fill size={24} className="mr-2" />
                    <span>Account</span>
                  </button>
                  {/* <button className="relative rounded-lg bg-white px-3 py-2 font-semibold text-primary hover:bg-white/90">
                    <RiNotification2Fill size={24} />
                    <span className="absolute -top-3 -right-3 h-7 min-w-[1.75rem] rounded-full border-2 border-white bg-[#ED6340] px-0.5 text-white">
                      9
                    </span>
                  </button> */}
                </>
              )
            }
          </div>

          {/*menu button for mobile only*/}
          <div className="ml-auto flex md:hidden">
            <button
              onClick={toggleMenu}
              className="rounded-md p-2 hover:bg-black/10"
            >
              <RiMenu5Fill className="text-white" size={28} />
            </button>

            {/*if user is logged in, show notification and account icon*/}
            <button onClick={()=> router.push('/account/bookings') } className="rounded-md p-2 text-white hover:bg-black/10">
              <RiUser3Fill size={24} />
            </button>
            {/* <button className="relative rounded-md py-2 px-3 font-semibold text-white hover:bg-black/10">
              <RiNotification2Fill size={24} />
              <span className="absolute -top-1 -right-1 h-6 min-w-[1.5rem] rounded-full border-2 border-white bg-[#ED6340] px-0.5 text-sm text-white">
                7
              </span>
            </button> */}
          </div>
        </div>
      </header>

      <Transition.Root show={sideMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[1000] md:hidden"
          onClose={setSideMenuOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full flex-1 flex-col bg-gray-50">
                <div className="flex items-center justify-between gap-2 border-b p-4">
                  <h1 className="text-lg font-semibold">Menu</h1>
                  <button
                    onClick={toggleMenu}
                    className="text-gray-500 hover:text-dark"
                  >
                    <XMarkIcon className="h-6 w-6 stroke-2" />
                  </button>
                </div>
                <div className="px-2 py-4"><NavList setAboutUsOpen={setAboutUsOpen} setContactUsOpen={setContactUsOpen} toggleMenu={toggleMenu} /></div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default HeaderHome;
