const mongoose = require("mongoose");
// name, email, password, isTeacher, classRoomsId,
// tokens,
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
  token: 
      {
        type: String
      },
  classRoomIds: [
    {
      classRoomId: {
        type: String
      }
    }
  ]
});
module.exports = mongoose.model("UserDetail", UserSchema);
