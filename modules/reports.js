// export default {
//     name: "Reports",
//     requires: ["Core", "Auth", "Tasks"],
    
//     setupRoutes(app, container) {
//       const storage = container.get("storage");
//       const auth = container.get("auth");
      
//       app.get("/reports/statistics", (req, res) => {
//         const user = auth.getCurrentUser(req);
//         if (!user) throw new Error("Не авторизован");
        
//         const tasks = storage.findTasksByUser(user.id);
        
//         const statistics = {
//           total: tasks.length,
//           byStatus: {
//             new: tasks.filter(t => t.status === "new").length,
//             in_progress: tasks.filter(t => t.status === "in_progress").length,
//             done: tasks.filter(t => t.status === "done").length,
//             overdue: tasks.filter(t => t.status === "overdue").length
//           },
//           byPriority: {
//             low: tasks.filter(t => t.priority === "low").length,
//             medium: tasks.filter(t => t.priority === "medium").length,
//             high: tasks.filter(t => t.priority === "high").length
//           },
//           completionRate: tasks.length ? 
//             Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100) : 0
//         };
        
//         res.json(statistics);
//       });
      
//       app.get("/reports/overdue", (req, res) => {
//         const user = auth.getCurrentUser(req);
//         if (!user) throw new Error("Не авторизован");
        
//         const today = container.get("clock").today();
//         const tasks = storage.findTasksByUser(user.id);
        
//         const overdue = tasks.filter(t => 
//           t.status !== "done" && 
//           t.deadline && 
//           t.deadline < today
//         );
        
//         overdue.forEach(t => {
//           if (t.status !== "overdue") {
//             storage.updateTask(t.id, { status: "overdue" });
//           }
//         });
        
//         res.json(overdue);
//       });
      
//       app.get("/reports/activity", (req, res) => {
//         const user = auth.getCurrentUser(req);
//         if (!user) throw new Error("Не авторизован");
        
//         const tasks = storage.findTasksByUser(user.id);
        
//         const activity = {};
//         tasks.forEach(task => {
//           const date = task.createdAt.split("T")[0];
//           if (!activity[date]) {
//             activity[date] = { created: 0, completed: 0 };
//           }
//           activity[date].created++;
          
//           if (task.status === "done" && task.completedAt) {
//             const completedDate = task.completedAt.split("T")[0];
//             if (!activity[completedDate]) {
//               activity[completedDate] = { created: 0, completed: 0 };
//             }
//             activity[completedDate].completed++;
//           }
//         });
        
//         res.json(activity);
//       });
//     },
    
//     init(container) {
//       const clock = container.get("clock");
//       console.log(`[${clock.now()}] Reports модуль инициализирован`);
//     }
//   };