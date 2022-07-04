# Devices Registry

A service to manage customer's devices and their access to the platform.

## Installation

All dependencies for the project are present in a docker compose file, so no installation is necessary :)

## Running the project

From the root folder, run the command `make run` on a terminal window and everything will be setup:

- MongoDB will be configured to run on port `27017`
- Mongo Express will be configured to run on `localhost:8081` - use it to check the documents created in our local
  MongoDB
  installation :D
- The service itself will run on `localhost:8000` (configurable)

## Endpoints

The following endpoints are provided by the api:

### `GET` /users/:userId/devices

Returns all devices for a specific user.

### `GET` /users/:userId/devices/:id

Returns a specific device associated to a user.

### `POST` /users/:userId/devices

Creates a new device.

Request body:

```json
{
  "name": "Android"
}
```

### `PATCH` /users/:userId/devices/:id/

Updates a device.

Request body:

```json
{
  "name": "Android Plus",
  "playable": true
}
```

Both `name` and `playable` are optional. If `playable` is defined as `true`, an entitlement check is done to see if the
current user has available device slots.

### `DELETE` /users/:userId/devices/:id/

Deletes a device associated to a user.

## Running the tests

You can run the tests with coverage reporting via `make tests`. Running the tests in dev mode with watch enabled is also
possible via `npm run test:dev`. 