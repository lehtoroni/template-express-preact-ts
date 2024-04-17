import fs from 'fs';
import path from 'path';

import express from 'express';
import helmet from 'helmet';
import asyncHandler from 'express-async-handler';
import session from 'express-session';
import fileStore from 'session-file-store';

// @ts-ignore
import argsParser from 'args-parser';
import { v4 as uuid } from 'uuid';

const args = argsParser(process.argv) as { [key: string]: string | number | boolean | undefined };
const port = parseInt((args.port as string | undefined) ?? process.env.APP_PORT ?? '8999');

const APP_GLOBALS = {
    args,
    __dirname: path.normalize(process.cwd()),
    dataFolder: path.join(path.normalize(process.cwd()), 'data')
};

if (!fs.existsSync(APP_GLOBALS.dataFolder)) {
    fs.mkdirSync(APP_GLOBALS.dataFolder, { recursive: true });
}

const sessionSecretFile = path.join(APP_GLOBALS.__dirname, 'data', '.sessionsecret');
if (!fs.existsSync(sessionSecretFile)) {
    fs.writeFileSync(sessionSecretFile, `${uuid()}`.replace(/\-/, ''));
}

const app = express();
const FileStore = fileStore(session);

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
}))

app.use(session({
    secret: fs.readFileSync(sessionSecretFile, 'utf8').trim(),
    resave: true,
    saveUninitialized: false,
    store: new FileStore({
        path: path.join(APP_GLOBALS.__dirname, 'data', 'sessions')
    }),
    //cookie: { secure: false }
}))

app.get('/', asyncHandler(async (req, res) => {
    res.send(`Hello world!`);
}))

app.get('/api/hello', asyncHandler(async (req, res) => {
    res.json({
        hello: 'world',
        timestamp: Date.now()
    });
}))

app.listen(port, () => {
    console.log(`Listening on :${port}`);
});
