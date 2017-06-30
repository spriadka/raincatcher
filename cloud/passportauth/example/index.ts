import {BunyanLogger, Logger} from '@raincatcher/logger';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import passport, {PassportAuth, UserDataRepo, UserSec, UserSecService} from '../src/index';
import UserDataRepository from './UserDataRepository';
import userSeedData from './UserSeedData';

const log: Logger = new BunyanLogger({name: 'Passport-Auth-Example', level: 'info'});

// Configuration for express session options
const sessionOpts = {
  secret: process.env.SESSION_SECRET || 'raincatcher',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/'
  }
};

// Initialize user data repository and passport
const userRepo: UserDataRepo = new UserDataRepository(userSeedData);
const userSec: UserSec = new UserSecService(userRepo);
const authService: PassportAuth = new PassportAuth(userSec);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
authService.init(app, sessionOpts);
authService.setup();

app.get('/testAdminEndpoint', authService.protect('admin'), (req: express.Request, res: express.Response) => {
  res.json({routeName: '/testAdminEndpoint', msg: 'authorized to access admin endpoint'});
});

app.get('/testUserEndpoint', authService.protect('user'), (req: express.Request, res: express.Response) => {
  res.json({routeName: '/testUserEndpoint', msg: 'authorized to access user route'});
});

app.get('/testEndpoint', authService.protect(), (req: express.Request, res: express.Response) => {
  res.json({routeName: '/testEndpoint', msg: 'user is authenticated, no role required for this resource'});
});

app.get('/login', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login',  passport.authenticate('local', { failureRedirect: '/login',
  successReturnToOrRedirect: '/testUserEndpoint'}));

app.listen(3000, function() {
  log.info('Example auth app listening on port 3000');
});
