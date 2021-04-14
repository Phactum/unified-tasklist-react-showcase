package at.phactum.tasklist.mycamundamicroservice.myform;

import java.util.HashMap;
import java.util.stream.Collectors;

import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.history.HistoricVariableInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MyFormHandlerService {

    @Autowired
    private HistoryService historyService;

    @Autowired
    private TaskService taskService;

    private static class NoValue {
        public static NoValue instance = new NoValue();

        @Override
        public String toString() {
            return null;
        }
    }

    public MyFormDetails getDetails(final String taskId) {

        // use HistoryService instead of TaskService: the task might be already
        // completed.
        // hint: TaskService only provides runtime information hence about tasks not
        // completed or cancelled.
        final var task = historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
        if (task == null) {
            return null;
        }

        // retrieve variables of the process instance
        final var variables = historyService
                .createHistoricVariableInstanceQuery()
                .processInstanceId(task.getProcessInstanceId())
                .list()
                .stream()
                .collect(Collectors.toMap(HistoricVariableInstance::getName, HistoricVariableInstance::getValue));

        final var result = new MyFormDetails();
        // usually information is not stored as a process variable. for this show-case
        // this is fine.
        result.setInfo(variables.getOrDefault("Info", NoValue.instance).toString());
        if (task.getEndTime() != null) {
            result.setCompleteAction(variables.getOrDefault("ComleteAction", NoValue.instance).toString());
            result.setCompleteComment(variables.getOrDefault("ComleteComment", NoValue.instance).toString());
        }
        return result;

    }

    public void complete(final String taskId, String action, String comment) {

        final var variables = new HashMap<String, Object>();
        variables.put("ComleteAction", action);
        variables.put("ComleteComment", comment);
        taskService.complete(taskId, variables);

    }

}
