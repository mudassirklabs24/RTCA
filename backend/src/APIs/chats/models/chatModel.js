import { Schema, model, ObjectId } from "mongoose";

const chatSchema = Schema({
  chatName: {
    type: String,

  },
  usersIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

export default model("chat", chatSchema);
