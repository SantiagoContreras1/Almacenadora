import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
    type: {
      type: String,
      enum: ["LOW_STOCK", "EXPIRATION"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    }
  },
  { timestamps: true }
);

NotificationSchema.methods.toJSON = function() {
    const {__v,_id,...notification} = this.toObject()
    notification.uid = _id
    return notification
}

export default model("Notification", NotificationSchema);
