import Notification from "./notification.model.js";

export const saveNotification = async (type, message, product, user) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    const exists = await Notification.findOne({
      type,
      message,
      product,
      date: { $gte: startOfDay },
    });

    if (exists) {
      return;
    }

    const notification = new Notification({
      type,
      message,
      product: product || null,
      user: user || null,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { limit = 10, offset = 0} = req.query
    const notifications = await Notification.find().skip(Number(offset)).limit(Number(limit))
      .populate("product", "name")
      .sort({ createdAt: -1});

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las notificaciones.",
    });
  }
};
