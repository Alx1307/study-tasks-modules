export function createAuthMiddleware(container) {
    return (req, res, next) => {
        const auth = container.get("auth");
        const user = auth.getCurrentUser(req);
        
        if (!user) {
            return res.status(401).json({
                code: "UNAUTHORIZED",
                message: "Не выполнена авторизация. Отсутствует или недействительный токен.",
                requestId: req.id
            });
        }
        
        req.user = user;
        next();
    };
}