// The information provided by codesand
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
      {
          id: 1,
          name: "Declare a Variable",
          due_at: "2023-01-25",
          points_possible: 50
      },
      {
          id: 2,
          name: "Write a Function",
          due_at: "2023-02-27",
          points_possible: 150
      },
      {
          id: 3,
          name: "Code the World",
          due_at: "3156-11-15",
          points_possible: 500
      }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
      learner_id: 125,
      assignment_id: 1,
      submission: {
          submitted_at: "2023-01-25",
          score: 47
      }
  },
  {
      learner_id: 125,
      assignment_id: 2,
      submission: {
          submitted_at: "2023-02-12",
          score: 150
      }
  },
  {
      learner_id: 125,
      assignment_id: 3,
      submission: {
          submitted_at: "2023-01-25",
          score: 400
      }
  },
  {
      learner_id: 132,
      assignment_id: 1,
      submission: {
          submitted_at: "2023-01-24",
          score: 39
      }
  },
  {
      learner_id: 132,
      assignment_id: 2,
      submission: {
          submitted_at: "2023-03-07",
          score: 140
      }
  }
];

// The validation and main processing function
function validateAssignmentGroupCourseId(courseId, assignmentGroup) {
  if (assignmentGroup.course_id !== courseId) {
      throw new Error("Assignment group course mismatch");
  }
}

function parseDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
  }
  return date;
}

function getLearnerData(course, ag, submissions) {
  try {
      validateAssignmentGroupCourseId(course.id, ag);

      const currentDate = new Date();
      const results = {};

      ag.assignments.forEach(assignment => {
          const assignmentDueDate = parseDate(assignment.due_at);

          // Only process assignments that are due
          console.log('Assignment Date: ', assignmentDueDate);
          if (assignmentDueDate > currentDate) {
              console.log('Assignment Not Proceeded: ', assignment);
              return;
          }

          submissions.forEach(submission => {
              if (submission.assignment_id === assignment.id) {
                  const learnerId = submission.learner_id;
                  const score = submission.submission.score;
                  const submittedAt = parseDate(submission.submission.submitted_at);

                  if (!results[learnerId]) {
                      results[learnerId] = {
                          id: learnerId,
                          avg: 0,
                          totalScore: 0,
                          totalPossible: 0,
                          scores: {}
                      };
                  }

                  let effectiveScore = score;
                  // Deduct points if the submission is late
                  if (submittedAt > assignmentDueDate) {
                      effectiveScore -= Math.min(score, assignment.points_possible * 0.1);
                  }

                  if (assignment.points_possible === 0) {
                      throw new Error(`Points possible cannot be zero for assignment ${assignment.id}`);
                  }

                  const percentage = effectiveScore / assignment.points_possible;

                  results[learnerId].scores[assignment.id] = percentage;
                  results[learnerId].totalScore += effectiveScore;
                  results[learnerId].totalPossible += assignment.points_possible;
              }
          });
      });

      console.log('Raw Results: ', results);
      // Calculate average and format the output
      return Object.values(results).map(result => {
          if (result.totalPossible === 0) {
              result.avg = 0;
          } else {
              result.avg = (result.totalScore / result.totalPossible) ;
          }
          // Remove totalScore and totalPossible from the final output
          delete result.totalScore;
          delete result.totalPossible;
          return result;
      });

  } catch (error) {
      console.error("Error processing data:", error.message);
      return [];
  }
}

const learnerData = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(learnerData);