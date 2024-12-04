import { Request } from 'express';

interface JwtPayload {
  user: {
    id: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload['user'];
}



export interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}