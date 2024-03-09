
## Running the app

### Node.js

1. Clone the repository
2. Run `pnpm install` to install the dependencies
3. Run `pnpm start` to start the app
4. App will be running on `http://localhost:3000`

### Docker

1. Clone the repository
2. build the docker image using `docker build -t <image-name> .`
3. Run the docker container using `docker run -p 3000:3000 <image-name>`
4. App will be running on `http://localhost:3000`

## API Endpoints

- GET `/employees` - Get all employees
- GET `/employees?search=<search>` - Get employees either by name or id
- GET `/employees/managers?search=<search>` - Get the searched employee's managers all the way to the top
- GET `/employees/:id` - Get employee by id
- GET `/employees/:id/direct-reports` - Get the direct reports of the employee
- GET `/employees/:id/direct-reports/count` - Get the count of direct reports of the employee
- GET `/employees/:id/indirect-reports` - Get the indirect reports of the employee
- GET `/employees/:id/indirect-reports/count` - Get the count of indirect reports of the employee
- POST `/employees` - Add new employee
- POST `/employees/bulk` - Add multiple employees
- DELETE `/employees/:id` - Delete employee by id

## Screenshoots

the example was using `correct-employees.json` data
<img width="1470" alt="image" src="https://github.com/mrevanzak/evidencare-test/assets/73029778/14f07213-2f38-452d-a108-9d626bd3c986">
<img width="1470" alt="image" src="https://github.com/mrevanzak/evidencare-test/assets/73029778/52e24bf6-2404-400a-9e04-e395669fbbb0">
<img width="1470" alt="image" src="https://github.com/mrevanzak/evidencare-test/assets/73029778/5100e3fd-8f43-4f80-8ec6-e45a3b44b140">
<img width="1470" alt="image" src="https://github.com/mrevanzak/evidencare-test/assets/73029778/c32973b8-0b26-4db4-a2a5-8b73152ab4d5">
<img width="1470" alt="image" src="https://github.com/mrevanzak/evidencare-test/assets/73029778/26f164c8-d340-428e-893e-af94129b8400">
<img width="1470" alt="image" src="https://github.com/mrevanzak/evidencare-test/assets/73029778/a5d9dc6b-a266-45d8-859b-7c68886f6f50">
<img width="1470" alt="image" src="https://github.com/mrevanzak/evidencare-test/assets/73029778/3496b03d-b24d-4ae4-a2a5-fed588fbc079">
<img width="1470" alt="image" src="https://github.com/mrevanzak/evidencare-test/assets/73029778/cb1259cb-f69f-41d0-bea5-4b936c30c674">
<img width="1470" alt="image" src="https://github.com/mrevanzak/evidencare-test/assets/73029778/065f66cd-41f6-4762-9749-dca2ac88984a">







