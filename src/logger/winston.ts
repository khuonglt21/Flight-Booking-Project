import winston from "winston";

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp({
            format:'yyyy-mm-dd HH:mm:ss'
        }),
        winston.format.colorize(),
        winston.format.printf(
            log => {

                // nếu log là error hiển thị stack trace còn không hiển thị message của log

                if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;

                return `[${log.timestamp}] [${log.level}] ${log.message}`;

            },


        )
    ),
    transports: [

        // hiển thị log thông qua console

        new winston.transports.Console(),

        // Thiết lập ghi các errors vào file

    ],
})