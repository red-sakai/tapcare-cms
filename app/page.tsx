"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaEnvelope,
  FaFacebookF,
  FaFirstAid,
  FaHeartbeat,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaThumbsUp,
  FaTwitter,
  FaUserMd,
  FaUserShield,
} from "react-icons/fa";

const ContactMap = dynamic(() => import("@/app/components/contact-map"), {
  ssr: false,
});

const featureItems = [
  {
    title: "One-Tap or Shake Alert Trigger",
    description:
      "The app allows students, teaching personnel, and non-teaching personnel to send an instant emergency alert with a single tap on the screen or by shaking the device ",
    icon: FaBell,
  },
  {
    title: "Smart Medical Profiles",
    description:
      "Each user has the ability to create their own medical profiles where it indicates their critical information like allergies, chronic conditions (e.g., asthma), and emergency contacts. The information they would be sharing is ensured to be safe as to follow the Data Privacy Act of 2012.",
    icon: FaUserShield,
  },
  {
    title: "Real-Time Location Sharing",
    description:
      "When triggered, TAPCare shares the student’s live location with the school’s clinic and authorized responders to reduce delays in locating the victim.",
    icon: FaMapMarkedAlt,
  },
  {
    title: "Medical Team Dashboard",
    description:
      "This is a simple, well-responsive admin dashboard built using Flutter's cross-platform with Dart programming language capabilities. Enables nurses and designated responders to monitor incoming alerts, view the given medical profiles to coordinate in real-time.",
    icon: FaUserMd,
  },
  {
    title: "Basic First-Aid Guide",
    description: "Only applicable to basic medical conditions such as breathing techniques, panic attacks, and etc. We must leave any other conditions to the medical professionals.",
    icon: FaFirstAid,
  },
  {
    title: "SOS Alert & Fall Detection",
    description:
      "TAPCare includes a fall detection feature for registered users with medical conditions such as seizures, panic attacks, or fainting. When the app detects a sudden drop or impact, it shows a confirmation button that the user must press and hold for 10 seconds to cancel if it was accidental. If there is no response, the system automatically sends an alert to the school clinic dashboard with the student’s location and medical profile for immediate assistance.",
    icon: FaHeartbeat,
  },
];

type SectionId = "home" | "about-us" | "features" | "tutorial" | "contact";

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isFeatureAnimating, setIsFeatureAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const totalFeatures = featureItems.length;

  const goToFeature = useCallback(
    (index: number) => {
      if (isFeatureAnimating) {
        return;
      }
      setIsFeatureAnimating(true);
      setCurrentFeature((index + totalFeatures) % totalFeatures);
    },
    [isFeatureAnimating, totalFeatures]
  );

  const prevFeature = useCallback(() => {
    goToFeature(currentFeature - 1);
  }, [currentFeature, goToFeature]);

  const nextFeature = useCallback(() => {
    goToFeature(currentFeature + 1);
  }, [currentFeature, goToFeature]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetId: `#${SectionId}`,
    section: SectionId
  ) => {
    event.preventDefault();
    setActiveSection(section);
    setIsMobileMenuOpen(false);

    const targetElement = document.querySelector<HTMLElement>(targetId);
    if (!targetElement) {
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetElement, {
        duration: 1.1,
        offset: -24,
      });
    } else {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    window.history.replaceState(null, "", targetId);
  };

  useEffect(() => {
    const sections: SectionId[] = ["home", "about-us", "features", "tutorial", "contact"];
    const sectionElements = sections
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sectionElements.length || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) {
          return;
        }

        const topEntry = visibleEntries[0].target.id as SectionId;
        setActiveSection(topEntry);
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItemClass = (section: SectionId) =>
    `inline-flex rounded-full px-5 py-2 text-sm transition-all ${
      activeSection === section
        ? "bg-white font-semibold text-red-700 shadow-sm"
        : "font-medium text-red-50/95 hover:bg-white/15"
    }`;

  const mobileNavItemClass = (section: SectionId) =>
    `inline-flex w-full justify-start rounded-full px-4 py-2.5 text-sm transition-all ${
      activeSection === section
        ? "bg-white font-semibold text-red-700 shadow-sm"
        : "font-medium text-red-50/95 hover:bg-white/15"
    }`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFeatureAnimating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentFeature]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFeatureAnimating) {
        goToFeature(currentFeature + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentFeature, isFeatureAnimating, goToFeature]);

  useEffect(() => {
    const sectionsToReveal = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (!sectionsToReveal.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      sectionsToReveal.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add("is-visible");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    requestAnimationFrame(() => {
      sectionsToReveal.forEach((section) => observer.observe(section));
    });

    return () => observer.disconnect();
  }, []);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.targetTouches[0].clientX;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const difference = touchStartX.current - touchEndX.current;
    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        nextFeature();
      } else {
        prevFeature();
      }
    }
  };

  const getFeaturePosition = (index: number) => {
    const difference = (index - currentFeature + totalFeatures) % totalFeatures;

    if (difference === 0) {
      return "center";
    }
    if (difference === 1) {
      return "right";
    }
    if (difference === totalFeatures - 1) {
      return "left";
    }
    return "hidden";
  };

  const activeFeature = featureItems[currentFeature];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-red-950 px-6 py-8 font-sans">
      <div className="mx-auto flex w-full max-w-[92rem] flex-col gap-8">
        <nav className="sticky top-4 z-50 w-full max-w-[22rem] self-center md:w-auto md:max-w-none">
          <div className="rounded-[2.2rem] border border-white/25 bg-gradient-to-r from-red-700/80 via-red-600/75 to-red-800/80 px-4 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-md md:rounded-full md:px-5 md:py-2">
            <div className="flex items-center justify-between gap-3 md:hidden">
              <a
                href="#home"
                className="inline-flex items-center p-1"
                onClick={(event) => handleNavClick(event, "#home", "home")}
              >
                <Image
                  src="/tapcare-assets/tapcare-logo-only.png"
                  alt="Tapcare logo"
                  width={34}
                  height={34}
                  priority
                />
              </a>
              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
              >
                <span className="text-xl leading-none">{isMobileMenuOpen ? "✕" : "☰"}</span>
              </button>
            </div>

            {isMobileMenuOpen && (
              <ul className="mt-3 flex flex-col gap-1.5 pb-1 md:hidden">
                <li>
                  <a
                    href="#home"
                    className={mobileNavItemClass("home")}
                    onClick={(event) => handleNavClick(event, "#home", "home")}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about-us"
                    className={mobileNavItemClass("about-us")}
                    onClick={(event) =>
                      handleNavClick(event, "#about-us", "about-us")
                    }
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className={mobileNavItemClass("features")}
                    onClick={(event) =>
                      handleNavClick(event, "#features", "features")
                    }
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#tutorial"
                    className={mobileNavItemClass("tutorial")}
                    onClick={(event) =>
                      handleNavClick(event, "#tutorial", "tutorial")
                    }
                  >
                    Tutorial
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className={mobileNavItemClass("contact")}
                    onClick={(event) =>
                      handleNavClick(event, "#contact", "contact")
                    }
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="https://tapcaredownload.vercel.app/"
                    className="mt-1 inline-flex w-full justify-center rounded-full bg-orange-400 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-300"
                  >
                    Download APK
                  </a>
                </li>
              </ul>
            )}

            <ul className="hidden items-center gap-2 md:flex">
              <li className="mt-1 pl-1 pr-2">
                <a
                  href="#home"
                  className="inline-flex items-center p-1.5"
                  onClick={(event) => handleNavClick(event, "#home", "home")}
                >
                  <Image
                    src="/tapcare-assets/tapcare-logo-only.png"
                    alt="Tapcare logo"
                    width={34}
                    height={34}
                    priority
                  />
                </a>
              </li>
              <li>
                <a
                  href="#home"
                  className={navItemClass("home")}
                  onClick={(event) => handleNavClick(event, "#home", "home")}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about-us"
                  className={navItemClass("about-us")}
                  onClick={(event) =>
                    handleNavClick(event, "#about-us", "about-us")
                  }
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className={navItemClass("features")}
                  onClick={(event) =>
                    handleNavClick(event, "#features", "features")
                  }
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#tutorial"
                  className={navItemClass("tutorial")}
                  onClick={(event) =>
                    handleNavClick(event, "#tutorial", "tutorial")
                  }
                >
                  Tutorial
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className={navItemClass("contact")}
                  onClick={(event) =>
                    handleNavClick(event, "#contact", "contact")
                  }
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://tapcaredownload.vercel.app/"
                  className="inline-flex rounded-full bg-orange-400 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-300"
                >
                  Download APK
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <main
          id="home"
          data-reveal
          className="reveal-on-scroll relative px-8 py-14 sm:px-12 lg:min-h-[78vh] lg:px-16 lg:py-20"
        >
          <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="pointer-events-none absolute right-16 top-24 h-52 w-52 rounded-full bg-yellow-200/20 blur-3xl" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <Image
                src="/tapcare-assets/tapcare-logo-with-tagline.png"
                alt="Tapcare Emergency Medical Response System"
                width={640}
                height={220}
                priority
                className="h-auto w-full max-w-xl"
              />
              <p className="max-w-xl text-base text-red-50/90 sm:text-lg">
                Built for critical situations: instantly trigger emergency alerts,
                share live location, and improve response time when every second
                matters.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://tapcaredownload.vercel.app/"
                  className="rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-300"
                >
                  Download APK
                </a>
                <a
                  href="#about-us"
                  className="rounded-full border border-red-300/60 px-6 py-3 text-sm font-semibold text-red-50 transition-colors hover:bg-red-700/60"
                  onClick={(event) =>
                    handleNavClick(event, "#about-us", "about-us")
                  }
                >
                  Learn More
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-none">
              <Image
                src="/tapcare-assets/tapcare-phone.png"
                alt="Tapcare phone app"
                width={1400}
                height={2240}
                className="relative z-10 mx-auto h-auto w-[28rem] drop-shadow-[0_20px_45px_rgba(0,0,0,0.45)] sm:w-[40rem] lg:w-[60rem]"
              />
            </div>
          </div>
        </main>

        <section
          id="about-us"
          data-reveal
          className="reveal-on-scroll relative mx-auto w-full max-w-6xl px-8 pb-24 pt-10 sm:px-12 lg:px-16"
        >
          <div className="pointer-events-none absolute left-10 top-8 h-36 w-36 rounded-full bg-red-300/10 blur-3xl" />
          <div className="pointer-events-none absolute right-8 top-14 h-44 w-44 rounded-full bg-orange-300/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-200/80">
              About TapCare
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              About Us
            </h2>

            <div className="mx-auto mt-6 flex w-full max-w-sm items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-red-200/60" />
              <span className="text-sm font-medium text-red-100/85">Our Purpose</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-red-200/60" />
            </div>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-red-50/95 sm:text-xl">
              <span className="font-semibold text-orange-200">TAPCARE</span> (Trigger
              Alert Protocol) is a mobile application designed to assist Senior
              High School students of Rizal High School during medical
              emergencies. Its purpose is to provide a fast and reliable way to
              send alerts to the school clinic, share the student’s medical
              information, and allow responders to locate and assist the student
              quickly.
            </p>

            <div className="mt-14 grid gap-7 text-center md:grid-cols-2 xl:grid-cols-3">
              <article className="group overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-white/18 to-white/[0.07] shadow-[0_16px_45px_rgba(0,0,0,0.28)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
                <div className="relative">
                  <Image
                    src="/tapcare-assets/students.png"
                    alt="Students"
                    width={640}
                    height={360}
                    className="h-52 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/70 via-red-900/10 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">Students</h3>
                  <p className="mt-3 text-sm leading-7 text-red-50/90">
                    TAPCare helps students of Rizal High School get emergency
                    help quickly using a one-tap or one-shake alert. It also has
                    a basic first-aid guide so students can help others while
                    waiting for the nurse. The app can show important health
                    information, even offline, to help students with medical
                    conditions get faster care.
                  </p>
                </div>
              </article>

              <article className="group overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-white/18 to-white/[0.07] shadow-[0_16px_45px_rgba(0,0,0,0.28)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
                <div className="relative">
                  <Image
                    src="/tapcare-assets/staff.png"
                    alt="School staff"
                    width={640}
                    height={360}
                    className="h-52 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/70 via-red-900/10 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">School Staff</h3>
                  <p className="mt-3 text-sm leading-7 text-red-50/90">
                    TAPCare helps teachers, staff, and security respond faster
                    during emergencies. It improves communication and helps keep
                    the school safer.
                  </p>
                </div>
              </article>

              <article className="group overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-white/18 to-white/[0.07] shadow-[0_16px_45px_rgba(0,0,0,0.28)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 md:col-span-2 xl:col-span-1">
                <div className="relative">
                  <Image
                    src="/tapcare-assets/medical_personnel.png"
                    alt="Medical personnel"
                    width={640}
                    height={360}
                    className="h-52 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/70 via-red-900/10 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">Medical Personnel</h3>
                  <p className="mt-3 text-sm leading-7 text-red-50/90">
                    TAPCare helps school nurses see students’ medical
                    information, emergency contacts, and health conditions
                    quickly. This helps them prepare and give faster and better
                    care.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="features"
          data-reveal
          className="reveal-on-scroll relative mx-auto w-full max-w-6xl px-8 pb-24 pt-6 sm:px-12 lg:px-16"
        >
          <div className="pointer-events-none absolute left-10 top-8 h-36 w-36 rounded-full bg-red-300/10 blur-3xl" />
          <div className="pointer-events-none absolute right-8 top-14 h-44 w-44 rounded-full bg-orange-300/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-200/80">
              TapCare Platform
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Features
            </h2>

            <div className="mx-auto mt-6 flex w-full max-w-sm items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-red-200/60" />
              <span className="text-sm font-medium text-red-100/85">What We Offer</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-red-200/60" />
            </div>

            <div
              className="mt-12"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative h-[380px] overflow-hidden sm:h-[430px]">
                {featureItems.map((feature, index) => {
                  const position = getFeaturePosition(index);

                  if (position === "hidden") {
                    return null;
                  }

                  return (
                    <div
                      key={feature.title}
                      className={`absolute left-1/2 top-1/2 w-[84%] -translate-y-1/2 transition-all duration-500 ease-out sm:w-[72%] md:w-[60%] ${
                        position === "center"
                          ? "z-20 -translate-x-1/2 scale-100 opacity-100"
                          : position === "left"
                            ? "z-10 hidden -translate-x-[120%] scale-90 opacity-45 md:block"
                            : "z-10 hidden translate-x-[20%] scale-90 opacity-45 md:block"
                      }`}
                    >
                      <article className="h-full rounded-3xl border border-white/20 bg-gradient-to-b from-red-700/35 to-red-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
                        <div className="flex h-full flex-col items-center px-6 py-8 text-center sm:px-10">
                          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-300/20 text-3xl text-orange-200 ring-1 ring-orange-200/40">
                            <feature.icon />
                          </div>
                          <h3 className="flex min-h-[4.25rem] items-center justify-center text-2xl font-bold text-white sm:min-h-[4.75rem]">
                            {feature.title}
                          </h3>
                          <p className="mt-4 flex min-h-[8.5rem] items-start text-sm leading-7 text-red-50/90 sm:min-h-[9.5rem] sm:text-base">
                            {feature.description}
                          </p>
                        </div>
                      </article>
                    </div>
                  );
                })}

                <button
                  onClick={prevFeature}
                  disabled={isFeatureAnimating}
                  className="absolute left-0 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xl text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 disabled:opacity-40 sm:left-3"
                  aria-label="Previous feature"
                >
                  ‹
                </button>
                <button
                  onClick={nextFeature}
                  disabled={isFeatureAnimating}
                  className="absolute right-0 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xl text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 disabled:opacity-40 sm:right-3"
                  aria-label="Next feature"
                >
                  ›
                </button>
              </div>

              <div className="mt-8 text-center">
                <h4 className="text-2xl font-bold text-white sm:text-3xl">
                  {activeFeature.title}
                </h4>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2">
                {featureItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToFeature(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentFeature
                        ? "h-2 w-8 bg-orange-300"
                        : "h-2 w-2 bg-white/35 hover:bg-white/60"
                    }`}
                    aria-label={`Go to feature ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="tutorial"
          data-reveal
          className="reveal-on-scroll relative mx-auto w-full max-w-6xl px-8 pb-24 pt-6 sm:px-12 lg:px-16"
        >
          <div className="pointer-events-none absolute left-10 top-8 h-36 w-36 rounded-full bg-red-300/10 blur-3xl" />
          <div className="pointer-events-none absolute right-8 top-14 h-44 w-44 rounded-full bg-orange-300/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-200/80">
              TapCare Guide
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tutorial
            </h2>

            <div className="mx-auto mt-6 flex w-full max-w-sm items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-red-200/60" />
              <span className="text-sm font-medium text-red-100/85">How It Works</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-red-200/60" />
            </div>

            <div className="mt-14 grid gap-7 text-center md:grid-cols-2 xl:grid-cols-3">
              <article className="group overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-white/18 to-white/[0.07] shadow-[0_16px_45px_rgba(0,0,0,0.28)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
                <div className="relative">
                  <Image
                    src="/tapcare-assets/tapcare-mobile-application.png"
                    alt="Mobile application"
                    width={640}
                    height={360}
                    className="h-52 w-full object-contain bg-red-950/20 p-4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-red-900/5 to-transparent" />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-center text-xl font-bold text-white">Mobile Application</h3>
                  <p className="mt-3 text-sm leading-7 text-red-50/90">
                    TAPCARE (Trigger Alert Protocol) is a mobile application
                    designed to assist Senior High School students of Rizal High
                    School during medical emergencies. Its purpose is to provide
                    a fast and reliable way to send alerts to the school clinic,
                    share the student’s medical information, and allow responders
                    to locate and assist the student quickly.
                  </p>
                </div>
              </article>

              <article className="group overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-white/18 to-white/[0.07] shadow-[0_16px_45px_rgba(0,0,0,0.28)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
                <div className="relative">
                  <Image
                    src="/tapcare-assets/tapcare-dashboard.png"
                    alt="Dashboard"
                    width={640}
                    height={360}
                    className="h-52 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-red-900/5 to-transparent" />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-center text-xl font-bold text-white">Dashboard</h3>
                  <p className="mt-3 text-sm leading-7 text-red-50/90">
                    TAPCARE dashboard is used by medical personnel to monitor
                    incoming alerts, view the student’s details and condition,
                    track their location, and manage emergency responses
                    efficiently. It helps the clinic respond faster and
                    coordinate assistance more effectively.
                  </p>
                </div>
              </article>

              <article className="group overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-white/18 to-white/[0.07] shadow-[0_16px_45px_rgba(0,0,0,0.28)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 md:col-span-2 xl:col-span-1">
                <div className="relative">
                  <Image
                    src="/tapcare-assets/tapcare-how-to-use-the-app.png"
                    alt="How to use the app"
                    width={640}
                    height={360}
                    className="h-52 w-full object-contain bg-red-950/20 p-4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-red-900/5 to-transparent" />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-center text-xl font-bold text-white">How To Use The App</h3>
                  <p className="mt-3 text-sm leading-7 text-red-50/90">
                    TAPCARE dashboard is used by medical personnel to monitor
                    incoming alerts, view the student’s details and condition,
                    track their location, and manage emergency responses
                    efficiently. It helps the clinic respond faster and
                    coordinate assistance more effectively.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <div className="h-px w-full bg-white/20" />

          <footer
            id="contact"
            data-reveal
            className="reveal-on-scroll relative w-full bg-gradient-to-b from-red-950/65 to-red-950/90"
          >
            <div className="pointer-events-none absolute left-8 top-6 h-32 w-32 rounded-full bg-red-300/10 blur-3xl" />
            <div className="pointer-events-none absolute right-10 top-8 h-44 w-44 rounded-full bg-orange-300/10 blur-3xl" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pb-12 pt-10 sm:px-12 lg:px-16">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Contact Us</h2>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="space-y-8 text-red-50/95">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="mt-1 text-xl text-red-200" />
                  <p className="text-lg leading-8">
                    Dr. Sixto Antonio Avenue, Caniogan, Pasig City, Metro Manila,
                    Philippines
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <FaPhoneAlt className="text-lg text-red-200" />
                  <p className="text-lg">123-456-7890</p>
                </div>

                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-lg text-red-200" />
                  <p className="text-lg">tapcare.assistance@gmail.com</p>
                </div>

                <div className="flex items-center gap-4">
                  <FaThumbsUp className="text-lg text-red-200" />
                  <div className="flex items-center gap-3 text-base text-white">
                    <a
                      href="#"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 transition-colors hover:bg-black/50"
                      aria-label="Facebook"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="#"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 transition-colors hover:bg-black/50"
                      aria-label="Twitter"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="#"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 transition-colors hover:bg-black/50"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedinIn />
                    </a>
                    <a
                      href="#"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 transition-colors hover:bg-black/50"
                      aria-label="Instagram"
                    >
                      <FaInstagram />
                    </a>
                  </div>
                </div>
              </div>

              <form className="space-y-4 text-sm text-red-100/90">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="font-medium">First Name</span>
                    <input
                      type="text"
                      className="w-full border border-white/35 bg-white px-3 py-2 text-red-950 outline-none transition-colors focus:border-orange-300"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="font-medium">Last Name</span>
                    <input
                      type="text"
                      className="w-full border border-white/35 bg-white px-3 py-2 text-red-950 outline-none transition-colors focus:border-orange-300"
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="font-medium">Email *</span>
                  <input
                    type="email"
                    className="w-full border border-white/35 bg-white px-3 py-2 text-red-950 outline-none transition-colors focus:border-orange-300"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="font-medium">Message</span>
                  <textarea
                    rows={4}
                    className="w-full border border-white/35 bg-white px-3 py-2 text-red-950 outline-none transition-colors focus:border-orange-300"
                  />
                </label>

                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-red-100/80">Thanks for submitting!</p>
                  <button
                    type="button"
                    className="rounded-sm bg-blue-600 px-10 py-2 font-medium text-white transition-colors hover:bg-blue-500"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-12 border-t border-white/25 pt-8">
              <ContactMap />
            </div>
            </div>
          </footer>
          </div>
        </div>
      </div>
  );
}
