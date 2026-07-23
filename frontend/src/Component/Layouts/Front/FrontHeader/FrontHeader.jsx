import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, BriefcaseBusiness, CalendarDays, Cog, Compass, FlaskConical, Handshake, Images, MapPin, Sparkles, Zap } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import siteConfig from '../../../../config/siteConfig';
import "./FrontHeader.css";

const HOME_SECTION_SCROLL_OFFSET = 130;



function scrollToHomeSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HOME_SECTION_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", `/#${sectionId}`);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function normalizePath(path) {
  const p = path.replace(/\/$/, "") || "/";
  return p;
}

const FrontHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_MIPIE_BACKEND_URL;
  const { logo, logoAlt, name } = siteConfig.branding;
  const menuRef = useRef(null);
  const menuMainRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const dropdownRef = useRef(null);

  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [hoveredSubTab, setHoveredSubTab] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const toggleMenu = () => {
    const next = !isMenuActive;
    setIsMenuActive(next);
    document.body.classList.toggle("foc-mobile-nav-open", next);
    if (menuRef.current) {
      menuRef.current.classList.toggle("active", next);
      menuRef.current.classList.add("transition");
    }
    if (menuOverlayRef.current) {
      menuOverlayRef.current.classList.toggle("active", next);
      menuOverlayRef.current.classList.add("transition");
    }
  };

  // Handle login dropdown toggle
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownActive(!isDropdownActive);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownActive(false);
    }
  };

  const handleMenuClick = (e) => {
    if (!menuRef.current?.classList.contains("active")) {
      return;
    }
    if (e.target.closest(".nav-item-has-children")) {
      const hasChildren = e.target.closest(".nav-item-has-children");
      showSubMenu(hasChildren);
    }
  };

  const showSubMenu = (hasChildren) => {
    const subMenu = hasChildren.querySelector(".sub-menu");
    subMenu?.classList.toggle("active");
  };

  

  useEffect(() => {

    
    // Throttled scroll handler
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // Update scroll states
          const newIsScrolled = scrollTop > 50;
          const newIsRevealed = scrollTop > 700;
          
          if (newIsScrolled !== isScrolled) {
            setIsScrolled(newIsScrolled);
          }
          
          if (newIsRevealed !== isRevealed) {
            setIsRevealed(newIsRevealed);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Resize handler
    const handleResize = () => {
      if (menuRef.current?.classList.contains("transition")) {
        menuRef.current.classList.remove("transition");
      }
      if (menuOverlayRef.current?.classList.contains("transition")) {
        menuOverlayRef.current.classList.remove("transition");
      }

      if (window.innerWidth > 991 && isMenuActive) {
        toggleMenu();
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
      document.body.classList.remove('foc-mobile-nav-open');
    };
  }, [isMenuActive, isScrolled, isRevealed]);

  // Dynamic header classes — cyber electric shell; scroll classes kept for mobile menu compat
  const isHomePage = () => {
    const path = location.pathname.replace(/\/$/, "") || "/";
    return path === "/" || path === "/home";
  };

  const headerClasses = [
    'site-header',
    'site-header--sticky',
    'front-header--cyber',
    isHomePage() ? 'front-header--home' : '',
    isScrolled ? 'scrolling' : '',
    isRevealed ? 'reveal-header' : ''
  ].filter(Boolean).join(' ');

  const handlePartnerWithUs = () => {
    if (isMenuActive) {
      toggleMenu();
    }
  };

  const handleNavLinkClick = (e, targetPath) => {
    if (isMenuActive) {
      toggleMenu();
    }
    const current = normalizePath(location.pathname);
    const target = normalizePath(targetPath);
    if (current === target) {
      e.preventDefault();
      if (location.hash) {
        window.history.replaceState(null, "", targetPath);
      }
      scrollToTop();
    }
  };

  const handleSubTabClick = (e, tab) => {
    if (!tab.sectionId) return;
    e.preventDefault();
    setHoveredSubTab(tab.label);
    if (isHomePage()) {
      scrollToHomeSection(tab.sectionId);
    } else {
      navigate(`/#${tab.sectionId}`);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <header className={headerClasses}>
          <div className="container">
            <nav className="navbar site-navbar">
              <div className="brand-logo">
                <Link to="/" aria-label={`${name} Home`} onClick={(e) => handleNavLinkClick(e, "/")}> 
                  <img className="logo-light" src={logo} alt={logoAlt} />
                  <img className="logo-dark" src={logo} alt={logoAlt} />
                </Link>
              </div>
              
              <div className="menu-block-wrapper">
                <div className="menu-overlay" ref={menuOverlayRef} onClick={toggleMenu} role="presentation" />
                <nav className="menu-block" ref={menuRef} id="append-menu-header" onClick={(e) => e.stopPropagation()}>
                  <div className="mobile-menu-head">
                    <Link to="/" aria-label={`${name} Home`} onClick={toggleMenu}>
                      <img src={logo} alt={logoAlt} />
                    </Link>
                    <div className="current-menu-title"></div>
                    <div
                      className="mobile-menu-close"
                      onClick={(e) => { e.stopPropagation(); toggleMenu(); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleMenu(); } }}
                      role="button"
                      tabIndex={0}
                      aria-label="Close menu"
                    >
                      &times;
                    </div>
                  </div>
                  
                  <ul className="site-menu-main" ref={menuMainRef} onClick={handleMenuClick}>
                    <li className="nav-item">
                      <Link className='nav-link-item drop-trigger' to="/" onClick={(e) => handleNavLinkClick(e, "/")}>Home</Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link-item drop-trigger"
                        to="/#about"
                        onClick={(e) => {
                          if (isMenuActive) toggleMenu();
                          if (isHomePage()) {
                            e.preventDefault();
                            scrollToHomeSection("about");
                          }
                        }}
                      >
                        About Us
                      </Link>
                    </li>
                    
                    <li className="nav-item">
                      <Link
                        className="nav-link-item drop-trigger"
                        to="/#contact"
                        onClick={(e) => {
                          if (isMenuActive) toggleMenu();
                          if (isHomePage()) {
                            e.preventDefault();
                            scrollToHomeSection("contact");
                          }
                        }}
                      >
                        Contact Us
                      </Link>
                    </li>
                    
                   

                    {/* Fixed Login Dropdown */}
                    {/* <li className="nav-item small smallMobile">
                      <div 
                        className={`dropdown-container ${isDropdownActive ? 'active' : ''}`}
                        ref={dropdownRef}
                      >
                        <span 
                          className="drop-trigger active_menu loginbtnn homeMenu" 
                          id="loginLink"
                          onClick={toggleDropdown}
                        >
                          Login
                        </span>

                        <ul className="dropdown-menu" id="loginDropdown">
                          <li>
                            <Link to={`${backendUrl}/company/login`} className="dropdown-item">
                              Login as Company
                            </Link>
                          </li>
                          <li>
                            <Link to="/candidate/login" className="dropdown-item">
                              Login as Student
                            </Link>
                          </li>
                          <li>
                            <Link to="/institute/login" className="dropdown-item">
                              Login as Institute
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li> */}
                  </ul>
                </nav>
              </div>
              
              <div className="mobile-menu-trigger" onClick={toggleMenu}>
                <span></span>
              </div>
            </nav>

          </div>

          
        </header>
        
      </div>
    </>
  );
};

export default FrontHeader;

