import * as fs from 'fs';
import * as path from 'path';

export interface IDataWriter {
    existsSync: (path: string) => boolean;
    appendFile: (saveFile: string, data: string, callback?: () => void) => void;
    appendFileSync: (saveFile: string, data: string) => void;
    writeFile: (saveFile: string, data: string, callback: () => void) => void;
    writeFileSync: (saveFile: string, data: string) => void;
    readFile: (saveFile: string, callback: (err: NodeJS.ErrnoException, data: string) => void) => void;
    readFileSync: (saveFile: string) => string;
    dataTypes: IDataTypes;
}

export interface IDataTypes {
    notifications: string;
    channels: string;
}

export const DataWriter = () => {
    const dataTypes: IDataTypes = {
        notifications: path.join(__dirname + '../../../../' + 'notifications.json'),
        channels: path.join(__dirname + '../../../../' + 'channels.json'),
    };
    

    const appendFile = (saveFile: string, data: string, callback?: () => void) => {
        fs.appendFile(saveFile, data, callback || (() => {}));
    };

    const appendFileSync = (saveFile: string, data: string) => {
        fs.appendFileSync(saveFile, data);
    };

    const writeFile = (saveFile: string, data: string, callback?: () => void) => {
        fs.writeFile(saveFile, data, callback || (() => {}));
    };
    const writeFileSync = (saveFile: string, data: string) => {
        fs.writeFileSync(saveFile, data);
    };

    const readFile = (saveFile: string, callback: (err: NodeJS.ErrnoException, data: string) => void) => {
        fs.readFile(saveFile, { encoding: 'utf8' }, callback);
    };

    const readFileSync = (saveFile: string) => {
        return fs.readFileSync(saveFile, { encoding: 'utf8' });
    };

    const existsSync = (path: string) => {
        return fs.existsSync(path);
    };

    const self: IDataWriter = {
        existsSync,
        appendFile,
        appendFileSync,
        writeFile,
        writeFileSync,
        readFile,
        readFileSync,
        dataTypes,
    };
    return self;
};
