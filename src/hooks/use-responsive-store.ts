"use client";

import { create } from "zustand";
import { useWindowScroll } from "react-use";
import { useEffect, useRef } from "react";

// Define the store's state and actions interface
interface ResponsiveStore {
    // State
    isMobile: boolean;          // Tracks if we're on mobile viewport
    isNavbarVisible: boolean;   // Controls navbar visibility

    // Actions
    setIsMobile: (isMobile: boolean) => void;
    setNavbarVisible: (visible: boolean) => void;

    // Computed value to determine if we should hide navbar
    shouldHideNavbar: (scrollY: number) => boolean;
}

// Create the store with Zustand
export const useResponsiveStore = create<ResponsiveStore>((set, get) => ({
    // Initial state
    isMobile: false,
    isNavbarVisible: true,

    // Actions
    setIsMobile: (isMobile) => set({ isMobile }),
    setNavbarVisible: (visible) => set({ isNavbarVisible: visible }),

    // Helper method to determine navbar visibility
    shouldHideNavbar: (scrollY) => {
        const { isMobile, isNavbarVisible } = get();
        // Only hide navbar on mobile and when not at top
        return isMobile && !isNavbarVisible && scrollY > 0;
    }
}));

// Custom hook to handle mobile detection
export const useInitResponsive = () => {
    const setIsMobile = useResponsiveStore((state) => state.setIsMobile);

    // Set mobile state based on window width
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // Standard mobile breakpoint
        };

        // Check immediately
        checkMobile();

        // Listen for resize events
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [setIsMobile]);
};

// Custom hook to handle navbar scroll behavior
export const useNavbarScroll = () => {
    const { y: scrollY } = useWindowScroll();
    const lastScrollY = useRef(0);
    const setNavbarVisible = useResponsiveStore((state) => state.setNavbarVisible);

    useEffect(() => {
        if (scrollY === 0) {
            // Always show navbar at top of page
            setNavbarVisible(true);
        } else if (scrollY > lastScrollY.current) {
            // Scrolling down - hide navbar
            setNavbarVisible(false);
        } else {
            // Scrolling up - show navbar
            setNavbarVisible(true);
        }

        lastScrollY.current = scrollY;
    }, [scrollY, setNavbarVisible]);

    return scrollY;
}; 