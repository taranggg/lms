import mongoose from "mongoose";

export interface Topic extends mongoose.Document {
  name: string;
  duration: string;
}

const topicSchema = new mongoose.Schema<Topic>({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
