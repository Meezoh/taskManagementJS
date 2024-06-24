import { userTable } from '../model/userTable.js';
import { taskTable } from '../model/taskTable.js';
import { verifyUserTable } from '../model/verifyUserTable.js';

export const createTables = async () => {
  await userTable();
  await taskTable();
  await verifyUserTable();
};
