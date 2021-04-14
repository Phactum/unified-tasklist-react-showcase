import React, { useEffect, useState } from 'react';
import { ExportComponents } from '@unified-tasklist/common/types/tasklist-types';
import { getMyformkeyApi } from 'app/api/MyFormApi';
import { MyFormActions } from 'client/models';

export const MyForm: React.FC<ExportComponents.FormProps> = props => {
  
  const { task, lastUpdateTimestamp } = props;
  const [ details, setDetails ] = useState(undefined);
  const [ readOnly, setReadOnly ] = useState(task.readOnly);
  const [ comment, setComment ] = useState(undefined);

  const myFormkeyApi = getMyformkeyApi(props.clientBasePath);

  useEffect(() => {
    loadDetails();
  }, [task]);

  const loadDetails = async () => {
    const details = await myFormkeyApi.getDetailsForMyFormUserTask({ taskId: task.id });
    setDetails(details);
    setComment(details?.completedWith?.comment);
  };

  const completeTask = async (action: string) => {
    const newDetails = await myFormkeyApi.completeMyFormUserTask({
        taskId: task.id,
        myFormCompleteDetails: { action: action as MyFormActions, comment }
      });
    setDetails(newDetails);
    setReadOnly(true);
  };

  if (! details) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <p>Mycamundamicroservice MyForm works! Task is { task.status }.</p>
      <ul>
        <li>Info: { details?.myFormInfo || 'undefined' }</li>
      </ul>
      <p>
        Comment:
        <textarea disabled={ readOnly } onChange={ e => setComment(e.target.value) }>{ comment }</textarea>
      </p>
      {
        details?.availableActions?.map(action => <button
            key={ action }
            onClick={ async () => completeTask(action) }
            style={{ backgroundColor: details?.completedWith?.action === action ? 'green' : 'light-grey'}}
            disabled={ readOnly }>{ action }</button>)
      }
    </div>
  );
};
