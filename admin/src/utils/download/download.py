import requests
import os
import zipfile


def get_file_paths(datasets, land_reg_base_url, land_reg_headers):
    file_paths = []

    for dataset in datasets:
        url = f"{land_reg_base_url}/datasets/{dataset['dataset_name']}"
        response = requests.get(url, headers=land_reg_headers)
        result = response.json()
        resources = result["result"]["resources"]
        file_path = resources[1]["file_name"]
        file_paths.append({"dataset": dataset["dataset_name"], "file": file_path})

    return file_paths


def download_files(file_paths, temp_dir, land_reg_base_url, land_reg_headers):
    downloaded_paths = {}

    for file_info in file_paths:
        dataset = file_info["dataset"]
        file = file_info["file"]
        url = f"{land_reg_base_url}/datasets/{dataset}/{file}"

        response = requests.get(url, headers=land_reg_headers)
        response.raise_for_status()
        data = response.json()

        download_url = data["result"]["download_url"]
        resource_name = data["result"]["resource"]

        download_response = requests.get(download_url, stream=True)
        download_response.raise_for_status()

        os.makedirs(temp_dir, exist_ok=True)
        path_to_file = os.path.join(temp_dir, resource_name)

        with open(path_to_file, "wb") as f:
            for chunk in download_response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        downloaded_paths[dataset] = path_to_file

    return downloaded_paths


def unzip(downloaded_paths_dict, temp_dir):
    extracted_files = {}

    for dataset, zip_path in downloaded_paths_dict.items():
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(temp_dir)
            for name in zip_ref.namelist():
                if not name.endswith("/"):
                    extracted_files[dataset] = os.path.join(temp_dir, name)
                    break

    return extracted_files


def download(land_reg_base_url, land_reg_headers, datasets, temp_dir):
    print("Getting file paths...")
    file_paths = get_file_paths(
        land_reg_base_url=land_reg_base_url,
        land_reg_headers=land_reg_headers,
        datasets=datasets,
    )

    print("Downloading files...")
    dowloaded_paths = download_files(
        file_paths=file_paths,
        temp_dir=temp_dir,
        land_reg_base_url=land_reg_base_url,
        land_reg_headers=land_reg_headers,
    )

    print("Extracting files...")
    extracted_files = unzip(temp_dir=temp_dir, downloaded_paths_dict=dowloaded_paths)

    return extracted_files
