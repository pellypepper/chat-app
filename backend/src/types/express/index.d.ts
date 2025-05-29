// src/types/express/index.d.ts

import {User} from '../../model/schema';


declare namespace Express {
  export interface Request {
    user?: User;
  }
}
