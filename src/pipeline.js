import express from 'express';
import { requestIdMiddleware, requestLoggerMiddleware } from '../middleware/index.js';

export function setupPipeline(app, container) {
    console.log("Настройка конвейера обработки запросов");
    
    app.use(express.json());
    
    app.use(requestIdMiddleware);
    
    app.use(requestLoggerMiddleware);
    
    console.log("Конвейер настроен");
}

export function setupErrorHandler(app) {
    console.log("Настройка обработчика ошибок");
    
    import('../middleware/errorHandler.js').then(({ errorHandlerMiddleware }) => {
        app.use(errorHandlerMiddleware);
        console.log("Обработчик ошибок настроен");
    });
}