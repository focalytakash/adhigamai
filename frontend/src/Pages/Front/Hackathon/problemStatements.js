export const PROBLEM_GROUPS = [
  {
    group: "Agriculture",
    items: [
      {
        value: "Farmers — Fair Price Discovery for Crops",
        label: "Fair Price Discovery for Crops",
        hint: "A simple app, SMS, or IVR system so farmers can check daily market prices before they sell.",
      },
      {
        value: "Farmers — Early Warning for Crop Damage",
        label: "Early Warning for Crop Damage",
        hint: "An easy alert system (WhatsApp, SMS, or community broadcast) that warns farmers about pest, disease, or weather risks.",
      },
      {
        value: "Farmers — Simplified Access to Loans and Government Schemes",
        label: "Simplified Access to Loans and Government Schemes",
        hint: "A mobile or kiosk idea that tells a farmer which loans and schemes they are eligible for from basic details.",
      },
    ],
  },
  {
    group: "Army / Defence",
    items: [
      {
        value: "Army / Defence — Health Monitoring for Soldiers in Remote Areas",
        label: "Health Monitoring for Soldiers in Remote Areas",
        hint: "A wearable concept that tracks basic vitals and alerts the base camp if something is abnormal.",
      },
      {
        value: "Army / Defence — Emergency Communication in No-Network Zones",
        label: "Emergency Communication in No-Network Zones",
        hint: "A low-cost way for soldiers to send an SOS even without regular mobile network access.",
      },
      {
        value: "Army / Defence — Community Reporting Near Border Areas",
        label: "Community Reporting Near Border Areas",
        hint: "A simple, confidential reporting system so villagers can alert army or police quickly and safely.",
      },
    ],
  },
  {
    group: "Startups",
    items: [
      {
        value: "Startups — Local Skilled Worker Marketplace",
        label: "Local Skilled Worker Marketplace",
        hint: "An app or website that connects local skilled workers with nearby customers, including trust and ratings.",
      },
      {
        value: "Startups — Waste-to-Earn Rewards Platform",
        label: "Waste-to-Earn Rewards Platform",
        hint: "A rewards system where people earn cash, discounts, or points for dropping recyclable waste at collection points.",
      },
      {
        value: "Startups — Home-Cooked Meal Delivery Network",
        label: "Home-Cooked Meal Delivery Network",
        hint: "A startup that connects homemakers cooking extra food with nearby customers who want affordable home-style meals.",
      },
    ],
  },
  {
    group: "Real-Life Problems",
    items: [
      {
        value: "Real-Life Problems — Reducing Household Water Wastage",
        label: "Reducing Household Water Wastage",
        hint: "A low-cost device or habit-based system that alerts a household when water is being wasted.",
      },
      {
        value: "Real-Life Problems — Daily Check-In System for Elderly Living Alone",
        label: "Daily Check-In System for Elderly Living Alone",
        hint: "A call- or app-based daily wellness check that alerts family if there is no response.",
      },
      {
        value: "Real-Life Problems — Support System for Student Exam Stress",
        label: "Support System for Student Exam Stress",
        hint: "A peer helpline, app, or in-college program so students can get quick guidance during exam stress.",
      },
    ],
  },
  {
    group: "Road & Vehicle Safety",
    items: [
      {
        value: "Road & Vehicle Safety — Automatic Accident Alert System",
        label: "Automatic Accident Alert System",
        hint: "An app or sensor idea that detects a crash and alerts family or nearby hospitals with the location.",
      },
      {
        value: "Road & Vehicle Safety — Helmet and Seatbelt Reminder System",
        label: "Helmet and Seatbelt Reminder System",
        hint: "A reminder (sound, app, or sensor) that prompts a rider or driver to wear a helmet or seatbelt before starting.",
      },
      {
        value: "Road & Vehicle Safety — Pothole and Accident Hotspot Reporting",
        label: "Pothole and Accident Hotspot Reporting",
        hint: "An app or SMS system for citizens to report dangerous road spots to local authorities with location details.",
      },
    ],
  },
];

export const PROBLEM_VALUES = PROBLEM_GROUPS.flatMap((group) => group.items.map((item) => item.value));
