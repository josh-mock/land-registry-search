import polars as pl
import os
import json


def filter_dfs_for_demo_fixed(
    dfs_dict: dict[str, pl.DataFrame], proprietors_to_include: list[str]
) -> dict[str, pl.DataFrame]:
    # 1. Filter proprietors_df to keep only rows where proprietor_name is in the list
    proprietors_df = dfs_dict["proprietors"].filter(
        pl.col("proprietor_name").is_in(proprietors_to_include)
    )

    # 2. Extract the ids of these filtered proprietors (to use for joins)
    proprietor_ids = proprietors_df.select("id").to_series().to_list()

    # 3. Filter titles_proprietors_df to keep only rows where proprietor_id is in the filtered proprietor_ids
    titles_proprietors_df = dfs_dict["titles_proprietors"].filter(
        pl.col("proprietor_id").is_in(proprietor_ids)
    )

    # 4. Extract the unique title_ids associated with those filtered proprietors
    title_ids = titles_proprietors_df.select("title_id").to_series().unique()

    # 5. Filter titles_df to keep only rows where the id is in the filtered title_ids
    titles_df = dfs_dict["titles"].filter(pl.col("id").is_in(title_ids))

    # 6. Return the filtered DataFrames as a dict with the same keys as input
    return {
        "proprietors": proprietors_df,
        "titles": titles_df,
        "titles_proprietors": titles_proprietors_df,
    }


def create_titles_table(combined_df: pl.DataFrame):
    return (
        combined_df.select(["title", "address", "price"])
        .unique(subset=["title"])
        .with_row_index("id", offset=1)
    )


def create_proprietors_table(combined_df: pl.DataFrame):
    proprietor_dfs = []
    for i in range(1, 5):
        name_col = f"proprietor_name_{i}"
        country_col = f"country_incorporated_{i}"
        proprietor_dfs.append(
            combined_df.select(
                [
                    pl.col(name_col).alias("proprietor_name"),
                    pl.col(country_col).alias("jurisdiction"),
                ]
            ).filter(pl.col("proprietor_name").is_not_null())
        )

    proprietors_df = (
        pl.concat(proprietor_dfs)
        .unique(subset=["proprietor_name", "jurisdiction"])
        .with_row_index("id", offset=1)
    )

    return proprietors_df


def create_titles_proprietors_table(
    combined_df: pl.DataFrame,
    titles_df: pl.DataFrame,
    proprietors_df: pl.DataFrame,
):
    proprietor_dfs = []
    for i in range(1, 5):
        proprietor_dfs.append(
            combined_df.select(
                [
                    "title",
                    pl.col(f"proprietor_name_{i}").alias("proprietor_name"),
                    pl.col(f"country_incorporated_{i}").alias("jurisdiction"),
                ]
            ).filter(pl.col("proprietor_name").is_not_null())
        )
    proprietors_all = pl.concat(proprietor_dfs)

    # Join proprietors_all with proprietors_df to get proprietor_id
    proprietors_all = proprietors_all.join(
        proprietors_df, on=["proprietor_name", "jurisdiction"]
    )

    # Join with titles_df to get title_id
    pairs_df = proprietors_all.join(titles_df.select(["title", "id"]), on="title")

    # Select title_id and proprietor_id columns
    return pairs_df.unique().select(
        [pl.col("id").alias("proprietor_id"), pl.col("id_right").alias("title_id")]
    )


def create_dfs_dict(combined_df: pl.DataFrame):
    print("Creating titles dataframe...")
    titles_df = create_titles_table(combined_df=combined_df)

    print("Creating proprietors dataframe...")
    proprietors_df = create_proprietors_table(combined_df=combined_df)

    print("Creating titles proprietors dataframe...")
    titles_proprietors_df = create_titles_proprietors_table(
        combined_df=combined_df, titles_df=titles_df, proprietors_df=proprietors_df
    )

    return {
        "proprietors": proprietors_df,
        "titles": titles_df,
        "titles_proprietors": titles_proprietors_df,
    }


def convert_dfs_to_csvs(dfs_dict: dict[str, pl.DataFrame], chunk_size: int, temp_dir):
    csvs = {}

    for table, df in dfs_dict.items():
        num_chunks = (len(df) + chunk_size - 1) // chunk_size
        output_paths = []

        for i in range(num_chunks):
            start = i * chunk_size
            chunk = df.slice(start, chunk_size)
            filename = f"{table}_chunk_{i:03d}.csv"
            filepath = os.path.join(temp_dir, filename)
            chunk.write_csv(filepath)
            output_paths.append(filepath)

        csvs[table] = output_paths

    return csvs


def split(df: pl.DataFrame, chunk_size: int, temp_dir, is_demo: bool, demo_proprietors):
    if is_demo:
        dfs_dict = create_dfs_dict(df)

        dfs_dict = filter_dfs_for_demo_fixed(dfs_dict, demo_proprietors)
    else:
        dfs_dict = create_dfs_dict(df)

    csv_files_dict = convert_dfs_to_csvs(
        dfs_dict=dfs_dict, chunk_size=chunk_size, temp_dir=temp_dir
    )
    return csv_files_dict
