package at.phactum.tasklist.mycamundamicroservice.myform;

/**
 * This is the data object used by the services.
 * <ul>
 * <li>This class is not the same as the API class
 * {@link at.phactum.tasklist.mycamundamicroservice.api.v1.MyFormDetails}.</li>
 * <li>API classes are specialized to fulfill the needs of API actions (GET,
 * POST, etc.)</li>
 * <li>This class fulfills the needs of the service</li>
 * <li>Sometimes API and service data classes are the same, but even then you
 * should build a copy to decouple your implementation and storage of data from
 * your API. Both might evolve independently over time.</li>
 * </ul>
 */
public class MyFormDetails {

    private String info;

    private String completeAction;

    private String completeComment;

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getCompleteAction() {
        return completeAction;
    }

    public void setCompleteAction(String completeAction) {
        this.completeAction = completeAction;
    }

    public String getCompleteComment() {
        return completeComment;
    }

    public void setCompleteComment(String completeComment) {
        this.completeComment = completeComment;
    }

}
