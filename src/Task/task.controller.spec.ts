import { Test } from '@nestjs/testing';
import { async } from 'rxjs';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const model = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    controller = model.get<TaskController>(TaskController);
    service = model.get<TaskService>(TaskService);
  });

  // it('should call getTaskByUserEmail', async () => {
  //const spy = jest.spyOn(service, 'getCountTasksOfUserByEmail');
  // await controller.getTasksByUserEmail('email');
  // expect(spy).toHaveBeenCalled();
  // });
});
