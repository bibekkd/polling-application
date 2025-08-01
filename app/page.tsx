'use client';

import { useState } from 'react';
import { UserType } from '@/types';
import TeacherDashboard from '@/components/TeacherDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import RoleSelection from '@/components/RoleSelection';

export default function Home() {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userName, setUserName] = useState('');

  const handleRoleSelection = (role: UserType, name: string) => {
    setUserType(role);
    setUserName(name);
  };

  const handleBackToSelection = () => {
    setUserType(null);
    setUserName('');
  };

  if (!userType) {
    return <RoleSelection onRoleSelect={handleRoleSelection} />;
  }

  return (
    <div className="min-h-screen">
      {userType === 'teacher' ? (
        <TeacherDashboard 
          teacherName={userName} 
          onBack={handleBackToSelection} 
        />
      ) : (
        <StudentDashboard 
          studentName={userName} 
          onBack={handleBackToSelection} 
        />
      )}
    </div>
  );
}
