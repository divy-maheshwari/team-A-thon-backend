const mongoose = require("mongoose");
// className, class id, student id array,
// teacher id, assignment, post(Announcement)
// Array of objects
// assignemnt -> pdf, timeline, grades, Question
const ClassSchema = mongoose.Schema({
  classRoomName: {
    type: String
  },
  classRoomId: {
    type: String
  },
  teacherId: {
        type: String
      },
  studentsId: [
    {
      studentId: {
        type: String
      }
    }
  ],
  announcements: [
    {
      announcement: {
        author: {
          type: String
        },
        text: {
          type: String
        },
        updated: {
          type: Date,
          default: Date.now
        }
      }
    }
  ],
  assignments: [
    {
      assignment: {
        assignmentName: {
          type: String,
        },
        text: {
          type: String
        },
        updated: {
          type: Date,
          default: Date.now
        },
        dueDate: {
          type: Date
        },
        submissions: [
          {
            submission: {
              type: String
            }
          }
        ]
      }
    }
  ]
});

module.exports = mongoose.model("ClassRoomDetail", ClassSchema);
