package at.phactum.tasklist.mycamundamicroservice.api.v1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import at.phactum.tasklist.mycamundamicroservice.myform.MyFormHandlerService;

@Component
public class MyFormkeyApiDelegateImpl implements MyformkeyApiDelegate {

    private static final Logger logger = LoggerFactory.getLogger(MyFormkeyApiDelegateImpl.class);

    @Autowired
    private MyFormHandlerService service;
    
    @Autowired
    private MyFormkeyApiMapper mapper;
    
    @Override
    public ResponseEntity<MyFormDetails> getDetailsForMyFormUserTask(String taskId) {

        if ((taskId == null) || taskId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        final var details = service.getDetails(taskId);
        if (details == null) {
            return ResponseEntity.notFound().build();
        }

        final var result = mapper.toApiModel(details);
        result.addAvailableActionsItem(MyFormActions.THIS_ACTION)
                .addAvailableActionsItem(MyFormActions.THAT_ACTION);
        
        return ResponseEntity.ok(result);
        
    }

    @Override
    public ResponseEntity<MyFormDetails> completeMyFormUserTask(String taskId,
            MyFormCompleteDetails myFormCompleteDetails) {

        if ((taskId == null) || taskId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if ((myFormCompleteDetails == null)
                || (myFormCompleteDetails.getAction() == null)) {
            return ResponseEntity.badRequest().build();
        }
        
        service.complete(taskId,
                myFormCompleteDetails.getAction().name(),
                myFormCompleteDetails.getComment());
        
        logger.info("Completed task '{}' with action '{}' and comment: '{}'",
                taskId,
                myFormCompleteDetails.getAction(),
                myFormCompleteDetails.getComment());

        return getDetailsForMyFormUserTask(taskId);

    }

}
