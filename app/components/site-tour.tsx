"use client";

import { driver, type DriveStep } from "driver.js";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const TOUR_STORAGE_KEY = "tapcare-tour-seen";
const MOBILE_BREAKPOINT = 767;

const desktopTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Welcome to TapCare",
      description:
        "This guided tour walks through the landing page sections, product story, and contact area.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="site-nav"]',
    popover: {
      title: "Navigation",
      description:
        "Use the sticky navigation to jump between sections anywhere on the page.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="hero"]',
    popover: {
      title: "Hero Section",
      description:
        "The homepage introduces TapCare as an emergency medical response system built for urgent school situations.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="hero-actions"]',
    popover: {
      title: "Primary Actions",
      description:
        "Visitors can download the APK directly or continue into the product overview.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="about"]',
    popover: {
      title: "About TapCare",
      description:
        "This section explains the platform's mission and who it is designed to support.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="features"]',
    popover: {
      title: "Feature Overview",
      description:
        "The feature area highlights the main emergency-response capabilities included in the app.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="feature-carousel"]',
    popover: {
      title: "Interactive Carousel",
      description:
        "Browse the feature cards with the arrows, indicators, or a swipe gesture on touch devices.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="tutorial"]',
    popover: {
      title: "Tutorial Section",
      description:
        "This part explains the mobile app, dashboard, and the general user flow.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="contact"]',
    popover: {
      title: "Contact Area",
      description:
        "The footer combines contact details, social links, a message form, and the campus location.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="contact-form"]',
    popover: {
      title: "Message Form",
      description:
        "Visitors can leave their contact details and send a message from here.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="contact-map"]',
    popover: {
      title: "Campus Map",
      description:
        "The embedded map helps visitors locate Rizal High School quickly.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="tour-trigger"]',
    popover: {
      title: "Replay the Tour",
      description:
        "Use this button any time you want to restart the guided walkthrough.",
      side: "left",
      align: "center",
    },
  },
];

const mobileTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Welcome to TapCare",
      description:
        "This mobile walkthrough focuses on the sections and controls that are actually visible on smaller screens.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="site-nav"]',
    popover: {
      title: "Sticky Navigation",
      description:
        "The top bar stays accessible while you scroll so you can move around the page quickly.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="mobile-nav-toggle"]',
    popover: {
      title: "Menu Toggle",
      description:
        "Use this button to open the mobile menu and jump directly to any section.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: '[data-tour="hero"]',
    popover: {
      title: "Hero Section",
      description:
        "This opening section summarizes the product and frames TapCare as a fast emergency-response tool.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="hero-actions"]',
    popover: {
      title: "Primary Actions",
      description:
        "From here, mobile visitors can download the APK or continue deeper into the product overview.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="about"]',
    popover: {
      title: "About TapCare",
      description:
        "This section explains the platform mission and the groups it supports inside the school community.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="feature-carousel"]',
    popover: {
      title: "Feature Carousel",
      description:
        "On mobile, this carousel is the main way to explore the app capabilities. Swipe to move between cards.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="tutorial"]',
    popover: {
      title: "Tutorial Section",
      description:
        "This area explains the mobile application, the response dashboard, and the intended usage flow.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="contact-form"]',
    popover: {
      title: "Contact Form",
      description:
        "Visitors can send a message directly from mobile using the form here.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="contact-map"]',
    popover: {
      title: "Campus Map",
      description:
        "The map gives mobile visitors a quick location reference for Rizal High School.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="tour-trigger"]',
    popover: {
      title: "Replay the Tour",
      description:
        "Restart the mobile walkthrough any time from this floating button.",
      side: "left",
      align: "center",
    },
  },
];

const isMobileViewport = () =>
  window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

export default function SiteTour() {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const createTour = () =>
    driver({
      animate: true,
      allowClose: true,
      overlayClickBehavior: "close",
      showProgress: true,
      smoothScroll: true,
      disableActiveInteraction: false,
      stagePadding: 10,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      steps: isMobileViewport() ? mobileTourSteps : desktopTourSteps,
      onDestroyed: () => {
        document.body.classList.remove("driver-tour-open");
      },
      onHighlightStarted: () => {
        document.body.classList.add("driver-tour-open");
      },
    });

  useEffect(() => {
    driverRef.current = createTour();

    const hasSeenTour = window.sessionStorage.getItem(TOUR_STORAGE_KEY);

    if (!hasSeenTour) {
      const timeoutId = window.setTimeout(() => {
        driverRef.current?.destroy();
        driverRef.current = createTour();
        driverRef.current?.drive();
        window.sessionStorage.setItem(TOUR_STORAGE_KEY, "true");
      }, 900);

      return () => {
        window.clearTimeout(timeoutId);
        driverRef.current?.destroy();
      };
    }

    return () => {
      driverRef.current?.destroy();
    };
  }, []);

  const startTour = () => {
    window.sessionStorage.setItem(TOUR_STORAGE_KEY, "true");
    driverRef.current?.destroy();
    driverRef.current = createTour();
    driverRef.current?.drive();
  };

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <button
      type="button"
      data-tour="tour-trigger"
      onClick={startTour}
      className="fixed left-3 right-3 z-[70] flex items-center justify-center rounded-full border border-white/25 bg-white px-4 py-3 text-sm font-semibold text-red-700 shadow-[0_14px_34px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-0.5 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300 sm:left-auto sm:right-8 sm:px-5"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      aria-label="Start website tour"
    >
      Take the tour
    </button>,
    document.body
  );
}