/**
 * SERVER-ONLY — EDP entrance exam question bank.
 *
 * This file contains the full question bank INCLUDING correct
 * answers / reference answers. It must never be imported by a
 * "use client" component or by any code that ends up in a browser
 * bundle — doing so would leak the answer key to applicants. Only
 * import this from API route handlers (src/app/api/edp/exam/**) or
 * other server-only modules.
 *
 * Section A: 30 typed-answer questions. The applicant types a free-
 * text response; these are never auto-graded — `expectedAnswer` is a
 * reference answer shown to the admin as a grading aid, and the
 * applicant's actual typed answer is reviewed and scored manually.
 * Section B: 70 multiple-choice questions, auto-graded against
 * `correctOptionId`.
 */

export interface BankOption {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface McqBankQuestion {
  id: number;
  section: "A" | "B";
  type: "mcq";
  prompt: string;
  options: BankOption[];
  correctOptionId: "A" | "B" | "C" | "D";
}

export interface TypedBankQuestion {
  id: number;
  section: "A";
  type: "typed";
  prompt: string;
  // Reference answer for the admin's benefit while manually grading
  // — never sent to the client, and never used for auto-scoring.
  expectedAnswer: string;
}

export type BankQuestion = McqBankQuestion | TypedBankQuestion;

export const SECTION_A_QUESTIONS: TypedBankQuestion[] = [
  {
    "id": 1,
    "section": "A",
    "type": "typed",
    "prompt": "What does UAV stand for?",
    "expectedAnswer": "Unmanned Aerial Vehicle"
  },
  {
    "id": 2,
    "section": "A",
    "type": "typed",
    "prompt": "What does VTOL stand for?",
    "expectedAnswer": "Vertical Take-Off and Landing"
  },
  {
    "id": 3,
    "section": "A",
    "type": "typed",
    "prompt": "What does ESC stand for?",
    "expectedAnswer": "Electronic Speed Controller"
  },
  {
    "id": 4,
    "section": "A",
    "type": "typed",
    "prompt": "What does GPS stand for?",
    "expectedAnswer": "Global Positioning System"
  },
  {
    "id": 5,
    "section": "A",
    "type": "typed",
    "prompt": "What does LiPo stand for?",
    "expectedAnswer": "Lithium Polymer"
  },
  {
    "id": 6,
    "section": "A",
    "type": "typed",
    "prompt": "What does FPV stand for?",
    "expectedAnswer": "First-Person View"
  },
  {
    "id": 7,
    "section": "A",
    "type": "typed",
    "prompt": "What does RGB stand for in digital imaging?",
    "expectedAnswer": "Red, Green and Blue"
  },
  {
    "id": 8,
    "section": "A",
    "type": "typed",
    "prompt": "What is the equipment carried by a drone for a particular mission called?",
    "expectedAnswer": "Payload"
  },
  {
    "id": 9,
    "section": "A",
    "type": "typed",
    "prompt": "What is the structure that holds the drone's components called?",
    "expectedAnswer": "Frame"
  },
  {
    "id": 10,
    "section": "A",
    "type": "typed",
    "prompt": "What component processes flight commands and onboard sensor data?",
    "expectedAnswer": "Flight Controller"
  },
  {
    "id": 11,
    "section": "A",
    "type": "typed",
    "prompt": "What component regulates motor speed in an electric drone?",
    "expectedAnswer": "ESC"
  },
  {
    "id": 12,
    "section": "A",
    "type": "typed",
    "prompt": "What component receives control signals from a remote controller?",
    "expectedAnswer": "Receiver"
  },
  {
    "id": 13,
    "section": "A",
    "type": "typed",
    "prompt": "What device transmits pilot commands to the drone?",
    "expectedAnswer": "Transmitter"
  },
  {
    "id": 14,
    "section": "A",
    "type": "typed",
    "prompt": "What component stabilizes a camera during aerial filming?",
    "expectedAnswer": "Gimbal"
  },
  {
    "id": 15,
    "section": "A",
    "type": "typed",
    "prompt": "What is the operating data sent from a drone to the pilot called?",
    "expectedAnswer": "Telemetry"
  },
  {
    "id": 16,
    "section": "A",
    "type": "typed",
    "prompt": "What is a programmed geographic point in a mission route called?",
    "expectedAnswer": "Waypoint"
  },
  {
    "id": 17,
    "section": "A",
    "type": "typed",
    "prompt": "What is a virtual geographic operational boundary called?",
    "expectedAnswer": "Geofence"
  },
  {
    "id": 18,
    "section": "A",
    "type": "typed",
    "prompt": "What is the saved reference position used for automatic return called?",
    "expectedAnswer": "Home Point"
  },
  {
    "id": 19,
    "section": "A",
    "type": "typed",
    "prompt": "What return feature guides a drone back toward its saved location?",
    "expectedAnswer": "Return-to-Home"
  },
  {
    "id": 20,
    "section": "A",
    "type": "typed",
    "prompt": "What term refers to the time a drone can remain airborne?",
    "expectedAnswer": "Endurance"
  },
  {
    "id": 21,
    "section": "A",
    "type": "typed",
    "prompt": "What term refers to the practical operating distance of a drone?",
    "expectedAnswer": "Range"
  },
  {
    "id": 22,
    "section": "A",
    "type": "typed",
    "prompt": "What term refers to vertical height above a chosen reference level?",
    "expectedAnswer": "Altitude"
  },
  {
    "id": 23,
    "section": "A",
    "type": "typed",
    "prompt": "What process aligns or adjusts drone sensors for reliable operation?",
    "expectedAnswer": "Calibration"
  },
  {
    "id": 24,
    "section": "A",
    "type": "typed",
    "prompt": "What is the process of enabling a drone's motors for operation?",
    "expectedAnswer": "Arming"
  },
  {
    "id": 25,
    "section": "A",
    "type": "typed",
    "prompt": "What is the process of disabling the drone's motors?",
    "expectedAnswer": "Disarming"
  },
  {
    "id": 26,
    "section": "A",
    "type": "typed",
    "prompt": "What is the automated protective response to a technical issue called?",
    "expectedAnswer": "Failsafe"
  },
  {
    "id": 27,
    "section": "A",
    "type": "typed",
    "prompt": "What method creates maps or measurements from overlapping aerial images?",
    "expectedAnswer": "Photogrammetry"
  },
  {
    "id": 28,
    "section": "A",
    "type": "typed",
    "prompt": "What type of camera records temperature-related imagery?",
    "expectedAnswer": "Thermal"
  },
  {
    "id": 29,
    "section": "A",
    "type": "typed",
    "prompt": "What is a geometrically corrected aerial map image called?",
    "expectedAnswer": "Orthomosaic"
  },
  {
    "id": 30,
    "section": "A",
    "type": "typed",
    "prompt": "What communication connection carries control and telemetry information?",
    "expectedAnswer": "Datalink"
  }
];

export const SECTION_B_QUESTIONS: McqBankQuestion[] = [
  {
    "id": 31,
    "section": "B",
    "type": "mcq",
    "prompt": "Which statement best describes a UAV?",
    "options": [
      {
        "id": "A",
        "text": "A remotely operated or autonomous aircraft without a pilot onboard"
      },
      {
        "id": "B",
        "text": "A fixed ground camera used for site monitoring"
      },
      {
        "id": "C",
        "text": "A conventional passenger aircraft with automated navigation"
      },
      {
        "id": "D",
        "text": "A satellite communication receiver"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 32,
    "section": "B",
    "type": "mcq",
    "prompt": "A drone that follows a planned route using programmed instructions is best described as:",
    "options": [
      {
        "id": "A",
        "text": "Manually tethered"
      },
      {
        "id": "B",
        "text": "Autonomous"
      },
      {
        "id": "C",
        "text": "Mechanically grounded"
      },
      {
        "id": "D",
        "text": "Payload-free"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 33,
    "section": "B",
    "type": "mcq",
    "prompt": "Which characteristic generally makes a fixed-wing drone suitable for long-area survey work?",
    "options": [
      {
        "id": "A",
        "text": "It can remain stationary in the air for long periods"
      },
      {
        "id": "B",
        "text": "It relies on wings to generate lift during forward flight"
      },
      {
        "id": "C",
        "text": "It does not require electrical energy"
      },
      {
        "id": "D",
        "text": "It can operate without navigation information"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 34,
    "section": "B",
    "type": "mcq",
    "prompt": "A project requires aerial coverage of a large agricultural field in a single mission. Which platform is generally more suitable?",
    "options": [
      {
        "id": "A",
        "text": "Fixed-wing UAV"
      },
      {
        "id": "B",
        "text": "Indoor microdrone"
      },
      {
        "id": "C",
        "text": "Camera gimbal"
      },
      {
        "id": "D",
        "text": "Tethered inspection drone"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 35,
    "section": "B",
    "type": "mcq",
    "prompt": "A project requires close inspection of a building facade from different heights. Which drone capability is especially useful?",
    "options": [
      {
        "id": "A",
        "text": "Long runway take-off"
      },
      {
        "id": "B",
        "text": "High forward cruising speed"
      },
      {
        "id": "C",
        "text": "Stable hovering"
      },
      {
        "id": "D",
        "text": "Solar-powered charging"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 36,
    "section": "B",
    "type": "mcq",
    "prompt": "A VTOL drone is designed to:",
    "options": [
      {
        "id": "A",
        "text": "Carry only a thermal camera"
      },
      {
        "id": "B",
        "text": "Take off vertically and transition to forward flight"
      },
      {
        "id": "C",
        "text": "Operate only through a cable"
      },
      {
        "id": "D",
        "text": "Fly only inside buildings"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 37,
    "section": "B",
    "type": "mcq",
    "prompt": "When selecting a drone for an assignment, the most important consideration is:",
    "options": [
      {
        "id": "A",
        "text": "Frame colour"
      },
      {
        "id": "B",
        "text": "Mission requirements"
      },
      {
        "id": "C",
        "text": "Brand popularity"
      },
      {
        "id": "D",
        "text": "Controller screen size"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 38,
    "section": "B",
    "type": "mcq",
    "prompt": "Which change would most likely decrease the total available flight time?",
    "options": [
      {
        "id": "A",
        "text": "Reducing unnecessary payload weight"
      },
      {
        "id": "B",
        "text": "Using an efficient mission route"
      },
      {
        "id": "C",
        "text": "Adding a heavier payload"
      },
      {
        "id": "D",
        "text": "Charging the battery correctly"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 39,
    "section": "B",
    "type": "mcq",
    "prompt": "Which is the clearest example of a drone mission objective?",
    "options": [
      {
        "id": "A",
        "text": "Capture aerial imagery to create a site map"
      },
      {
        "id": "B",
        "text": "Use a larger remote controller"
      },
      {
        "id": "C",
        "text": "Increase the number of LEDs"
      },
      {
        "id": "D",
        "text": "Change the drone frame colour"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 40,
    "section": "B",
    "type": "mcq",
    "prompt": "Why should a drone mission objective be decided before choosing equipment?",
    "options": [
      {
        "id": "A",
        "text": "It determines appropriate platform, payload and planning needs"
      },
      {
        "id": "B",
        "text": "It removes the need for battery management"
      },
      {
        "id": "C",
        "text": "It ensures unlimited communication range"
      },
      {
        "id": "D",
        "text": "It eliminates the need for safety procedures"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 41,
    "section": "B",
    "type": "mcq",
    "prompt": "Which component interprets flight-related information and coordinates commands to the drone's electronic systems?",
    "options": [
      {
        "id": "A",
        "text": "GPS module"
      },
      {
        "id": "B",
        "text": "Flight controller"
      },
      {
        "id": "C",
        "text": "Camera gimbal"
      },
      {
        "id": "D",
        "text": "Battery connector"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 42,
    "section": "B",
    "type": "mcq",
    "prompt": "The primary purpose of an ESC in an electric drone is to:",
    "options": [
      {
        "id": "A",
        "text": "Receive satellite location data"
      },
      {
        "id": "B",
        "text": "Stabilize camera footage"
      },
      {
        "id": "C",
        "text": "Regulate motor speed according to control commands"
      },
      {
        "id": "D",
        "text": "Store energy for the flight"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 43,
    "section": "B",
    "type": "mcq",
    "prompt": "A drone suddenly shuts down shortly after take-off, despite correct control input. Which system should be checked first for available power?",
    "options": [
      {
        "id": "A",
        "text": "Battery and power connection"
      },
      {
        "id": "B",
        "text": "Camera gimbal angle"
      },
      {
        "id": "C",
        "text": "Mapping software"
      },
      {
        "id": "D",
        "text": "Landing gear position"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 44,
    "section": "B",
    "type": "mcq",
    "prompt": "Why is a drone frame designed to be strong but lightweight?",
    "options": [
      {
        "id": "A",
        "text": "To improve display brightness"
      },
      {
        "id": "B",
        "text": "To support components while reducing unnecessary mass"
      },
      {
        "id": "C",
        "text": "To increase battery voltage"
      },
      {
        "id": "D",
        "text": "To eliminate the need for electronics"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 45,
    "section": "B",
    "type": "mcq",
    "prompt": "Which item is most likely considered a mission payload?",
    "options": [
      {
        "id": "A",
        "text": "Flight controller"
      },
      {
        "id": "B",
        "text": "Battery"
      },
      {
        "id": "C",
        "text": "Thermal camera"
      },
      {
        "id": "D",
        "text": "Receiver"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 46,
    "section": "B",
    "type": "mcq",
    "prompt": "A gimbal is especially important when a drone is being used to:",
    "options": [
      {
        "id": "A",
        "text": "Record smooth aerial video"
      },
      {
        "id": "B",
        "text": "Improve remote-control signal range"
      },
      {
        "id": "C",
        "text": "Recharge its battery"
      },
      {
        "id": "D",
        "text": "Increase motor speed"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 47,
    "section": "B",
    "type": "mcq",
    "prompt": "Which component receives the commands transmitted by the pilot's remote controller?",
    "options": [
      {
        "id": "A",
        "text": "ESC"
      },
      {
        "id": "B",
        "text": "Receiver"
      },
      {
        "id": "C",
        "text": "Flight controller"
      },
      {
        "id": "D",
        "text": "Battery"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 48,
    "section": "B",
    "type": "mcq",
    "prompt": "Which statement best explains the role of a transmitter?",
    "options": [
      {
        "id": "A",
        "text": "It sends pilot control signals to the drone"
      },
      {
        "id": "B",
        "text": "It receives GPS signals from satellites"
      },
      {
        "id": "C",
        "text": "It stores flight battery energy"
      },
      {
        "id": "D",
        "text": "It stabilizes an imaging payload"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 49,
    "section": "B",
    "type": "mcq",
    "prompt": "Brushless motors are commonly used in drones mainly because they:",
    "options": [
      {
        "id": "A",
        "text": "Work without a power source"
      },
      {
        "id": "B",
        "text": "Are efficient and suitable for high-speed operation"
      },
      {
        "id": "C",
        "text": "Automatically create maps"
      },
      {
        "id": "D",
        "text": "Replace the flight controller"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 50,
    "section": "B",
    "type": "mcq",
    "prompt": "Which electrical term refers to the potential difference that drives current through a circuit?",
    "options": [
      {
        "id": "A",
        "text": "Capacity"
      },
      {
        "id": "B",
        "text": "Voltage"
      },
      {
        "id": "C",
        "text": "Frequency"
      },
      {
        "id": "D",
        "text": "Resistance"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 51,
    "section": "B",
    "type": "mcq",
    "prompt": "A drone battery marked 2200 mAh is indicating its:",
    "options": [
      {
        "id": "A",
        "text": "Operating altitude"
      },
      {
        "id": "B",
        "text": "Image resolution"
      },
      {
        "id": "C",
        "text": "Charge-storage capacity"
      },
      {
        "id": "D",
        "text": "Radio frequency"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 52,
    "section": "B",
    "type": "mcq",
    "prompt": "Which battery practice is most appropriate after a demanding flight when the battery is warm?",
    "options": [
      {
        "id": "A",
        "text": "Charge immediately at the highest available current"
      },
      {
        "id": "B",
        "text": "Let it cool before charging with a suitable charger"
      },
      {
        "id": "C",
        "text": "Connect it to the drone again for balancing"
      },
      {
        "id": "D",
        "text": "Store it fully discharged"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 53,
    "section": "B",
    "type": "mcq",
    "prompt": "A heavy camera is added to a drone without changing anything else. What is the most likely effect?",
    "options": [
      {
        "id": "A",
        "text": "Longer endurance"
      },
      {
        "id": "B",
        "text": "Lower energy consumption"
      },
      {
        "id": "C",
        "text": "Reduced flight endurance"
      },
      {
        "id": "D",
        "text": "Improved GPS accuracy"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 54,
    "section": "B",
    "type": "mcq",
    "prompt": "Why is it important to connect a battery with correct polarity?",
    "options": [
      {
        "id": "A",
        "text": "It provides better camera focus"
      },
      {
        "id": "B",
        "text": "It prevents possible damage to electronic circuits"
      },
      {
        "id": "C",
        "text": "It increases the number of available satellites"
      },
      {
        "id": "D",
        "text": "It prevents image blur"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 55,
    "section": "B",
    "type": "mcq",
    "prompt": "Deeply discharging a rechargeable drone battery repeatedly may:",
    "options": [
      {
        "id": "A",
        "text": "Improve its capacity permanently"
      },
      {
        "id": "B",
        "text": "Reduce its usable life and performance"
      },
      {
        "id": "C",
        "text": "Increase transmitter range"
      },
      {
        "id": "D",
        "text": "Improve camera stabilization"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 56,
    "section": "B",
    "type": "mcq",
    "prompt": "Which unit is most commonly used to describe a battery's voltage?",
    "options": [
      {
        "id": "A",
        "text": "Ampere-hour"
      },
      {
        "id": "B",
        "text": "Watt"
      },
      {
        "id": "C",
        "text": "Volt"
      },
      {
        "id": "D",
        "text": "Hertz"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 57,
    "section": "B",
    "type": "mcq",
    "prompt": "Which factor is most likely to increase a drone's energy use during a mission?",
    "options": [
      {
        "id": "A",
        "text": "Carrying an unnecessary heavy payload"
      },
      {
        "id": "B",
        "text": "Using a properly connected battery"
      },
      {
        "id": "C",
        "text": "Selecting an efficient flight route"
      },
      {
        "id": "D",
        "text": "Using a lightweight camera"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 58,
    "section": "B",
    "type": "mcq",
    "prompt": "What is the most suitable device for charging a LiPo drone battery?",
    "options": [
      {
        "id": "A",
        "text": "GPS module"
      },
      {
        "id": "B",
        "text": "Compatible balance charger"
      },
      {
        "id": "C",
        "text": "Radio receiver"
      },
      {
        "id": "D",
        "text": "Camera gimbal"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 59,
    "section": "B",
    "type": "mcq",
    "prompt": "A battery's voltage primarily represents:",
    "options": [
      {
        "id": "A",
        "text": "The electrical potential difference it can provide"
      },
      {
        "id": "B",
        "text": "The total number of photographs it can store"
      },
      {
        "id": "C",
        "text": "The maximum height of the drone"
      },
      {
        "id": "D",
        "text": "The length of a mission route"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 60,
    "section": "B",
    "type": "mcq",
    "prompt": "Which situation is most likely to shorten a drone's available flight duration?",
    "options": [
      {
        "id": "A",
        "text": "Adequate battery charge"
      },
      {
        "id": "B",
        "text": "Correct power connections"
      },
      {
        "id": "C",
        "text": "Low remaining battery charge"
      },
      {
        "id": "D",
        "text": "Reduced payload mass"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 61,
    "section": "B",
    "type": "mcq",
    "prompt": "A drone uses GPS mainly to obtain:",
    "options": [
      {
        "id": "A",
        "text": "Location and navigation information"
      },
      {
        "id": "B",
        "text": "Battery temperature"
      },
      {
        "id": "C",
        "text": "Camera stabilization"
      },
      {
        "id": "D",
        "text": "Motor cooling"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 62,
    "section": "B",
    "type": "mcq",
    "prompt": "Which set of information is most likely included in drone telemetry?",
    "options": [
      {
        "id": "A",
        "text": "Battery level, position and flight status"
      },
      {
        "id": "B",
        "text": "Pilot's academic record, name and address"
      },
      {
        "id": "C",
        "text": "Frame colour, logo and camera brand"
      },
      {
        "id": "D",
        "text": "College timetable and attendance"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 63,
    "section": "B",
    "type": "mcq",
    "prompt": "A command-and-control data link is used primarily to:",
    "options": [
      {
        "id": "A",
        "text": "Mount the payload to the drone"
      },
      {
        "id": "B",
        "text": "Exchange control commands and operational data"
      },
      {
        "id": "C",
        "text": "Improve battery capacity"
      },
      {
        "id": "D",
        "text": "Reduce image size"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 64,
    "section": "B",
    "type": "mcq",
    "prompt": "In a programmed drone mission, a waypoint is:",
    "options": [
      {
        "id": "A",
        "text": "A point used to define the planned route"
      },
      {
        "id": "B",
        "text": "A setting that controls camera brightness"
      },
      {
        "id": "C",
        "text": "A device that charges a LiPo battery"
      },
      {
        "id": "D",
        "text": "A protective case for a receiver"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 65,
    "section": "B",
    "type": "mcq",
    "prompt": "A geofence is most accurately described as:",
    "options": [
      {
        "id": "A",
        "text": "A physical wall around a launch area"
      },
      {
        "id": "B",
        "text": "A virtual boundary that defines an operating area"
      },
      {
        "id": "C",
        "text": "A lightweight drone frame material"
      },
      {
        "id": "D",
        "text": "A tool used to measure battery voltage"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 66,
    "section": "B",
    "type": "mcq",
    "prompt": "The saved home point is especially important for:",
    "options": [
      {
        "id": "A",
        "text": "Return-to-home operation"
      },
      {
        "id": "B",
        "text": "Camera stabilization"
      },
      {
        "id": "C",
        "text": "Thermal-image processing"
      },
      {
        "id": "D",
        "text": "Battery cooling"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 67,
    "section": "B",
    "type": "mcq",
    "prompt": "A Return-to-Home feature is designed to:",
    "options": [
      {
        "id": "A",
        "text": "Begin a mapping process"
      },
      {
        "id": "B",
        "text": "Direct the drone toward a saved reference location"
      },
      {
        "id": "C",
        "text": "Increase video resolution"
      },
      {
        "id": "D",
        "text": "Adjust motor speed"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 68,
    "section": "B",
    "type": "mcq",
    "prompt": "FPV technology allows a pilot to:",
    "options": [
      {
        "id": "A",
        "text": "Receive a live camera view from the drone"
      },
      {
        "id": "B",
        "text": "Automatically repair the drone remotely"
      },
      {
        "id": "C",
        "text": "Increase the flight battery capacity"
      },
      {
        "id": "D",
        "text": "Create an orthomosaic without images"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 69,
    "section": "B",
    "type": "mcq",
    "prompt": "If control signals are not reaching the drone, which component is directly responsible for receiving those pilot commands onboard?",
    "options": [
      {
        "id": "A",
        "text": "Battery"
      },
      {
        "id": "B",
        "text": "Receiver"
      },
      {
        "id": "C",
        "text": "Gimbal"
      },
      {
        "id": "D",
        "text": "Frame"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 70,
    "section": "B",
    "type": "mcq",
    "prompt": "What is a likely response when a drone loses its control communication link?",
    "options": [
      {
        "id": "A",
        "text": "It may activate a programmed failsafe procedure"
      },
      {
        "id": "B",
        "text": "Its battery becomes fully charged"
      },
      {
        "id": "C",
        "text": "Its camera automatically switches to thermal mode"
      },
      {
        "id": "D",
        "text": "Its payload becomes lighter"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 71,
    "section": "B",
    "type": "mcq",
    "prompt": "In drone operation, arming means:",
    "options": [
      {
        "id": "A",
        "text": "Enabling the motors to operate"
      },
      {
        "id": "B",
        "text": "Setting the home point"
      },
      {
        "id": "C",
        "text": "Starting a recording session"
      },
      {
        "id": "D",
        "text": "Attaching the payload"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 72,
    "section": "B",
    "type": "mcq",
    "prompt": "In drone operation, disarming means:",
    "options": [
      {
        "id": "A",
        "text": "Increasing altitude before landing"
      },
      {
        "id": "B",
        "text": "Activating return-to-home"
      },
      {
        "id": "C",
        "text": "Disabling motor operation"
      },
      {
        "id": "D",
        "text": "Connecting the battery"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 73,
    "section": "B",
    "type": "mcq",
    "prompt": "A failsafe is best described as:",
    "options": [
      {
        "id": "A",
        "text": "A camera setting for low light"
      },
      {
        "id": "B",
        "text": "An automated protective action during certain system problems"
      },
      {
        "id": "C",
        "text": "A method of attaching a payload"
      },
      {
        "id": "D",
        "text": "A technique for improving battery capacity"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 74,
    "section": "B",
    "type": "mcq",
    "prompt": "Why should operators identify obstacles in the operating area?",
    "options": [
      {
        "id": "A",
        "text": "To improve camera resolution"
      },
      {
        "id": "B",
        "text": "To reduce the likelihood of collisions"
      },
      {
        "id": "C",
        "text": "To increase battery capacity"
      },
      {
        "id": "D",
        "text": "To create more waypoints"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 75,
    "section": "B",
    "type": "mcq",
    "prompt": "Why can strong wind affect a drone mission?",
    "options": [
      {
        "id": "A",
        "text": "It can reduce stability and increase power consumption"
      },
      {
        "id": "B",
        "text": "It automatically increases GPS accuracy"
      },
      {
        "id": "C",
        "text": "It improves battery charging"
      },
      {
        "id": "D",
        "text": "It eliminates the need for control signals"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 76,
    "section": "B",
    "type": "mcq",
    "prompt": "Which situation is likely to require greater operational caution?",
    "options": [
      {
        "id": "A",
        "text": "A calm day with clear visibility"
      },
      {
        "id": "B",
        "text": "A secure and balanced payload"
      },
      {
        "id": "C",
        "text": "Strong and changing wind conditions"
      },
      {
        "id": "D",
        "text": "A fully charged battery"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 77,
    "section": "B",
    "type": "mcq",
    "prompt": "What is the most responsible practice when people are close to the operating area?",
    "options": [
      {
        "id": "A",
        "text": "Maintain a safe distance and comply with applicable rules"
      },
      {
        "id": "B",
        "text": "Fly directly overhead for a better camera angle"
      },
      {
        "id": "C",
        "text": "Test high-speed movements near them"
      },
      {
        "id": "D",
        "text": "Allow them to touch the drone while it is operating"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 78,
    "section": "B",
    "type": "mcq",
    "prompt": "A restricted or no-fly zone is an area where drone operations are:",
    "options": [
      {
        "id": "A",
        "text": "Always recommended"
      },
      {
        "id": "B",
        "text": "Limited or prohibited under applicable requirements"
      },
      {
        "id": "C",
        "text": "Permitted only for aerial photography"
      },
      {
        "id": "D",
        "text": "Allowed without any planning"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 79,
    "section": "B",
    "type": "mcq",
    "prompt": "Why should an operator consider airspace and local operating requirements?",
    "options": [
      {
        "id": "A",
        "text": "To support safe and lawful operation"
      },
      {
        "id": "B",
        "text": "To make the drone's battery lighter"
      },
      {
        "id": "C",
        "text": "To avoid using a camera"
      },
      {
        "id": "D",
        "text": "To increase the number of onboard motors"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 80,
    "section": "B",
    "type": "mcq",
    "prompt": "If an unexpected technical or environmental issue occurs during a flight, the best general priority is to:",
    "options": [
      {
        "id": "A",
        "text": "Complete the mission as quickly as possible"
      },
      {
        "id": "B",
        "text": "Increase altitude immediately without assessing the situation"
      },
      {
        "id": "C",
        "text": "Take a controlled action that prioritizes safety"
      },
      {
        "id": "D",
        "text": "Continue the mission if the video feed remains active"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 81,
    "section": "B",
    "type": "mcq",
    "prompt": "Photogrammetry is the process of:",
    "options": [
      {
        "id": "A",
        "text": "Stabilizing video while flying"
      },
      {
        "id": "B",
        "text": "Obtaining measurements or map information from photographs"
      },
      {
        "id": "C",
        "text": "Transmitting telemetry to the pilot"
      },
      {
        "id": "D",
        "text": "Increasing battery capacity"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 82,
    "section": "B",
    "type": "mcq",
    "prompt": "A farmer wants to monitor crop health over a large field. Which application is most relevant?",
    "options": [
      {
        "id": "A",
        "text": "Precision agriculture"
      },
      {
        "id": "B",
        "text": "Infrastructure inspection"
      },
      {
        "id": "C",
        "text": "Indoor FPV practice"
      },
      {
        "id": "D",
        "text": "Parcel delivery"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 83,
    "section": "B",
    "type": "mcq",
    "prompt": "Which drone task is most relevant for examining a bridge, tower or pipeline without sending a person close to it?",
    "options": [
      {
        "id": "A",
        "text": "Aerial inspection"
      },
      {
        "id": "B",
        "text": "Medical delivery"
      },
      {
        "id": "C",
        "text": "Indoor photography"
      },
      {
        "id": "D",
        "text": "Battery balancing"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 84,
    "section": "B",
    "type": "mcq",
    "prompt": "Which payload is best suited to identify unusual heat patterns in electrical equipment?",
    "options": [
      {
        "id": "A",
        "text": "GPS antenna"
      },
      {
        "id": "B",
        "text": "Thermal camera"
      },
      {
        "id": "C",
        "text": "Flight battery"
      },
      {
        "id": "D",
        "text": "Radio transmitter"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 85,
    "section": "B",
    "type": "mcq",
    "prompt": "During a rescue mission, drone imagery is most valuable because it can:",
    "options": [
      {
        "id": "A",
        "text": "Quickly assess areas that may be difficult to reach on foot"
      },
      {
        "id": "B",
        "text": "Recharge emergency equipment"
      },
      {
        "id": "C",
        "text": "Replace all ground rescue teams"
      },
      {
        "id": "D",
        "text": "Prevent all weather-related issues"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 86,
    "section": "B",
    "type": "mcq",
    "prompt": "Which industry could use drones to calculate stockpile volumes and monitor excavation activity?",
    "options": [
      {
        "id": "A",
        "text": "Mining"
      },
      {
        "id": "B",
        "text": "Hospitality"
      },
      {
        "id": "C",
        "text": "Fashion retail"
      },
      {
        "id": "D",
        "text": "Banking"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 87,
    "section": "B",
    "type": "mcq",
    "prompt": "Transporting emergency medical supplies by drone is an example of:",
    "options": [
      {
        "id": "A",
        "text": "Aerial photogrammetry"
      },
      {
        "id": "B",
        "text": "Payload delivery"
      },
      {
        "id": "C",
        "text": "Thermal inspection"
      },
      {
        "id": "D",
        "text": "Structural mapping"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 88,
    "section": "B",
    "type": "mcq",
    "prompt": "In disaster management, drones can be used first to:",
    "options": [
      {
        "id": "A",
        "text": "Rapidly collect aerial information about affected locations"
      },
      {
        "id": "B",
        "text": "Repair damaged roads"
      },
      {
        "id": "C",
        "text": "Replace emergency communication networks permanently"
      },
      {
        "id": "D",
        "text": "Charge vehicles in the field"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 89,
    "section": "B",
    "type": "mcq",
    "prompt": "A construction company needs an updated accurate top-view image of its project site. Which output is most useful?",
    "options": [
      {
        "id": "A",
        "text": "Orthomosaic"
      },
      {
        "id": "B",
        "text": "Telemetry log"
      },
      {
        "id": "C",
        "text": "Battery health report"
      },
      {
        "id": "D",
        "text": "Video-transmission record"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 90,
    "section": "B",
    "type": "mcq",
    "prompt": "Which drone application is focused on understanding land, terrain and site features from aerial data?",
    "options": [
      {
        "id": "A",
        "text": "Aerial surveying"
      },
      {
        "id": "B",
        "text": "Drone racing"
      },
      {
        "id": "C",
        "text": "Battery maintenance"
      },
      {
        "id": "D",
        "text": "Video streaming"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 91,
    "section": "B",
    "type": "mcq",
    "prompt": "In drone imaging, FPV is mainly used for:",
    "options": [
      {
        "id": "A",
        "text": "Seeing a live view from the onboard camera"
      },
      {
        "id": "B",
        "text": "Estimating battery capacity"
      },
      {
        "id": "C",
        "text": "Calculating flight endurance"
      },
      {
        "id": "D",
        "text": "Measuring motor efficiency"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 92,
    "section": "B",
    "type": "mcq",
    "prompt": "RGB is a colour model based on:",
    "options": [
      {
        "id": "A",
        "text": "Radio, Ground and Battery"
      },
      {
        "id": "B",
        "text": "Red, Green and Blue"
      },
      {
        "id": "C",
        "text": "Range, Guidance and Balance"
      },
      {
        "id": "D",
        "text": "Rotation, GPS and Battery"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 93,
    "section": "B",
    "type": "mcq",
    "prompt": "A higher camera resolution generally provides:",
    "options": [
      {
        "id": "A",
        "text": "More image detail"
      },
      {
        "id": "B",
        "text": "More battery energy"
      },
      {
        "id": "C",
        "text": "Greater radio range"
      },
      {
        "id": "D",
        "text": "Faster charging"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 94,
    "section": "B",
    "type": "mcq",
    "prompt": "An orthomosaic is created by:",
    "options": [
      {
        "id": "A",
        "text": "Combining and geometrically correcting multiple aerial images"
      },
      {
        "id": "B",
        "text": "Connecting multiple battery cells"
      },
      {
        "id": "C",
        "text": "Increasing the drone's control range"
      },
      {
        "id": "D",
        "text": "Attaching a camera to a gimbal"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 95,
    "section": "B",
    "type": "mcq",
    "prompt": "During a drone mission, altitude refers to:",
    "options": [
      {
        "id": "A",
        "text": "The aircraft's vertical height relative to a reference level"
      },
      {
        "id": "B",
        "text": "The distance between the drone and the pilot"
      },
      {
        "id": "C",
        "text": "The percentage of battery remaining"
      },
      {
        "id": "D",
        "text": "The camera viewing angle"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 96,
    "section": "B",
    "type": "mcq",
    "prompt": "Which type of information is most useful for planning a mapping mission over an uneven site?",
    "options": [
      {
        "id": "A",
        "text": "Camera colour preference"
      },
      {
        "id": "B",
        "text": "Terrain and area boundaries"
      },
      {
        "id": "C",
        "text": "Pilot's phone storage"
      },
      {
        "id": "D",
        "text": "Frame sticker design"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 97,
    "section": "B",
    "type": "mcq",
    "prompt": "Why are overlapping aerial photographs important in photogrammetry?",
    "options": [
      {
        "id": "A",
        "text": "They help software identify common points to create maps or models"
      },
      {
        "id": "B",
        "text": "They reduce the need for location data"
      },
      {
        "id": "C",
        "text": "They make the drone battery last longer"
      },
      {
        "id": "D",
        "text": "They replace the imaging sensor"
      }
    ],
    "correctOptionId": "A"
  },
  {
    "id": 98,
    "section": "B",
    "type": "mcq",
    "prompt": "Which factor is most important when choosing a camera payload for a mapping task?",
    "options": [
      {
        "id": "A",
        "text": "The colour of the camera body"
      },
      {
        "id": "B",
        "text": "The number of landing legs on the drone"
      },
      {
        "id": "C",
        "text": "Required image detail and mission purpose"
      },
      {
        "id": "D",
        "text": "The size of the remote controller"
      }
    ],
    "correctOptionId": "C"
  },
  {
    "id": 99,
    "section": "B",
    "type": "mcq",
    "prompt": "What is the main benefit of using drone imagery for site progress monitoring?",
    "options": [
      {
        "id": "A",
        "text": "It removes the need to plan the mission"
      },
      {
        "id": "B",
        "text": "It provides a repeatable aerial view for comparison over time"
      },
      {
        "id": "C",
        "text": "It guarantees operations in all weather"
      },
      {
        "id": "D",
        "text": "It charges the drone battery during flight"
      }
    ],
    "correctOptionId": "B"
  },
  {
    "id": 100,
    "section": "B",
    "type": "mcq",
    "prompt": "Which task best demonstrates the use of drone data in GIS work?",
    "options": [
      {
        "id": "A",
        "text": "Creating a location-based map layer from aerial survey data"
      },
      {
        "id": "B",
        "text": "Increasing motor speed through software"
      },
      {
        "id": "C",
        "text": "Connecting a battery to an ESC"
      },
      {
        "id": "D",
        "text": "Stabilizing a camera with a gimbal"
      }
    ],
    "correctOptionId": "A"
  }
];

export const ALL_QUESTIONS: BankQuestion[] = [
  ...SECTION_A_QUESTIONS,
  ...SECTION_B_QUESTIONS,
];

export function getQuestionById(id: number): BankQuestion | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}
