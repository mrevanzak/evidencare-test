
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
