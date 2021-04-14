# My Camunda Microservice

This is a sample of a Camunda microservice running a process which also has a user task to be completed.

In this showcase this microservice also hosts the tasklist GUI. The given implementation of the data provider `UserTaskInstanceDataProviderImpl` uses the Camunda API to load user task details. This is only for the sake of simplicity of this showcase. Usually there is a separate tasklist microservice which receives and collects data user tasks of various Camunda microservices. For more details see README.md of `unified-tasklist-react-frontend`.
