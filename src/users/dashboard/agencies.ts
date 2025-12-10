import policeImg from "../../assets/avatars/police.png";
import dssImg from "../../assets/avatars/dss.png";
import civilDefenceImg from "../../assets/avatars/civil-defence.png";
import vigilanteImg from "../../assets/avatars/vigilante.png";
import roadSafetyImg from "../../assets/avatars/road-safety.png";
import fireServiceImg from "../../assets/avatars/fire-service.png";
import immigrationImg from "../../assets/avatars/Immigration.png";
import efccImg from "../../assets/avatars/efcc.png";

import {
  FiShield,
  FiLock,
  FiAlertCircle,
  FiEye,
  FiTruck,
  FiMessageSquare,
  FiUsers,
  FiBriefcase,
} from "react-icons/fi";

export const departments = [
  {
    name: "Police",
    slug: "police",
    image: policeImg,
    icon: FiShield,
    description: "Report crimes, threats, or suspicious activities.",
  },

  {
    name: "DSS",
    slug: "dss",
    image: dssImg,
    icon: FiLock,
    description:
      "Report intelligence-related threats or suspicious covert activity.",
  },
  {
    name: "Civil Defence",
    slug: "civildefence",
    image: civilDefenceImg,
    icon: FiAlertCircle,
    description:
      "Report threats to national assets or request protective services.",
  },
  {
    name: "Vigilante (See Watch)",
    slug: "vigilante",
    image: vigilanteImg,
    icon: FiEye,
    description:
      "Report local disturbances or request community watch support.",
  },
  {
    name: "Road Safety",
    slug: "roadsafety",
    image: roadSafetyImg,
    icon: FiTruck,
    description: "Report accidents, traffic violations, or road hazards.",
  },
  {
    name: "Fire Service",
    slug: "fireservice",
    image: fireServiceImg,
    icon: FiMessageSquare,
    description: "Report fire outbreaks or emergency rescue needs.",
  },
  {
    name: "Immigration",
    slug: "immigration",
    image: immigrationImg,
    icon: FiUsers,
    description: "Report border-related issues or suspicious movements.",
  },
  {
    name: "EFCC",
    slug: "efcc",
    image: efccImg,
    icon: FiBriefcase,
    description: "Report financial crimes, fraud, or corruption cases.",
  },
];
