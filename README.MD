# Land Registry Search

This web app is a non-commercial searchable database of two datasets published by the HM Land Registry:

- Overseas companies that own property in England and Wales dataset ("OCOD"): a list of freehold or leasehold title registrations held by HM Land Registry, covering England and Wales, where the registered legal owner is an overseas company (a company incorporated outside of the UK).

- UK companies that own property in England and Wales ("CCOD"): a list of freehold or leasehold registered titles in England and Wales, where the registered legal owner of the land is a non-private individual.

The app cleans and merges the data, making it easy to search for properties in the UK owned by companies.

## Tech Stack

### Backend / Data Processing

- [Python](https://www.python.org/)
- [Polars](https://pola.rs/)
- [PostgreSQL](https://www.postgresql.org/)
- [Psycopg2](https://pypi.org/project/psycopg2/)
- [python-dotenv](https://pypi.org/project/python-dotenv/)

### Frontend

- [Next.js](https://nextjs.org/)
- [TanStack Table](https://tanstack.com/table/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [Axios](https://axios-http.com/)
- [Yup](https://github.com/jquense/yup)
- [Lodash](https://lodash.com/)

### Database

- [PostgreSQL](https://www.postgresql.org/)

## Installation and setup

1. Clone the repository.

```bash
git clone https://github.com/username/repository.git
```

2. Navigate to the `admin` folder.

```bash
cd land-registry-search/admin
```

3. Create and activate a virtual environment (optional).

```bash
python -m venv venv
source venv/bin/activate
```

4. Install python dependencies

```bash
pip install -r requirements.txt
```

5. Sign up for an [HM Land Registry](https://use-land-property-data.service.gov.uk/) API key.

6. Create a new PostgreSQL database for your project using the schema in `schema.sql`.

7. Create a `.env` file and fill in the variables according to the template found in `.env.example`.

8. If making a demo version, you can update the companies you wish to include in `config.json` (optional).

9. Navigate to the repo root and run the programme. Repeat this each time you want to update the database (e.g. when the latest datasets are released). If building a demo version, use the flag `-d` or `--demo`.

```bash
cd ..
python -m admin.src.db_manager
# Or python -m admin.src.db_manager --demo
```

10. Navigate to the `web` directory to setup the frontend.

```bash
cd web
npm install
```

11. If running locally, create a `.env.local` file and fill in the variables according to the template found in `.env.local.example`.

12. Build and run.

```bash
npm run build
npm run start
```

## Usage

- From the repo root, navigate to the `web` directory and start the server.

```bash
cd web
npm start
```

- Enter a either a company name or title number that you'd like to search.

- The app then provides a table of results. You can filter this table using the search bar directly above.

- You can also click on a column heading to change the order of the results (ascending, descending, or default).

- Click on an item in the first column to run a search for that item in a new tab. In a company search result, this will run a title search on the selected title number. For a title search result, this will run a company search on the selected company.

- The demo version of this project uses a sample dataset. The companies included in the app can be found in the "top 10 proprietors" tab.

## Acknowledgements

HM Land Registry data: Information produced by HM Land Registry © Crown copyright 2025.

## License

This project is licensed under the [MIT License](LICENSE).
