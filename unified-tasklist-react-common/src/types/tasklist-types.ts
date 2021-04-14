import * as React from 'react';
import { Task as TaskTypes } from './task-types';

export namespace ExportComponents {

    export interface FormProps {
        task: TaskTypes.Task;
        clientBasePath?: string;
        lastUpdateTimestamp?: number;
    }

    export interface ListProps {
        index?: number;
        isLastRow?: boolean;
        isLastCell?: boolean;
        task?: TaskTypes.Task;
        clientBasePath?: string;
    }

    export interface ComponentCollection {
        Form: React.FC<FormProps>;
    }

    export interface ListCollection {
        List: React.FC<ListProps>;
    }

}
