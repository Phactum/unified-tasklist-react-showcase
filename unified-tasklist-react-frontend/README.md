# unified-tasklist-react-frontend

This is a tasklist GUI for Camunda based microservices. This artifact can be used as a dependency. The GUI will be available at the URL of your microservice.

This GUI does not combine data of independent microservices. It's primary goal is to show the way React  components for viewing user tasks can be loaded at runtime.

The GUI uses one REST-API to load available user tasks which is fed by a component implementing the interface `UserTaskInstanceDataProvider`. So one can embed this frontend into a Camunda microservice and load user tasks from Camunda's `TaskService` or `HistoryService` (e.g. `unified-tasklist-react-mycamundamicroservice`).

## Usage in environments of many individual microservices

Instead of embedding this GUI into a Camunda microservice it also can be used in a unified tasklist microservice.

The implementation of the interface `UserTaskInstanceDataProvider` would use an independent database instead of Camunda's storage (as there is more than one Camunda instance). This database has to be filled by data of each Camunda microservice based on Camunda events (e.g. "task created", "task claimed", "task completed" and so on) or Camunda's HistoryStream to hold the storages in sync. In addition it is recommended to use a database which is more specialized on searching content (e.g. ElasticSearch or MongoDb) to achieve a better user experience.

## Usage

### If you use the frontend in a microservice

Add the project as a Maven dependency to the Spring boot sub-module of your microservice:

```
<dependency>
	<groupId>at.phactum.tasklist.web</groupId>
	<artifactId>unified-tasklist-react-frontend</artifactId>
	<version>${unified-tasklist-react-frontend.version}</version>
</dependency>
```

Extend your application.yml by these lines:

```
spring:
    application:
        # see at.phactum.tasklist.tools.common.web.SpaNoHandlerFoundExceptionHandler
        spa-default-file: classpath:/static/frontend/index.html
    mvc:
        # see at.phactum.tasklist.tools.common.web.SpaNoHandlerFoundExceptionHandler
        throw-exception-if-no-handler-found: true
    resources:
        # see at.phactum.tasklist.tools.common.web.SpaNoHandlerFoundExceptionHandler
        add-mappings: false
```

The application can be accessed in the browser using the prefix configured in your microservice's application.yml: 

```
server:
    port: 8080
    servlet:
        context-path: /
```

means `http://localhost:8080/`.

### IDE integration

If you like to run your microservice in your favorite IDE and open the frontend in your browser then you have to run

```
npm run build
```

in the project `unified-tasklist-react-frontend`.

### Life updates for frontend development

If you like to use life updates you have to run

```
npm start
```

in addition to starting your Camunda microservice. Once started you can run the application by using the URL `http://localhost:4200/`.
