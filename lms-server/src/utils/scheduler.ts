import TrainerSessionModel from "../models/trainerSession.js";

// Run every hour
const CHECK_INTERVAL = 60 * 60 * 1000;

// Session timeout threshold (e.g., 6 hours after last active = assume forgot logout)
// OR, strict midnight policy. User logic was "Run at Midnight".
// Let's implement a check for "Sessions that started yesterday and are still Active".

export const initScheduler = () => {
  console.log("Scheduler initialized: Monitoring Trainer Sessions...");

  setInterval(async () => {
    try {
      const now = new Date();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const abandonedSessions = await TrainerSessionModel.find({
        status: "Active",
        date: { $lt: today }, // Any session from yesterday or before
      });

      for (const session of abandonedSessions) {
        console.log(`Auto-closing session for Trainer ${session.trainerId}`);

        session.endTime = session.lastActiveAt;
        session.status = "Auto-Closed";

        // Calculate duration
        if (session.startTime) {
          session.duration =
            session.lastActiveAt.getTime() - session.startTime.getTime();
        }

        await session.save();
      }

      if (abandonedSessions.length > 0) {
        console.log(
          `Processed ${abandonedSessions.length} abandoned sessions.`
        );
      }
    } catch (error) {
      console.error("Scheduler Error:", error);
    }
  }, CHECK_INTERVAL);
};
