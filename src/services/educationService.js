/**
 * Education Service
 * Integrates SKILL EDUCATION features for IELTS learning
 * Supports Vietnamese 6-level framework: A2, B1, B2, C1, C2, Native
 */

// Vietnamese 6-Level Framework mapping to IELTS bands
export const VIETNAMESE_LEVELS = {
  A2: { band: '3.0-4.5', label: 'Sơ cấp', color: '#ef4444', description: 'Người mới bắt đầu' },
  B1: { band: '5.0-5.5', label: 'Trung cấp 1', color: '#f59e0b', description: 'Trung cấp cơ bản' },
  B2: { band: '6.0-6.5', label: 'Trung cấp 2', color: '#eab308', description: 'Trung cấp nâng cao' },
  C1: { band: '7.0-8.0', label: 'Cao cấp 1', color: '#22c55e', description: 'Thành thạo' },
  C2: { band: '8.5-9.0', label: 'Cao cấp 2', color: '#3b82f6', description: 'Gần như người bản ngữ' },
  NATIVE: { band: '9.0+', label: 'Bản ngữ', color: '#8b5cf6', description: 'Trình độ người bản ngữ' }
};

export const educationService = {
  /**
   * Get Vietnamese level from IELTS band score
   * @param {number} bandScore - IELTS band score
   * @returns {string} Vietnamese level (A2, B1, B2, C1, C2, NATIVE)
   */
  getVietnameseLevel(bandScore) {
    if (bandScore < 5.0) return 'A2';
    if (bandScore < 6.0) return 'B1';
    if (bandScore < 7.0) return 'B2';
    if (bandScore < 8.5) return 'C1';
    if (bandScore < 9.0) return 'C2';
    return 'NATIVE';
  },

  /**
   * Get learning path recommendations based on user level
   * @param {string} userLevel - A2, B1, B2, C1, C2, NATIVE (or beginner, intermediate, advanced for backward compatibility)
   * @returns {object} Learning path with resources
   */
  getLearningPath(userLevel) {
    // Map Vietnamese levels to internal levels
    const levelMapping = {
      'A2': 'beginner',
      'B1': 'beginner',
      'B2': 'intermediate',
      'C1': 'advanced',
      'C2': 'advanced',
      'NATIVE': 'advanced',
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced'
    };

    const mappedLevel = levelMapping[userLevel] || 'intermediate';
    const paths = {
      beginner: {  // A2, B1
        title: 'IELTS Writing Basics',
        description: 'Fundamental writing skills for IELTS beginners',
        modules: [
          {
            id: 'intro',
            title: 'Introduction to IELTS Writing',
            topics: [
              'Understanding IELTS Writing Format',
              'Task 1 vs Task 2',
              'Scoring Criteria Overview',
              'Time Management Strategies'
            ]
          },
          {
            id: 'task1-basics',
            title: 'Task 1 Fundamentals',
            topics: [
              'Describing Charts and Graphs',
              'Writing Process Essays',
              'Comparison Language',
              'Data Interpretation'
            ]
          },
          {
            id: 'task2-basics',
            title: 'Task 2 Fundamentals',
            topics: [
              'Essay Structure',
              'Thesis Statement Writing',
              'Paragraph Development',
              'Conclusion Techniques'
            ]
          }
        ],
        focusAreas: [
          'Basic vocabulary building',
          'Simple sentence structures',
          'Grammar fundamentals',
          'Paragraph organization'
        ]
      },
      intermediate: {  // B2
        title: 'Advanced IELTS Writing Techniques',
        description: 'Enhance your writing skills to reach Band 6.5-7.5',
        modules: [
          {
            id: 'advanced-task1',
            title: 'Advanced Task 1 Skills',
            topics: [
              'Complex Data Analysis',
              'Advanced Comparison Techniques',
              'Trend Description Mastery',
              'Overview Writing Excellence'
            ]
          },
          {
            id: 'advanced-task2',
            title: 'Advanced Task 2 Skills',
            topics: [
              'Argumentation Strategies',
              'Critical Thinking',
              'Supporting Ideas Effectively',
              'Counterargument Handling'
            ]
          },
          {
            id: 'vocabulary',
            title: 'Academic Vocabulary',
            topics: [
              'Topic-Specific Vocabulary',
              'Collocations and Phrases',
              'Formal vs Informal Language',
              'Paraphrasing Skills'
            ]
          }
        ],
        focusAreas: [
          'Complex sentence structures',
          'Advanced vocabulary usage',
          'Coherence and cohesion',
          'Band 7+ criteria'
        ]
      },
      advanced: {  // C1, C2, NATIVE
        title: 'IELTS Writing Mastery',
        description: 'Achieve Band 8.0+ with expert techniques',
        modules: [
          {
            id: 'excellence',
            title: 'Writing Excellence',
            topics: [
              'Band 8-9 Criteria Analysis',
              'Sophisticated Language Use',
              'Nuanced Argumentation',
              'Perfect Essay Structure'
            ]
          },
          {
            id: 'style',
            title: 'Advanced Writing Style',
            topics: [
              'Rhetorical Devices',
              'Academic Tone Mastery',
              'Precision in Expression',
              'Error-Free Writing'
            ]
          },
          {
            id: 'practice',
            title: 'Expert Practice',
            topics: [
              'Timed Writing Mastery',
              'Self-Editing Techniques',
              'Examiner Thinking',
              'Consistent High Performance'
            ]
          }
        ],
        focusAreas: [
          'Flawless grammar',
          'Sophisticated vocabulary',
          'Perfect coherence',
          'Natural, fluent expression'
        ]
      }
    };

    return paths[mappedLevel] || paths.intermediate;
  },

  /**
   * Get writing tips based on common mistakes
   * @param {object} evaluation - Essay evaluation results
   * @returns {array} Personalized tips
   */
  getPersonalizedTips(evaluation) {
    const tips = [];

    // Task Achievement tips
    if (evaluation.taskAchievement?.band < 6.5) {
      tips.push({
        category: 'Task Achievement',
        priority: 'high',
        tip: 'Focus on fully answering all parts of the question. Make sure your position is clear throughout the essay.',
        resources: [
          'Task Response Checklist',
          'Essay Planning Templates',
          'Question Analysis Guide'
        ]
      });
    }

    // Coherence and Cohesion tips
    if (evaluation.coherenceCohesion?.band < 6.5) {
      tips.push({
        category: 'Coherence & Cohesion',
        priority: 'high',
        tip: 'Improve paragraph organization. Use linking words naturally and ensure logical flow between ideas.',
        resources: [
          'Cohesive Devices List',
          'Paragraph Linking Guide',
          'Essay Structure Templates'
        ]
      });
    }

    // Lexical Resource tips
    if (evaluation.lexicalResource?.band < 6.5) {
      tips.push({
        category: 'Vocabulary',
        priority: 'medium',
        tip: 'Expand your vocabulary range. Learn topic-specific words and practice paraphrasing.',
        resources: [
          'IELTS Vocabulary Lists',
          'Collocation Database',
          'Paraphrasing Exercises'
        ]
      });
    }

    // Grammatical Range tips
    if (evaluation.grammaticalRange?.band < 6.5) {
      tips.push({
        category: 'Grammar',
        priority: 'high',
        tip: 'Work on complex sentence structures and reduce grammatical errors. Review common error patterns.',
        resources: [
          'Grammar for IELTS',
          'Complex Sentences Guide',
          'Error Correction Practice'
        ]
      });
    }

    // General improvement tips based on overall band
    if (evaluation.overallBand < 6.0) {
      tips.push({
        category: 'Foundation',
        priority: 'critical',
        tip: 'Focus on building strong fundamentals: basic grammar, essential vocabulary, and simple paragraph structure.',
        resources: [
          'IELTS Writing Basics Course',
          'Essential Grammar Review',
          'Writing Practice Exercises'
        ]
      });
    }

    return tips;
  },

  /**
   * Get practice exercises based on weak areas
   * @param {object} evaluation - Essay evaluation results
   * @returns {array} Recommended exercises
   */
  getPracticeExercises(evaluation) {
    const exercises = [];

    const weakAreas = [];
    if (evaluation.taskAchievement?.band < 6.5) weakAreas.push('taskAchievement');
    if (evaluation.coherenceCohesion?.band < 6.5) weakAreas.push('coherence');
    if (evaluation.lexicalResource?.band < 6.5) weakAreas.push('vocabulary');
    if (evaluation.grammaticalRange?.band < 6.5) weakAreas.push('grammar');

    weakAreas.forEach(area => {
      switch (area) {
        case 'taskAchievement':
          exercises.push({
            type: 'Task Achievement',
            exercises: [
              'Analyze 10 IELTS questions and identify all parts',
              'Practice brainstorming ideas for different question types',
              'Write thesis statements for 5 different topics'
            ]
          });
          break;
        case 'coherence':
          exercises.push({
            type: 'Coherence & Cohesion',
            exercises: [
              'Practice using transition words in context',
              'Rewrite paragraphs with better linking',
              'Create outlines for 5 different essay topics'
            ]
          });
          break;
        case 'vocabulary':
          exercises.push({
            type: 'Vocabulary',
            exercises: [
              'Learn 20 academic collocations per week',
              'Practice paraphrasing sample sentences',
              'Use new vocabulary in original sentences'
            ]
          });
          break;
        case 'grammar':
          exercises.push({
            type: 'Grammar',
            exercises: [
              'Practice complex sentence formation',
              'Review and correct common errors',
              'Write sentences using various grammar structures'
            ]
          });
          break;
      }
    });

    return exercises;
  },

  /**
   * Get study plan based on target band and current level
   * @param {number} currentBand - Current band score
   * @param {number} targetBand - Target band score
   * @param {number} weeksAvailable - Weeks until exam
   * @returns {object} Detailed study plan
   */
  getStudyPlan(currentBand, targetBand, weeksAvailable) {
    const improvement = targetBand - currentBand;
    const intensity = improvement > 1.5 ? 'intensive' : 'regular';

    const plan = {
      overview: {
        currentBand,
        targetBand,
        improvement,
        duration: weeksAvailable,
        intensity,
        estimatedStudyHours: intensity === 'intensive' ? 15 : 10
      },
      weeklySchedule: {
        writing: {
          task1: 3,
          task2: 3,
          practice: 2
        },
        reading: 2,
        vocabulary: 1,
        grammar: 1,
        review: 2
      },
      milestones: this.generateMilestones(currentBand, targetBand, weeksAvailable),
      recommendations: [
        'Write at least 2 complete essays per week',
        'Review and analyze model answers regularly',
        'Get feedback on your writing',
        'Practice under timed conditions',
        'Keep a vocabulary journal'
      ]
    };

    return plan;
  },

  /**
   * Generate milestones for study plan
   * @private
   */
  generateMilestones(currentBand, targetBand, weeks) {
    const milestones = [];
    const increment = (targetBand - currentBand) / Math.ceil(weeks / 4);

    for (let i = 1; i <= Math.ceil(weeks / 4); i++) {
      const targetForPhase = Math.min(currentBand + (increment * i), targetBand);
      milestones.push({
        phase: i,
        weeks: i * 4,
        targetBand: targetForPhase.toFixed(1),
        goals: this.getPhaseGoals(targetForPhase)
      });
    }

    return milestones;
  },

  /**
   * Get goals for each phase
   * @private
   */
  getPhaseGoals(band) {
    if (band <= 6.0) {
      return [
        'Master basic essay structure',
        'Build essential vocabulary',
        'Write error-free simple sentences'
      ];
    } else if (band <= 7.0) {
      return [
        'Develop complex arguments',
        'Use advanced vocabulary accurately',
        'Improve coherence and cohesion'
      ];
    } else {
      return [
        'Achieve sophisticated expression',
        'Master all question types',
        'Write with natural fluency'
      ];
    }
  }
};
