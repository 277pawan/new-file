import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class ApitokenCheckMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Set CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Check if it's a preflight request (OPTIONS) and respond accordingly
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Invalid token.' });
      }

      const user = await this.usersService.verifyToken(token);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Attach user object to request for use in other functions
      (req as any).user = user;
      next();
    }
  }
}
