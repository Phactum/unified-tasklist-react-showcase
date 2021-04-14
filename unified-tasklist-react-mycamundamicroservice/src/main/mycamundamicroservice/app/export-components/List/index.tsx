import * as React from 'react';
import { ExportComponents } from '@unified-tasklist/common/types/tasklist-types';

export const MyList: React.FC<ExportComponents.ListProps> = ({ index, isLastRow, isLastCell, task, clientBasePath }) => {
  if (!task || !task.task) {
    return <div>loading...</div>;
  }

  return (
    <div>${task.formKey}</div>
  );
};
