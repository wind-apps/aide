import { publicProcedure, router } from './trpc';
import {type} from 'arktype'
import { observable } from '@trpc/server/observable';
import EventEmitter from 'node:events'


const user = type({
  id: 'number',
  name: 'string'
})

type User = typeof user.infer

const users: User[] = [
  {
    id: 1,
    name: 'Travis'
  },
  {
    id: 2,
    name: 'James'
  },
  {
    id: 3,
    name: 'Jessa'
  },
];

const ee = new EventEmitter();

export const appRouter = router({
  userList: publicProcedure
    .query(async () => {
      // Retrieve users from a datasource, this is an imaginary database


      return users;
    }),
  userById: publicProcedure
  .input(type({ id: 'number' }).assert)
  .query(({ input }) => {
    return users.find(user => user.id === input.id)
  }),
  userCreate: publicProcedure
  .input(user.assert)
  .mutation(({ input }) => {
    users.push(input)
    console.log('emitting event')
    ee.emit('add', input);
    return input
  }),
  userSub: publicProcedure.subscription(() => {
    return observable<User>((emit) => {
      const onAdd = (data: User) => {
        console.log('recieved event', data)
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on('add', onAdd);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off('add', onAdd);
      };
    });
  })
});

export type AppRouter = typeof appRouter;
