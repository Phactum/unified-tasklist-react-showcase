package at.phactum.tasklist.mycamundamicroservice.api.v1;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface MyFormkeyApiMapper {

    @Mapping(target = "availableActions", ignore = true)
    @Mapping(target = "myFormInfo", source = "info")
    @Mapping(target = "completedWith.comment", source = "completeComment")
    @Mapping(target = "completedWith.action", source = "completeAction")
    MyFormDetails toApiModel(at.phactum.tasklist.mycamundamicroservice.myform.MyFormDetails input);

}
