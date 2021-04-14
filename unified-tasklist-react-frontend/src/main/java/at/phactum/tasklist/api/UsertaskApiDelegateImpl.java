package at.phactum.tasklist.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import at.phactum.tasklist.dataprovider.UserTaskInstanceDataProvider;
import at.phactum.tasklist.web.api.v1.UserTaskInstance;
import at.phactum.tasklist.web.api.v1.UsertasksApiDelegate;

@Component
public class UsertaskApiDelegateImpl implements UsertasksApiDelegate {

	@Autowired
	private UserTaskInstanceDataProvider dataProvider;
	
	@Autowired
	private UsertaskApiMapper mapper;
	
	@Override
	public ResponseEntity<UserTaskInstance> getUserTaskDetails(String taskId) {
		
		if (taskId == null) {
			return ResponseEntity.badRequest().build();
		}
		
		final var userTask = dataProvider.byId(taskId);
		if (userTask == null) {
			return ResponseEntity.notFound().build();
		}
		
		return ResponseEntity.ok(mapper.toApiModel(userTask));
		
	}
	
	@Override
	public ResponseEntity<List<UserTaskInstance>> getUserTasksDetails() {
		
		final var allUserTasks = dataProvider.byUser(currentUser());
		return ResponseEntity.ok(mapper.toApiModel(allUserTasks));
		
	}
	
	private String currentUser() {

		try {
			final var context = SecurityContextHolder.getContext();
			if (context == null) {
				return null;
			}
			
			final var authentication = context.getAuthentication();
			if (authentication == null) {
				return null;
			}
			
			final var principal = authentication.getPrincipal();
			if (principal == null) {
				return authentication.getName();
			}
	
			// for specialize principals this might be adopted like
			// ((TelefonicaUser) principal).getUserId()
			return principal.toString();
        } catch (RuntimeException e) {
            throw e;
		} catch (Throwable e) {
            throw new RuntimeException("Could not find principal", e);
		}
		
	}

}
