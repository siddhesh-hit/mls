const mongoose = require("mongoose");
const NotificationFormat = require("./NotificationFormat");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user_specific: [
      {
        name: {
          type: String,
          required: true,
        },
        marathi: {
          message: {
            type: String,
            required: true,
          },
        },
        english: {
          message: {
            type: String,
            required: true,
          },
        },
        time_span: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    global: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NotificationFormat",
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// before saving populate the global field
notificationSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const notificationFormats = await NotificationFormat.find({});

      const notificationFormatIds = notificationFormats.map(
        (format) => format._id
      );

      this.global = [...this.global, ...notificationFormatIds];

      next();
    }
  } catch (error) {
    next(error);
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
