import os
from dotenv import load_dotenv
import json
from admin.src.utils.download import download
from admin.src.utils.clean import clean
from admin.src.utils.split import split
import tempfile
from admin.src.utils.insert import insert
import argparse

parser = argparse.ArgumentParser(
    description="Configure the database for the Land Registry Search app"
)

parser.add_argument(
    "-d",
    "--demo",
    action="store_true",
    help="Create a database for use in a web-based demo.",
)
args = parser.parse_args()

config_path = os.path.join(os.path.dirname(__file__), "..", "config.json")
config_path = os.path.abspath(config_path)

with open(config_path) as f:
    config = json.load(f)

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)


land_reg_base_url = config["land_reg"]["base_url"]
land_reg_api_key = os.getenv("LAND_REG_KEY")
land_reg_headers = {
    "Authorization": land_reg_api_key,
    "Accept": config["land_reg"]["accept"],
}
datasets = config["land_reg"]["datasets"]
demo_proprietors = config["demo_proprietors"]
chunk_size = config["tables"]["chunk_size"]

DB_USER_PRODUCTION = os.getenv("DB_USER_PRODUCTION")
DB_PASSWORD_PRODUCTION = os.getenv("DB_PASSWORD_PRODUCTION")
DB_HOST_PRODUCTION = os.getenv("DB_HOST_PRODUCTION")
DB_PORT_PRODUCTION = os.getenv("DB_PORT_PRODUCTION")
DB_NAME_PRODUCTION = os.getenv("DB_NAME_PRODUCTION")

DB_USER_DEMO = os.getenv("DB_USER_DEMO")
DB_PASSWORD_DEMO = os.getenv("DB_PASSWORD_DEMO")
DB_HOST_DEMO = os.getenv("DB_HOST_DEMO")
DB_PORT_DEMO = os.getenv("DB_PORT_DEMO")
DB_NAME_DEMO = os.getenv("DB_NAME_DEMO")

production_consts = {
    "DB_USER": DB_USER_PRODUCTION,
    "DB_PASSWORD": DB_PASSWORD_PRODUCTION,
    "DB_HOST": DB_HOST_PRODUCTION,
    "DB_PORT": DB_PORT_PRODUCTION,
    "DB_NAME": DB_NAME_PRODUCTION,
}

demo_consts = {
    "DB_USER": DB_USER_DEMO,
    "DB_PASSWORD": DB_PASSWORD_DEMO,
    "DB_HOST": DB_HOST_DEMO,
    "DB_PORT": DB_PORT_DEMO,
    "DB_NAME": DB_NAME_DEMO,
}


def main():

    database_consts = demo_consts if args.demo else production_consts

    with tempfile.TemporaryDirectory() as temp_dir:
        extracted_files = download(
            land_reg_base_url=land_reg_base_url,
            land_reg_headers=land_reg_headers,
            datasets=datasets,
            temp_dir=temp_dir,
        )

        df = clean(
            extracted_files=extracted_files,
            datasets=datasets,
        )

        csvs_dict = split(
            df=df,
            chunk_size=chunk_size,
            temp_dir=temp_dir,
            is_demo=args.demo,
            demo_proprietors=demo_proprietors,
        )

        insert(csvs_dict=csvs_dict, database_consts=database_consts)


if __name__ == "__main__":
    main()
