package at.phactum.tasklist.mycamundamicroservice.dataprovider.camunda;

import java.util.List;

import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import at.phactum.tasklist.dataprovider.UserTaskInstance;
import at.phactum.tasklist.dataprovider.UserTaskInstanceDataProvider;

@Component
public class UserTaskInstanceDataProviderImpl implements UserTaskInstanceDataProvider {

    @Autowired
    private HistoryService historyService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserTaskInstanceMapper mapper;

    /**
     * If you access a certain usertask it might happen that this usertask was
     * completed or deleted meanwhile: The user ask the GUI for all open usertask
     * and until she/he chooses on task to view/complete the task was completed by
     * another user or was deleted e.g. by a interrupting timer boundary event.
     * Therefore it is necessary to use the {@link HistoryService} to get usertask
     * information.
     */
    @Override
    public UserTaskInstance byId(final String taskId) {

        final var historicTask = historyService
                .createHistoricTaskInstanceQuery()
                .taskId(taskId)
                .singleResult();
        if (historicTask == null) {
            return null;
        }

        final var runtimeTask = taskService
                .createTaskQuery()
                .taskId(taskId)
                .initializeFormKeys()
                .singleResult();

        return mapper.map(historicTask, runtimeTask);

    }

    @Override
    public List<UserTaskInstance> byUser(final String userId) {

        var taskQuery = taskService
                .createTaskQuery()
                .initializeFormKeys();

        if (userId == null) {
            taskQuery = taskQuery.taskUnassigned();
        } else {
            taskQuery = taskQuery.taskAssignee(userId).or().taskUnassigned();
        }

        final var tasks = taskQuery.list();

        return mapper.map(tasks);

    }

}
