# To Do:

- [x] Incorporate `host-csrf` package to fix CSRF vulnerability
- [x] Have the following routes usable from a web browser:
  - [x] GET /jobs (display all the job listings belonging to this user)
  - [x] POST /jobs (Add a new job listing)
  - [x] GET /jobs/new (Put up the form to create a new entry)
  - [x] GET /jobs/edit/:id (Get a particular entry and show it in the edit box)
  - [x] POST /jobs/update/:id (Update a particular entry)
  - [x] POST /jobs/delete/:id (Delete an entry)
- [ ] Have the browser update based on changes and calls to the routes above.
