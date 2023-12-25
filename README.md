
<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/melogtm/book-note">
    <img src="https://github.com/melogtm/book-note/blob/main/public/img/project_view.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">Book Note</h3>

  <p align="center">
    CRUD Project to exercise integrating Postgres + NodeJs + Express. 
  </p>
</div>

## About This Project
In this project, you can add a book you've read informing your rating, as well read date. You can also add notes about your lecture with this book, editing it or deleting entries as well.

Sorting is available based on rating, name and read date.

### What I've Learned
Besides using PostgreSQL for persistent storage, I've used environment variables to hide sensitive information to be uploaded on Github.

#### Built With, as well as "Prerequisites"

* <a href="https://nodejs.org/en">NodeJS</a>
* <a href="https://www.npmjs.com/">npm</a>
* <a href="https://www.postgresql.org/">PostgreSQL</a> 
* <a href="https://getbootstrap.com/">Bootstrap</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up your environment variables for postgresql user, host, database and password as it shows in <a href="https://github.com/melogtm/book-note/blob/main/database/database.js">database config</a> 
   ```sh
   touch .env 
   ```
4. Start
   ```sh
   node index.js (or npm run dev if you have nodemon) 
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
