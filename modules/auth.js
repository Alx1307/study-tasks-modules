// //добавить токены при авторизации, authmiddleware?
// //поменять хранилище на хранение uuid и хэшей паролей?
// //middleware для одинаковой обработки ошибок
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';

// const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_EXPIRES_IN = '24h';

// export default {
//     name: "Auth",
//     requires: ["Core"],

//     register(container) {
//         container.register("auth", {
//             getCurrentUser(req) {
//                 try {
//                   const authHeader = req.headers.authorization;
//                   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//                     return null;
//                   }
                  
//                   const token = authHeader.substring(7);
                  
//                   const decoded = jwt.verify(token, JWT_SECRET);
                  
//                   const storage = container.get("storage");
                  
//                   return storage.findUserById(decoded.userId);
//                 } catch (error) {
//                   return null;
//                 }
//             },

//             async login(email, password) {
//                 const storage = container.get("storage");

//                 const user = storage.findUserByEmail(email);

//                 if (!user) {
//                     return null;
//                 }

//                 const isValidPassword = await bcrypt.compare(password, user.passwordHash);

//                 if (!isValidPassword) {
//                     return null;
//                 }

//                 const token = jwt.sign(
//                     {
//                         userId: user.id,
//                         email: user.email,
//                         name: user.name
//                     },
//                     JWT_SECRET,
//                     { expiresIn: JWT_EXPIRES_IN }
//                 );

//                 return {
//                     user: {
//                         id: user.id,
//                         email: user.email,
//                         name: user.name
//                     },
//                     token,
//                     expiresIn: JWT_EXPIRES_IN
//                 };
//             },

//             validateToken(token) {
//                 try {
//                     return jwt.verify(token, JWT_SECRET);
//                 } catch (error) {
//                     return null;
//                 }
//             },

//             generateTokenForUser(userId) {
//                 const storage = container.get("storage");
//                 const user = storage.findUserById(userId);

//                 if (!user) {
//                     return null;
//                 }

//                 return jwt.sign(
//                     {
//                         userId: user.id,
//                         email: user.email,
//                         name: user.name
//                     },
//                     JWT_SECRET,
//                     { expiresIn: JWT_EXPIRES_IN }
//                 );
//             }
//         });
//     },

//     setupRoutes(app, container) {
//         const storage = container.get("storage");
//         const clock = container.get("clock");
        
//         app.post("/auth/register", async (req, res) => {
//           try {
//             const { email, name, password } = req.body;
            
//             if (!email || !password) {
//               return res.status(400).json({
//                 error: "Email и пароль обязательны"
//               });
//             }
            
//             if (password.length < 6) {
//               return res.status(400).json({
//                 error: "Пароль должен быть не менее 6 символов"
//               });
//             }
            
//             if (storage.findUserByEmail(email)) {
//               return res.status(409).json({
//                 error: "Пользователь с таким email уже существует"
//               });
//             }
            
//             const saltRounds = 10;
//             const passwordHash = await bcrypt.hash(password, saltRounds);
            
//             const newUser = {
//               id: uuidv4(),
//               email,
//               name: name || email.split('@')[0],
//               passwordHash,
//               createdAt: clock.now()
//             };
            
//             const user = storage.addUser(newUser);
            
//             const auth = container.get("auth");
//             const token = auth.generateTokenForUser(user.id);
            
//             res.status(201).json({
//               user: {
//                 id: user.id,
//                 email: user.email,
//                 name: user.name,
//                 createdAt: user.createdAt
//               },
//               token
//             });
            
//           } catch (error) {
//             res.status(500).json({
//               error: "Ошибка при регистрации",
//               message: error.message
//             });
//           }
//         });
        
//         app.post("/auth/login", async (req, res) => {
//           try {
//             const { email, password } = req.body;
            
//             if (!email || !password) {
//               return res.status(400).json({
//                 error: "Email и пароль обязательны"
//               });
//             }
            
//             const auth = container.get("auth");
//             const result = await auth.login(email, password);
            
//             if (!result) {
//               return res.status(401).json({
//                 error: "Неверный email или пароль"
//               });
//             }
            
//             console.log(`[${clock.now()}] Пользователь ${result.user.email} вошел в систему`);
            
//             res.json(result);
            
//           } catch (error) {
//             res.status(500).json({
//               error: "Ошибка при входе",
//               message: error.message
//             });
//           }
//         });
        
//         app.get("/auth/me", (req, res) => {
//           try {
//             const auth = container.get("auth");
//             const user = auth.getCurrentUser(req);
            
//             if (!user) {
//               return res.status(401).json({
//                 error: "Не авторизован"
//               });
//             }
            
//             res.json({
//               id: user.id,
//               email: user.email,
//               name: user.name,
//               createdAt: user.createdAt
//             });
            
//           } catch (error) {
//             res.status(500).json({
//               error: "Ошибка при получении информации о пользователе",
//               message: error.message
//             });
//           }
//         });
        
//         app.post("/auth/refresh", (req, res) => {
//           try {
//             const auth = container.get("auth");
//             const user = auth.getCurrentUser(req);
            
//             if (!user) {
//               return res.status(401).json({
//                 error: "Не авторизован"
//               });
//             }
            
//             const newToken = auth.generateTokenForUser(user.id);
            
//             res.json({
//               token: newToken,
//               expiresIn: JWT_EXPIRES_IN
//             });
            
//           } catch (error) {
//             res.status(500).json({
//               error: "Ошибка при обновлении токена",
//               message: error.message
//             });
//           }
//         });
        
//         app.post("/auth/logout", (req, res) => {
//           res.json({
//             message: "Успешный выход из системы"
//           });
//         });
//       },
      
//       init(container) {
//         const clock = container.get("clock");        
//         console.log(`[${clock.now()}] Auth модуль инициализирован`);
//     }
// };