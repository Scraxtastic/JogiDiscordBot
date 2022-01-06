require('source-map-support').install();
import { Launcher } from './src/Launcher';
import { Logger } from './src/Services/Logger';

const test = false;
const startExceptionHandler = () => {
    process.on('uncaughtException', function (error: Error) {
        try {
            const logger = Logger();
            logger.logError(
                'Something failed. Further information under #' +
                    Math.random() * 999999
            );
            logger.logErrorJustFile(
                `${error.name}: ${error.message}\nStack\n${error.stack}`
            );
        } catch (e) {
            console.log(new Date() + 'ERROR', e);
        }
        console.log('Error');

        // process.exit(1)
    });
};

const start = async () => {
    startExceptionHandler();
    const myLauncher = Launcher();
    const timeout: number = 5 * 60 * 1000;
    if (test) {
        await myLauncher.test();
    } else {
        await myLauncher.start(timeout);
    }
};
start();
