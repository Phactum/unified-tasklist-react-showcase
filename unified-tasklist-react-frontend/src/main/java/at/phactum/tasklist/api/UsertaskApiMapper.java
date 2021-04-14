package at.phactum.tasklist.api;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import at.phactum.tasklist.web.api.v1.UserTaskInstance;

@Mapper
public interface UsertaskApiMapper {

    @Mapping(target = "readOnly", expression = "java(!(input.getStatus() != null && input.getStatus() == at.phactum.tasklist.dataprovider.UserTaskInstance.Status.ACTIVE))")
    UserTaskInstance toApiModel(at.phactum.tasklist.dataprovider.UserTaskInstance input);

    List<UserTaskInstance> toApiModel(List<at.phactum.tasklist.dataprovider.UserTaskInstance> input);
	
}
