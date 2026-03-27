import { v4 as uuidv4 } from 'uuid';

export default {
    name: "Core",
    requires: [],
    
    register(container) {
        console.log("Регистрация модуля Core");
        
        container.register("clock", {
            now: () => new Date().toISOString(),
            today: () => new Date().toISOString().split('T')[0]
        });
        
        container.register("storage", {
            users: [],
            tasks: [],
            
            generateId() {
                return uuidv4();
            },
            
            addUser(user) {
                const newUser = {
                    ...user,
                    id: user.id || uuidv4(),
                    createdAt: new Date().toISOString()
                };
                this.users.push(newUser);
                return newUser;
            },
            
            findUserByEmail(email) {
                return this.users.find(u => u.email === email);
            },
            
            findUserById(id) {
                return this.users.find(u => u.id === id);
            },
            
            getAllUsers() {
                return this.users;
            },
            
            addTask(task) {
                const newTask = {
                    ...task,
                    id: uuidv4(),
                    createdAt: new Date().toISOString()
                };
                this.tasks.push(newTask);
                return newTask;
            },
            
            findTaskById(id) {
                return this.tasks.find(t => t.id === id);
            },
            
            findTasksByUserId(userId) {
                return this.tasks.filter(t => t.userId === userId);
            },
            
            updateTask(id, updates) {
                const task = this.findTaskById(id);
                if (task) {
                    Object.assign(task, updates);
                    task.updatedAt = new Date().toISOString();
                }
                return task;
            },
            
            deleteTask(id) {
                const index = this.tasks.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.tasks.splice(index, 1);
                    return true;
                }
                return false;
            },
            
            getAllTasks() {
                return this.tasks;
            }
        });
    },
    
    setupRoutes(app, container) {
        console.log("Настройка маршрутов модуля Core");
        
        const clock = container.get("clock");
        
        app.get("/health", (req, res, next) => {
            try {
                res.json({
                    status: "ok",
                    uptime: process.uptime(),
                    requestId: req.id,
                    timestamp: clock.now(),
                });
            } catch (error) {
                next(error);
            }
        });
        
        app.get("/test-error", (req, res, next) => {
            try {
                throw new Error("Тестовая ошибка");
            } catch (error) {
                error.statusCode = 400;
                error.code = "TEST_ERROR";
                next(error);
            }
        });
    },
    
    async init(container) {
        const clock = container.get("clock");
        console.log(`[${clock.now()}] модуль Core инициализирован`);
    }
};