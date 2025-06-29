// src/types/express/index.d.ts

import {users} from '../../model/schema';
import { User } from '../type';


declare namespace Express {
  export interface Request {
    user?: User;
  }
}
