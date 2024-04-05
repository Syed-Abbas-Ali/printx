import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const objectifyError = format((info, error) => {
    if (error instanceof Error) {
        info = Object.assign({
            message: info.message,
            stack: error.stack,
        }, info);
    }
    return info;
});

const printf = (info) => {
    return `${info.timestamp} ${info.label}[${info.level}]: ${info.message} ${info.stack ? info.stack : ''}`;
};

const logger = createLogger({
    exitOnError: false,
    level: process.env.LOG_LEVEL,
    format: format.combine(
        objectifyError(),
        format.label({
            label: path.basename(process.mainModule ? process.mainModule.filename : ''),
        }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(printf),
    ),
    silent: process.env.NODE_ENV === 'test',
    transports: [
        new transports.Console({
            format: format.combine(
                objectifyError(),
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.printf(printf),
            ),
        }),
        new transports.DailyRotateFile({
            filename: path.resolve(process.env.LOG_DIRECTORY?process.env.LOG_DIRECTORY:"printx", 'printx-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '50m',
            maxFiles: '15d',
        }),
    ],
});

export default logger;
