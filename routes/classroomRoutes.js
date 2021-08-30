const express = require("express");
const router = express.Router();
const isAuth = require("../config/jwt").isAuth;
const ClassRoom = require("../models/classModel");

// all details of one classroom
// router.get('/',(req,res) => {
//     Product.find({},(err,products) => {
//         if(products) {
//             res.json(products);
//         }
//         else {
//             res.json([]);
//         }
//     });
// });

router.get("/:id", (req, res) => {
  console.log(req.params);
  ClassRoom.findOne({ classRoomId: req.params.id }, (err, classRoom) => {
    if (err) {
      res.status(401).json({ msg: "ClassRoom not found!" });
    } else {
      res.json(classRoom);
    }
  });
});

router.post("/new", (req, res) => {
  const classRoom = new ClassRoom({
    classRoomName: req.body.classRoomName,
    classRoomId: req.body.classRoomId,
    teacherId: req.body.teacherId
  });
  console.log(classRoom);
  classRoom.save().then((classRoom) => {
    res.json(classRoom);
  })
  .catch((err) => {
    console.log(err);
  })
});

router.patch("/:id/announcement", (req, res) => {
  ClassRoom.findById(req.params.id,(err,classRoom) => {
      const announcement = {
        author: classRoom.teacherId,
        text: req.body.text,
        updated: Date.now()
      };
      classRoom.announcements.push(announcement);
      classRoom.save().then((classRoom) => {
        res.json(classRoom);
      });
    }
  );
});

router.patch("/:id/assignment", (req, res) => {
  ClassRoom.findById(req.params.id,(err,classRoom) => {
      const assignment = {
        assignmentName: req.body.assignmentName,
        text: req.body.text,
        updated: Date.now(),
        dueDate: req.body.dueDate
      };
      classRoom.assignments.push(assignment);
      classRoom.save().then((classRoom) => {
        res.json(classRoom);
      });
    }
  );
});

router.get("/:id/:assid/submission", (req, res) => {
  ClassRoom.findById(req.params.id,(err,classRoom) => {
      const assignmentData = classRoom.assignments.find(
        (assignment) => assignment.assignmentName === req.params.assid
      );
      if (!assignmentData) {
        res.status(401).json({ msg: "ClassRoom not found!" });
      } else {
        res.json(assignmentData);
      }
    }
  );
});

router.delete("/:id", isAuth, (req, res) => {
  ClassRoom.findByIdAndDelete(req.params.id,(err,deletedClass) => {
    if (deletedClass) {
      res.json({ msg: "ClassRoom deleted" });
    } else {
      res.json({ msg: "ClassRoom failed to delete" });
    }
  });
});

module.exports = router;

// router.post('/upload',(req,res) => {
//     if(req.files) {
//         const file = req.files.image;
//         file.mv(`C:/Users/divy maheshwari/MernProjects/Restaurant/client/public/uploads/${file.name}`,err => {
//             if(err) {
//                return res.status(500).json(err);
//             }
//             res.json(file.name);
//         });
//     }
//     else {
//         return res.status(500).json({msg:'no file uploaded'});
//     }
// });
// gaand phate to phate nawaabi na ghate
// upload karenge bsdk
