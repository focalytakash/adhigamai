
import React from 'react';  // This must be first
import { useState,useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import Websocket from './utils/websocket'
import { WhatsAppProvider } from './contexts/WhatsAppContext';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from '../src/Pages/Front/HomePage/HomePage';

// import About from './Pages/Front/About/About';
import About from './Pages/Front/About/About';

import Contact from './Pages/Front/Contact/Contact';
import Carousel from './Pages/Front/Carousel/Carousel'; 

import "./App.css";
import CompanyLogin from './Pages/App/Company/CompanyLogin/CompanyLogin';

import CandidateLayout from './Component/Layouts/App/Candidates';
import CandidateDashboard from './Pages/App/Candidate/Dashboard/CandidateDashboard';
import CandidateProfile from './Pages/App/Candidate/Profile/CandidateProfile';
import Resume from './Pages/App/Candidate/Profile/Resume';
import SearchCourses from "./Pages/App/Candidate/Courses/SearchCourses"
import AppliedCourses from './Pages/App/Candidate/Courses/AppliedCourses';
import SearchCourseDetail from "./Pages/App/Candidate/Courses/SearchCourseDetail"
import CandidateNotification from './Pages/App/Candidate/Notification/CandidateNotification';

import Event from './Pages/Front/Event/Event';
import HackathonHome from './Pages/Front/Hackathon/HomePage';
import Hackathon from './Pages/Front/Hackathon/Hackathon';
import CandidateLogin from './Pages/App/Candidate/Login/CandidateLogin';
import Regitrationsold from './Pages/App/College/Course/Registrationsold'
import CollegeLayout from './Component/Layouts/App/College';
import CollegeLogin from './Pages/App/College/Login/CollegeLogin';
import CollegeRegister from './Pages/App/College/Register/CollegeRegister';
import Dashboard from './Pages/App/College/Dashboard/Dashboard';
import Profile from './Pages/App/College/Profile/Profile';
import CompanyLayout from './Component/Layouts/App/Company';

import PrivacyPolicy from './Pages/App/College/Register/privacyPolicy';
import TermsOfService from './Pages/App/College/Register/termsOfService';

// Trainer module
import TrainerLayout from './Component/Layouts/App/Trainer'
const Layout = () => {
  const location = useLocation();
  useEffect(() => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    };
  
    const getFbclid = () => {
      const params = new URLSearchParams(window.location.search);
      return params.get('fbclid');
    };
  
    const fbp = getCookie('_fbp');
    const fbcCookie = getCookie('_fbc');
    const fbclid = getFbclid();
  
    const fbcGenerated = fbclid ? `fb.1.${Date.now()}.${fbclid}` : null;
  
    if (fbp && !sessionStorage.getItem('_fbp')) {
      sessionStorage.setItem('_fbp', fbp);
    }
  
    if ((fbcCookie || fbcGenerated) && !sessionStorage.getItem('_fbc')) {
      sessionStorage.setItem('_fbc', fbcCookie || fbcGenerated);
    }
  }, []);

  

  return (
    <>
      {/* <FrontHeader /> */}
      <Routes>

        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/carousel" element={<Carousel />} />
        <Route exact path="/about" element={<About />} />
        {/* <Route exact path="/about_us" element={<About />} /> */}
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/cmp/login" element={<CompanyLogin />} />
        <Route path="/events" element={<Event />} />
        <Route path="/hackathonreg" element={<HackathonHome />} />
        <Route path="/hackathon/register" element={<Hackathon />} />

        {/* Candidate Parent Route */}
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate" element={<CandidateLayout />}>

          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="myprofile" element={<CandidateProfile />} />
          <Route path="searchcourses" element={<SearchCourses />} />
          <Route path="appliedCourses" element={<AppliedCourses />} />
          <Route path="notifications" element={<CandidateNotification />} />
          {/* <Route path="course" element={<CourseDetail/>}/> */}
          <Route path="course/:courseId" element={<SearchCourseDetail />} />
        </Route>
      

       

        {/*  college views  */}

        <Route path="/institute/login" element={<CollegeLogin />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/institute/register" element={<CollegeRegister />} />
        {/* CollegeLayout will wrap only protected pages */}
        <Route path="/institute" element={<CollegeLayout  />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="myprofile" element={<Profile/>}/>
        </Route>

        {/* company  */}

        <Route path="/cmp/login" element={<CompanyLogin />} />
      </Routes>
    </>
  );
};
const App = () => {
  return (
    <HelmetProvider>
      <WhatsAppProvider>
        <Router>
          <Layout />
        </Router>
      </WhatsAppProvider>
    </HelmetProvider>
  );
};

export default App;
