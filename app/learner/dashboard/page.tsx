'use client';

import Logout from '@/components/Logout';
import Container from '@/components/common/Container';
import { Show, UserButton } from '@clerk/nextjs';
import { useEffect } from 'react';

const LearnerDashboard = () => {
  const learnerData = {
    goal: {
      question: 'What do you want to achieve?',
      options: [
        'Get a job',
        'Learn a new skill',
        'Build projects',
        'Prepare for exams',
        'Just explore',
      ],
      selected: 'Get a job',
    },
    skill_level: {
      question: 'What is your current level?',
      options: ['Beginner', 'Intermediate', 'Advanced'],
      selected: 'Beginner',
    },
    interest_areas: {
      question: 'What topics interest you?',
      options: [
        'Web Development',
        'AI / Machine Learning',
        'Data Structures & Algorithms',
        'System Design',
        'DevOps',
        'Mobile Development',
      ],
      selected: ['Web Development', 'Data Structures & Algorithms'],
    },
    experience: {
      question: 'Have you built anything before?',
      options: [
        'No experience',
        'Followed tutorials',
        'Built small projects',
        'Built real apps',
      ],
      selected: 'Followed tutorials',
    },
    struggles: {
      question: 'What are you struggling with?',
      options: [
        'Staying consistent',
        'Understanding concepts',
        'Practice problems',
        'Building projects',
      ],
      selected: ['Staying consistent', 'Understanding concepts'],
    },
  };

  useEffect(() => {
    const query = `Here is the Learning data of a user 
    
    queston 1: ${learnerData.goal.question}
    user response: ${learnerData.goal.selected}

    queston 2: ${learnerData.skill_level.question}
    user response: ${learnerData.skill_level.selected}

    queston 3: ${learnerData.interest_areas.question}
    user response: ${learnerData.interest_areas.selected.join(', ')}

    queston 4: ${learnerData.experience.question}
    user response: ${learnerData.experience.selected}

    queston 5: ${learnerData.struggles.question}
    user response: ${learnerData.struggles.selected.join(', ')}

    Based on the above data, recommend me some YouTube playlists and videos that can help me achieve my goal.
    
    `;
  });

  return (
    <Container>
      <div>
        <h2>Learner Dashboard</h2>
      </div>
    </Container>
  );
};

export default LearnerDashboard;
