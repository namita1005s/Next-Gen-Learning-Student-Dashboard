export interface Course {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
  created_at: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  gender?: string;
  date_of_birth?: string | null;
  phone?: string;
  address?: string;
  admission_date?: string | null;
  class_name?: string;
  institution?: string;
  student_pass_id?: string;
  bio?: string;
  streak_days: number;
  total_xp: number;
  
  // Custom tracking / themes if saved
  avatar_url?: string;
  student_id?: string;
  grade_level?: string;
  major?: string;
  university?: string;
  rank_percent?: string;
  total_hours_learned?: number;
  courses_completed?: number;
  certificates_earned?: number;
  theme?: string;
  language?: string;
  is_active?: boolean;
  is_pro_member?: boolean;
}

export interface SidebarItem {
  id: string;
  label: string;
  iconName: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  level: string;
  xp_earned: number;
  color_from: string;
  color_to: string;
  text_color: string;
  border_color: string;
  user_email: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  activity_date: string;
  submissions_count: number;
  lessons_done: number;
  user_email: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_email: string;
  animation_speed: string;
  show_streak: boolean;
  show_xp: boolean;
  streak_reminders: boolean;
  sound_effects: boolean;
  updated_at: string;
}

