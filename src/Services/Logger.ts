import { DataWriter } from './DataWriter';

export interface ILogger {
    logPath: string;
    errorPath: string;
    log: (data: string) => void;
    logError: (data: string) => void;
    logErrorJustFile: (data: string) => void;
}

export const Logger = () => {
    let logPath = './logs/logs.log';
    let errorPath = './logs/error.log';
    const dataWriter = DataWriter();

    const log = (data: string) => {
        const now = new Date();
        const cleanDate = new Date(now.setMinutes(now.getMinutes() - now.getTimezoneOffset())).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const logText = 'log ' + cleanDate + ' ' + data + '\n';
        dataWriter.appendFile(logPath, logText, () => {
            console.log(logText.slice(0, -1));
        });
    };

    const logError = (error: string) => {
        const cleanDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const logText = 'error ' + cleanDate + ' ' + error + '\n';
        dataWriter.appendFile(errorPath, logText, () => {
            console.log(logText.slice(0, -1));
        });
    };

    const logErrorJustFile = (error: string) => {
        const cleanDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const logText = 'error ' + cleanDate + ' ' + error + '\n';
        dataWriter.appendFile(errorPath, logText);
    };

    return {
        logPath,
        errorPath,
        log,
        logError,
        logErrorJustFile,
    };
};
