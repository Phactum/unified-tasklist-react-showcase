package at.phactum.tasklist.mycamundamicroservice.dataprovider.camunda;

import java.util.List;

import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.history.HistoricTaskInstance;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.model.bpmn.impl.BpmnModelConstants;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import at.phactum.tasklist.dataprovider.UserTaskInstance;
import at.phactum.tasklist.dataprovider.UserTaskInstance.Status;

@Mapper
public abstract class UserTaskInstanceMapper {

    @Autowired
    private RepositoryService repositoryService;

    @Mapping(target = "id", expression = "java(historicTask != null ? historicTask.getId() : runtimeTask.getId())")
    @Mapping(target = "assignee", expression = "java(historicTask != null ? historicTask.getAssignee() : runtimeTask.getAssignee())")
    @Mapping(target = "tenant", expression = "java(historicTask != null ? historicTask.getTenantId() : runtimeTask.getTenantId())")
    @Mapping(target = "processInstanceId", expression = "java(historicTask != null ? historicTask.getProcessInstanceId() : runtimeTask.getProcessInstanceId())")
    @Mapping(target = "formKey", expression = "java(determineFormKey(historicTask, runtimeTask))")
    @Mapping(target = "status", expression = "java(determineStatus(historicTask, runtimeTask))")
    public abstract UserTaskInstance map(HistoricTaskInstance historicTask, final Task runtimeTask);

    @Mapping(target = "status", expression = "java(determineStatus(null, runtimeTask))")
    @Mapping(target = "tenant", source = "tenantId")
    public abstract UserTaskInstance map(final Task runtimeTask);

    public abstract List<UserTaskInstance> map(final List<Task> runtimeTask);

    protected String determineFormKey(final HistoricTaskInstance historicTask, final Task runtimeTask) {

        if (runtimeTask != null) {
            return runtimeTask.getFormKey();
        }

        final var bpmnModelInstance = repositoryService.getBpmnModelInstance(historicTask.getProcessDefinitionId());

        org.camunda.bpm.model.bpmn.instance.Task task = bpmnModelInstance
                .getModelElementById(historicTask.getTaskDefinitionKey());
        return task.getAttributeValueNs(BpmnModelConstants.CAMUNDA_NS, "formKey");

    }

    protected Status determineStatus(final HistoricTaskInstance historicTask, final Task runtimeTask) {

        if (runtimeTask != null) {

            if (runtimeTask.isSuspended()) {
                return Status.SUSPENDED;
            }

            return Status.ACTIVE;

        }

        if ("completed".equals(historicTask.getDeleteReason())) {
            return Status.COMPLETED;
        }

        return Status.CANCELLED;

    }

}
