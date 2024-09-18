import { Controller, Get } from '@nestjs/common';

@Controller('/api')
export class AppController {
  constructor() {}
  @Get()
  async get() {
    return {
      hello: 'GREAT',
    };
  }
}
