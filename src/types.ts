export interface Category {
  id: string; // e.g. "coding"
  name: string; // e.g. "Coding"
  color: string; // e.g. "#6366F1" (stored as Hex)
  type: string; // e.g. "Work" or "Learning"
}

export interface ActivityLog {
  id: string;
  application: string; // e.g. "VS Code"
  title: string; // e.g. "backend/api.js"
  startTime: string; // e.g. "10:45 AM"
  endTime: string; // e.g. "11:30 AM"
  startNum: number; // For sorting or charting (timestamp or relative minutes)
  endNum: number;
  durationMinutes: number;
  categoryId: string; // foreign key to Category.id
}

export interface GeneralPreferences {
  startOnBoot: boolean;
  dailyCategorizationTime: string; // e.g. "23:00"
  apiKey: string;
}

export interface DailySummaryStats {
  totalLoggedMinutes: number;
  topCategoryName: string;
  productivityScore: number;
  uncategorizedMinutes: number;
}
