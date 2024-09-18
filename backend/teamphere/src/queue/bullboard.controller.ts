import { Controller } from '@nestjs/common';
import { BullBoardInstance, InjectBullBoard } from '@bull-board/nestjs';

@Controller('messageQueue')
export class FeatureController {
  constructor(
    @InjectBullBoard() private readonly boardInstance: BullBoardInstance,
  ) {}
}
