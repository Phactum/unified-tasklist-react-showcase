# unified-tasklist-react

This is a showcase how to build a unified tasklist using React. In this scenario typically there a several Camunda microservices creating user tasks as part of their business processes. A separate non-Camunda microservice receives/collects events about user tasks created/completed and hosts a unified tasklist GUI.

Here there is only one Spring Boot based Camunda microservice `unified-tasklist-react-mycamundamicroservice` which also acts as the host for the unified tasklist GUI for the sake of simplicity of this showcase.

Read the README.md files of each directory for details about the various parts of the showcase.

## Building

Use Java 11 and Maven to build the microservice along with all UI components:

```
mvn package
```

Afterwards you can run the microservice:

```
java -jar ./unified-tasklist-react-mycamundamicroservice/target/unified-tasklist-react-mycamundamicroservice-0.0.1-SNAPSHOT.jar
```

## Testing

### Creating a user task

Use Camunda's tasklist to start a new business process:

[http://localhost:8080/camunda/app/tasklist/default/#/login](http://localhost:8080/camunda/app/tasklist/default/#/login)

Login with credentials `admin`/`admin` and push the button `Start process` in the header of the tasklist. In the upcoming popup choose `test process mycamundamicroservice` which is a simple business process of the tenant mycamundamicroservice. There is also an item to run the business process without a tenant but this won't work since the tenant is used as a prefix for URLs of each Camunda microservice.

Afterwards enter some sample information and press the `Start`button. Clicking on `All tasks` in the left column will show you the user task created by the business process.

### Completing the user task

Open the unified tasklist UI in the browser using this URL:

[http://localhost:8080/](http://localhost:8080/)

You will see a section `All usertasks`. In this section you will find a link for each user task currently waiting to be completed.

Selecting a linked user task will load the task's UI component on-the-fly and embed it into a section underneath. You can now use the shown form to complete the user task.
