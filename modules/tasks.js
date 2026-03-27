// export default {
//     name: "Tasks",
//     requires: ["Core", "Auth"],
    
//     setupRoutes(app, container) {
//       const storage = container.get("storage");
//       const auth = container.get("auth");
      
//       app.get("/tasks", (req, res) => {
//         const user = auth.getCurrentUser(req);
//         if (!user) throw new Error("Не авторизован");
        
//         const tasks = storage.findTasksByUser(user.id);
//         res.json(tasks);
//       });
      
//       app.get("/tasks/:id", (req, res) => {
//         const user = auth.getCurrentUser(req);
//         if (!user) throw new Error("Не авторизован");
        
//         const task = storage.findTaskById(req.params.id);
//         if (!task) throw new Error("Задача не найдена");
        
//         if (task.userId !== user.id) throw new Error("Доступ запрещен");
        
//         res.json(task);
//       });
      
//       app.post("/tasks", (req, res) => {
//         const user = auth.getCurrentUser(req);
//         if (!user) throw new Error("Не авторизован");
        
//         const { title, description, deadline, priority } = req.body;
        
//         if (!title) throw new Error("Название задачи обязательно");
        
//         const task = storage.addTask({
//           userId: user.id,
//           title,
//           description: description || "",
//           deadline: deadline || null,
//           priority: priority || "medium",
//           status: "new",
//           createdAt: container.get("clock").now()
//         });
        
//         res.status(201).json(task);
//       });
      
//       app.put("/tasks/:id", (req, res) => {
//         const user = auth.getCurrentUser(req);
//         if (!user) throw new Error("Не авторизован");
        
//         const task = storage.findTaskById(req.params.id);
//         if (!task) throw new Error("Задача не найдена");
        
//         if (task.userId !== user.id) throw new Error("Доступ запрещен");
        
//         const { title, description, deadline, priority, status } = req.body;
        
//         const updated = storage.updateTask(req.params.id, {
//           title: title || task.title,
//           description: description !== undefined ? description : task.description,
//           deadline: deadline !== undefined ? deadline : task.deadline,
//           priority: priority || task.priority,
//           status: status || task.status
//         });
        
//         res.json(updated);
//       });
      
//       app.patch("/tasks/:id/status", (req, res) => {
//         const user = auth.getCurrentUser(req);
//         if (!user) throw new Error("Не авторизован");
        
//         const task = storage.findTaskById(req.params.id);
//         if (!task) throw new Error("Задача не найдена");
        
//         if (task.userId !== user.id) throw new Error("Доступ запрещен");
        
//         const { status } = req.body;
//         const validStatuses = ["new", "in_progress", "done", "overdue"];
        
//         if (!validStatuses.includes(status)) {
//           throw new Error("Некорректный статус");
//         }
        
//         const updated = storage.updateTask(req.params.id, { 
//           status,
//           ...(status === "done" && { completedAt: container.get("clock").now() })
//         });
        
//         res.json(updated);
//       });
      
//       app.delete("/tasks/:id", (req, res) => {
//         const user = auth.getCurrentUser(req);
//         if (!user) throw new Error("Не авторизован");
        
//         const task = storage.findTaskById(req.params.id);
//         if (!task) throw new Error("Задача не найдена");
        
//         if (task.userId !== user.id) throw new Error("Доступ запрещен");
        
//         storage.deleteTask(req.params.id);
//         res.status(204).send();
//       });
//     },
    
//     init(container) {
//       const clock = container.get("clock");
//       console.log(`[${clock.now()}] Tasks модуль инициализирован`);
//     }
//   };