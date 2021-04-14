package at.phactum.tasklist.dataprovider;

import java.util.List;

public interface UserTaskInstanceDataProvider {

	UserTaskInstance byId(String taskId);
	
	/**
	 * All tasks visible for a certain user. A task is visible if a user is
	 * <ul>
	 * <li>the assignee</li>
	 * <li>one of the user candidates</li>
	 * <li>part of one of the group candidates</li>
	 * </ol>
	 * 
	 * @param userId The user's id
	 * @return All tasks visible
	 */
	List<UserTaskInstance> byUser(String userId);
	
}
