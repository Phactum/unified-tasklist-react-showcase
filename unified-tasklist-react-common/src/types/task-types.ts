export declare namespace Task {

  enum TaskeStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
  }

  interface Task {
    id: string;
    tenant: string;
    assignee: string;
    formKey: string;
    readOnly: boolean;
    task: any; // type has to be defined
    status: TaskeStatus;
    processInstanceId: string;
  }

}
