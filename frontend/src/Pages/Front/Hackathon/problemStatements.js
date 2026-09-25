export const PROBLEM_GROUPS = [
  {
    group: "Agriculture",
    items: [
      {
        value: "AGRI-01",
        code: "AGRI-01",
        label: "Fair Price Discovery for Crops",
        description:
          "Farmers in rural areas often sell their agricultural produce to local middlemen or agents without knowing the actual prevailing market (mandi) rate. This information asymmetry leads to significant exploitation and substantially lower earnings for the farmer.",
      },
      {
        value: "AGRI-02",
        code: "AGRI-02",
        label: "Early Warning for Crop Damage",
        description:
          "Sudden pest infestations, fungal or bacterial plant diseases, and erratic micro-weather shifts such as unseasonal frost, hailstorms, and heavy downpours frequently damage standing crops before farmers can detect the threat or take preventive action, resulting in major financial losses.",
      },
      {
        value: "AGRI-03",
        code: "AGRI-03",
        label: "Simplified Access to Loans and Government Schemes",
        description:
          "The central and state governments launch numerous agricultural subsidy schemes, crop insurance policies, and low-interest institutional loan facilities. However, smallholder farmers remain largely unaware of their eligibility, and navigating complex government paperwork or multiple physical offices is overwhelming.",
      },
    ],
  },
  {
    group: "Army / Defence",
    items: [
      {
        value: "DEF-01",
        code: "DEF-01",
        label: "Health Monitoring for Soldiers in Remote Areas",
        description:
          "Armed forces personnel deployed at remote border outposts, extreme high-altitude glaciers, or rugged dense terrains face severe physiological hazards including hypothermia, hypoxia, dehydration, extreme fatigue, and combat injuries that often go undetected until critical.",
      },
      {
        value: "DEF-02",
        code: "DEF-02",
        label: "Emergency Communication in No-Network Zones",
        description:
          "In tactical forward positions, dense jungle warfare, mountainous border frontiers, or disaster-struck zones where commercial cellular towers and internet backbones are non-existent, soldiers are cut off from voice and data networks, creating catastrophic vulnerability during ambushes or medical emergencies.",
      },
      {
        value: "DEF-03",
        code: "DEF-03",
        label: "Community Reporting Near Border Areas",
        description:
          "Civilian populations living in sensitive border villages frequently observe suspicious vehicular movement, unidentified drones, unauthorized border infiltration, or suspicious packages long before security patrols arrive. However, they lack a safe, swift, and confidential medium to inform defence authorities.",
      },
    ],
  },
  {
    group: "Startups",
    items: [
      {
        value: "START-01",
        code: "START-01",
        label: "Local Skilled Worker Marketplace",
        description:
          "Informal blue-collar artisans and skilled tradespeople such as carpenters, electricians, plumbers, masons, mechanics, and tailors rely almost entirely on irregular word-of-mouth recommendations, leading to severe income volatility. At the same time, local households and small businesses struggle to locate reliable, vetted service providers nearby.",
      },
      {
        value: "START-02",
        code: "START-02",
        label: "Waste-to-Earn Rewards Platform",
        description:
          "Civic segregation and recycling initiatives struggle because households, students, and shops have little tangible incentive to separate dry recyclables such as plastic, paper, e-waste, and aluminium from wet municipal garbage, leading to overflowing landfills and wasted circular-economy potential.",
      },
      {
        value: "START-03",
        code: "START-03",
        label: "Home-Cooked Meal Delivery Network",
        description:
          "Millions of college students, young professionals, and migrant workers living away from home depend on unhygienic, expensive, or repetitive commercial fast food. Simultaneously, millions of skilled homemakers possess cooking talent and underutilized kitchen capacity but lack the logistics or marketing platform to monetize their skills.",
      },
    ],
  },
  {
    group: "Real-Life Problems",
    items: [
      {
        value: "LIFE-01",
        code: "LIFE-01",
        label: "Reducing Household Water Wastage",
        description:
          "Urban and semi-urban localities suffer from chronic groundwater depletion and water scarcity, yet millions of litres of potable treated water are lost daily in residential buildings due to overhead tank overflows, slow-leaking cisterns, faulty taps, and unattended irrigation hoses.",
      },
      {
        value: "LIFE-02",
        code: "LIFE-02",
        label: "Daily Check-In System for Elderly Living Alone",
        description:
          "An increasing number of senior citizens reside independently while their adult children live in different cities or abroad. In the event of a sudden fall, stroke, cardiac distress, or disorientation, days may pass before anyone notices, often resulting in tragic and preventable outcomes.",
      },
      {
        value: "LIFE-03",
        code: "LIFE-03",
        label: "Support System for Student Exam Stress",
        description:
          "High-stakes competitive examinations, semester finals, and academic performance pressure generate acute anxiety and mental exhaustion among high school and university students. Fear of social stigma, peer competition, and lack of immediate, confidential counselling prevent students from seeking help.",
      },
    ],
  },
  {
    group: "Road & Vehicle Safety",
    items: [
      {
        value: "ROAD-01",
        code: "ROAD-01",
        label: "Automatic Accident Alert System",
        description:
          "In vehicular collisions and two-wheeler crashes, particularly along rural highways or during night commutes, critical medical attention during the Golden Hour is frequently delayed because victims are incapacitated and unable to call for help, while passersby may hesitate to intervene.",
      },
      {
        value: "ROAD-02",
        code: "ROAD-02",
        label: "Helmet and Seatbelt Reminder System",
        description:
          "A significant percentage of vehicular fatalities on Indian roads stem directly from failure to buckle seatbelts in cars or wear helmets on motorized two-wheelers. Despite punitive traffic fines, drivers and riders routinely neglect protective gear due to complacency or convenience.",
      },
      {
        value: "ROAD-03",
        code: "ROAD-03",
        label: "Pothole and Accident Hotspot Reporting",
        description:
          "Unrepaired potholes, washed-out road shoulders, and poorly engineered blind intersections cause thousands of severe road accidents annually. Municipal road authorities often remain unaware of road damage until accidents occur, while citizens find manual complaint filing cumbersome and futile.",
      },
    ],
  },
];

export const PROBLEM_VALUES = PROBLEM_GROUPS.flatMap((group) => group.items.map((item) => item.value));
