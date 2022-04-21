// tslint:disable: no-unused-expression
import Realm from 'realm';

export default class Database {
  static sharedDb = new Database();
  schemaVersion = 1;
  realmInstance: any;

  excludeKeysForUpdate = ['properties', 'metaData', 'id'];
  TaskSchema = {
    name: 'Task',
    properties: {
      _id: 'int',
      name: 'string',
      status: 'string?',
    },
    primaryKey: '_id',
  };
  constructor() {
    this.realmInstance = new Realm({
      path: 'myrealm',
      schema: [this.TaskSchema],
    });
    console.log('realm connection status', this.realmInstance.isClosed);
  }

  // openConnection = async () => {

  // };
}
