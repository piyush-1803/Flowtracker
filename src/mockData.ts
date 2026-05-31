import { Category, ActivityLog, GeneralPreferences } from "./types";

// Standard clean start preferences and categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "coding", name: "Coding", color: "#4e654a", type: "Work" },
  { id: "research", name: "Research", color: "#705d41", type: "Work" },
  { id: "study", name: "Study", color: "#aa804c", type: "Learning" },
  { id: "ai", name: "AI Tools", color: "#516b75", type: "Learning" },
  { id: "other", name: "Other", color: "#7d7a75", type: "Misc" }
];

export const INITIAL_PREFERENCES: GeneralPreferences = {
  startOnBoot: true,
  dailyCategorizationTime: "23:00",
  apiKey: "sk-ant-api03-P3m9aJ2kL8nB7v5c4xR1qW0zY"
};

// INITIAL_TODAY_LOGS starts completely blank for fresh installation feeling and clean initialization
export const INITIAL_TODAY_LOGS: ActivityLog[] = [];

// Seed logs for past week (Mon - Sun) to build the Time Distribution Over Time chart
export interface DayLogAggregate {
  day: string;
  categories: { [categoryId: string]: number };
}

export const EMPTY_TRENDS: DayLogAggregate[] = [
  { day: "Mon", categories: {} },
  { day: "Tue", categories: {} },
  { day: "Wed", categories: {} },
  { day: "Thu", categories: {} },
  { day: "Fri", categories: {} },
  { day: "Sat", categories: {} },
  { day: "Sun", categories: {} }
];

// SEEDED_7_DAYS_TRENDS starts completely empty
export const SEEDED_7_DAYS_TRENDS: DayLogAggregate[] = EMPTY_TRENDS;

// Explicit Demo Sandbox objects (only triggered when user intentionally clicks "Load Seeded Archives" or "Load Sandbox Demo Dataset")
export const DEMO_TODAY_LOGS: ActivityLog[] = [
  {
    id: "log_today_1",
    application: "VS Code",
    title: "backend/api.js",
    startTime: "10:45 AM",
    endTime: "01:06 PM",
    startNum: 645,
    endNum: 786,
    durationMinutes: 141, // 2h 21m
    categoryId: "coding"
  },
  {
    id: "log_today_2",
    application: "Chrome",
    title: "StackOverflow / Docs",
    startTime: "10:15 AM",
    endTime: "11:56 AM",
    startNum: 615,
    endNum: 716,
    durationMinutes: 101, // 1h 41m
    categoryId: "research"
  },
  {
    id: "log_today_3",
    application: "ChatGPT",
    title: "Architecture Planning",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    startNum: 540,
    endNum: 600,
    durationMinutes: 60, // 1h 00m
    categoryId: "ai"
  },
  {
    id: "log_today_4",
    application: "LeapMind",
    title: "Linear Algebra & Neural Notes",
    startTime: "01:30 PM",
    endTime: "02:51 PM",
    startNum: 810,
    endNum: 891,
    durationMinutes: 81, // 1h 21m
    categoryId: "study"
  },
  {
    id: "log_today_5",
    application: "Spotify",
    title: "Lo-Fi Focus Playlist Generator",
    startTime: "04:00 PM",
    endTime: "04:20 PM",
    startNum: 960,
    endNum: 980,
    durationMinutes: 20, // 0h 20m
    categoryId: "other"
  },
  {
    id: "log_today_6",
    application: "Chrome",
    title: "Unlabelled Browser tab",
    startTime: "08:15 AM",
    endTime: "09:00 AM",
    startNum: 495,
    endNum: 540,
    durationMinutes: 45, // 45m unassigned
    categoryId: "" // Empty represents Uncategorized review target
  }
];

export const DEMO_SEEDED_7_DAYS_TRENDS: DayLogAggregate[] = [
  {
    day: "Mon",
    categories: {
      coding: 220,
      study: 100,
      research: 60,
      ai: 40,
      other: 15
    }
  },
  {
    day: "Tue",
    categories: {
      coding: 240,
      study: 120,
      research: 80,
      ai: 50,
      other: 20
    }
  },
  {
    day: "Wed",
    categories: {
      coding: 310,
      study: 30,
      research: 10,
      ai: 20,
      other: 5
    }
  },
  {
    day: "Thu",
    categories: {
      coding: 180,
      study: 90,
      research: 10,
      ai: 15,
      other: 25
    }
  },
  {
    day: "Fri",
    categories: {
      coding: 280,
      study: 110,
      research: 105,
      ai: 70,
      other: 30
    }
  },
  {
    day: "Sat",
    categories: {
      coding: 60,
      study: 140,
      research: 20,
      ai: 10,
      other: 5
    }
  },
  {
    day: "Sun",
    categories: {
      coding: 0,
      study: 40,
      research: 40,
      ai: 20,
      other: 10
    }
  }
];


