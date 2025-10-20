import Overview from "@/components/overview";
import PumpAndDump from "@/components/pump-and-dump";
import WashTrade from "@/components/wash-trade";
import { ChartLineIcon, RepeatIcon, TableOfContentsIcon } from "lucide-react";

const LIST_TABS = [
  {
    label: "Overview",
    value: "overview",
    icon: TableOfContentsIcon,
    component: Overview,
  },
  {
    label: "Wash Trading",
    value: "wash-trade",
    icon: RepeatIcon,
    component: WashTrade,
  },
  {
    label: "Pump & Dump",
    value: "pump-and-dump",
    icon: ChartLineIcon,
    component: PumpAndDump,
  },
];

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

export { LIST_TABS, BASE_URL };
