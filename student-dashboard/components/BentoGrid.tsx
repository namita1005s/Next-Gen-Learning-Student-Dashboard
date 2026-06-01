'use client';

import { motion } from 'motion/react';
import { Course, ActivityLog, UserProfile } from '../types';
import HeroTile from './HeroTile';
import CourseTile from './CourseTile';
import ActivityTile from './ActivityTile';
import StudentProfileTile from './StudentProfileTile';

interface BentoGridProps {
  courses: Course[];
  userProfile?: UserProfile;
  activityLog?: ActivityLog[];
  onProfileUpdate?: (updated: UserProfile) => void;
  onActivityLogged?: (newLog: ActivityLog) => void;
}

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      mass: 0.8,
    },
  },
};

export default function BentoGrid({ 
  courses, 
  userProfile, 
  activityLog,
  onProfileUpdate,
  onActivityLogged
}: BentoGridProps) {
  // Handle empty state gracefully
  if (!courses || courses.length === 0) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 lg:p-0 max-w-7xl mx-auto">
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-zinc-900 rounded-2xl p-8 text-center">
            <p className="text-zinc-400">No courses available. Please check your database connection.</p>
          </div>
        </div>
      </section>
    );
  }

  // Get first 4 courses, handle if less exist
  const firstCourse = courses[0];
  const secondCourse = courses[1];
  const thirdCourse = courses[2];
  const fourthCourse = courses[3];
  const remainingCourses = courses.slice(4);

  return (
    <motion.section
      id="bento-grid-section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 lg:p-0 max-w-7xl mx-auto"
    >
      {/* Hidden heading for screen readers (accessibility) */}
      <div className="sr-only">
        <h2>Student Learning Dashboard</h2>
      </div>

      {/* Row 1: Left: Welcome Card (col-span-2) */}
      <motion.div
        variants={itemVariants}
        className="lg:col-span-2 col-span-1"
      >
        <HeroTile index={0} userProfile={userProfile} />
      </motion.div>

      {/* Row 1: Right: Student Profile Card (col-span-2) */}
      <motion.div
        variants={itemVariants}
        className="lg:col-span-2 col-span-1"
      >
        <StudentProfileTile userProfile={userProfile} />
      </motion.div>

      {/* Row 2: All 4 active course cards with big circles */}
      {firstCourse && (
        <motion.div variants={itemVariants} className="col-span-1">
          <CourseTile course={firstCourse} index={1} />
        </motion.div>
      )}

      {secondCourse && (
        <motion.div variants={itemVariants} className="col-span-1">
          <CourseTile course={secondCourse} index={2} />
        </motion.div>
      )}

      {thirdCourse && (
        <motion.div variants={itemVariants} className="col-span-1">
          <CourseTile course={thirdCourse} index={3} />
        </motion.div>
      )}

      {fourthCourse && (
        <motion.div variants={itemVariants} className="col-span-1">
          <CourseTile course={fourthCourse} index={4} />
        </motion.div>
      )}

      {/* Row 3: Full-width Activity contribution heatmap matrix */}
      <motion.div
        variants={itemVariants}
        className="lg:col-span-4 col-span-1"
      >
        <ActivityTile 
          index={5} 
          activityLog={activityLog} 
          userProfile={userProfile}
          onProfileUpdate={onProfileUpdate}
          onActivityLogged={onActivityLogged}
        />
      </motion.div>

      {/* Additional courses (if more than 4) - Row 4 onwards */}
      {remainingCourses.length > 0 && (
        <>
          {/* Add a subheading for additional courses */}
          <motion.div
            variants={itemVariants}
            className="col-span-full mt-4 mb-2"
          >
            <h3 className="text-lg font-semibold text-zinc-300 px-2">
              More Courses ({remainingCourses.length})
            </h3>
          </motion.div>

          {/* Render remaining courses */}
          {remainingCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
            >
              <CourseTile course={course} index={6 + idx} />
            </motion.div>
          ))}
        </>
      )}
    </motion.section>
  );
}
