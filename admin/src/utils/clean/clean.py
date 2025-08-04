import polars as pl
from admin.src.utils.clean.country_standardiser import CountryStandardiser


def is_present(col: str):
    return pl.col(col).str.strip_chars().is_not_null() & (
        pl.col(col).str.strip_chars() != ""
    )


def load_dataset(path, columns, dataset_name):
    lf = pl.scan_csv(path).select(columns)

    if dataset_name == "ccod":
        lf = lf.with_columns(
            [
                pl.when(is_present(f"Proprietor Name ({i})"))
                .then(pl.lit("UK"))
                .otherwise(None)
                .alias(f"Country Incorporated ({i})")
                for i in range(1, 5)
            ]
        )
    return lf


def create_lfs(extracted_files, datasets):
    lfs = []

    for dataset_info in datasets:
        dataset_key = dataset_info["dataset_name"]
        columns = dataset_info["columns"]
        path = extracted_files.get(dataset_key)
        lfs.append(load_dataset(path, columns, dataset_key))

    return lfs


def rename_columns(lf: pl.LazyFrame):
    mapping = {
        "Title Number": "title",
        "Property Address": "address",
        "Price Paid": "price",
        **{f"Proprietor Name ({i})": f"proprietor_name_{i}" for i in range(1, 5)},
        **{
            f"Country Incorporated ({i})": f"country_incorporated_{i}"
            for i in range(1, 5)
        },
    }
    return lf.rename(mapping)


def strip_whitespace(lf: pl.LazyFrame):
    return lf.with_columns(
        [
            pl.when(pl.col(col).str.strip_chars() == "")
            .then(None)
            .otherwise(pl.col(col).str.strip_chars())
            .alias(col)
            for col in lf.collect_schema().keys()
        ]
    )


def convert_price_to_string(lf: pl.LazyFrame):
    return lf.with_columns(
        [pl.col("price").cast(pl.Int64, strict=False).alias("price")]
    )


def standardise_company_names(df: pl.DataFrame):
    end_patterns = {
        r"\bSOCIETE\s+ANONYME\b$": "SA",
        r"\bS\s*A\s*$": "SA",
        r"\bLIMITED\b$": "LTD",
        r"\bL\s*T\s*D\s*$": "LTD",
        r"\bLIMITED\s+LIABILITY\s+COMPANY\b$": "LLC",
        r"\bL\s*L\s*C\s*$": "LLC",
        r"\bINCORPORATED\b$": "INC",
        r"\bI\s*N\s*C\s*$": "INC",
        r"\bGESELLSCHAFT\s+MIT\s+BESCHRÄNKTER\s+HAFTUNG\b$": "GMBH",
        r"\bG\s*M\s*B\s*H\s*$": "GMBH",
        r"\bCOMPANY\b$": "CO",
        r"\bC\s*O\s*$": "CO",
        r"\bPUBLIC\s+LIMITED\s+COMPANY\b$": "PLC",
        r"\bP\s*L\s*C\s*$": "PLC",
        r"\bPRIVATE\s+LIMITED\b$": "PTE LTD",
        r"\bSOCIETE\s+A\s+RESPONSABILITE\s+LIMITEE\b$": "SARL",
        r"\bS\s*A\s*R\s*L\s*$": "SARL",
        r"\bLIMITED\s+PARTNERSHIP\b$": "LP",
        r"\bL\s*P\s*$": "LP",
        r"\bLIMITED\s+LIABILITY\s+PARTNERSHIP\b$": "LP",
        r"\bL\s*L\s*P\s*$": "LLP",
        r"\AKTIENGESELLSCHAFT\b$": "AG",
        r"\bA\s*G\s*$": "AG",
        r"\bOSAKEYHTIÖ\b$": "OY",
        r"\bO\s*Y\s*$": "OY",
        r"\AKTIEBOLAG\b$": "AB",
        r"\bA\s*B\s*$": "AB",
        r"\BESLOTEN\s+VENNOOTSCHAP\b$": "BV",
        r"\bB\s*V\s*$": "BV",
        r"\bC\s*O\s*R\s*P\s*$": "CORPORATION",
    }

    name_cols = [f"proprietor_name_{i}" for i in range(1, 5)]

    for col in name_cols:
        df = df.with_columns(pl.col(col).str.to_uppercase())
        df = df.with_columns(
            pl.col(col).str.replace_all(r"[^\w\s&]", "", literal=False)
        )
        df = df.with_columns(pl.col(col).str.replace_all(r"\s+", " ", literal=False))
        df = df.with_columns(pl.col(col).str.strip_chars())

        for pattern, replacement in end_patterns.items():
            df = df.with_columns(
                pl.col(col).str.replace_all(pattern, replacement, literal=False)
            )

    return df


def standardise_countries(df: pl.DataFrame):
    standardiser = CountryStandardiser()
    country_cols = [f"country_incorporated_{i}" for i in range(1, 5)]
    terms = set()

    for col in country_cols:
        terms.update(df.select(pl.col(col)).drop_nulls().unique().to_series().to_list())

    mapping = {term: standardiser.find_official_name(term) for term in terms}

    for col in country_cols:
        df = df.with_columns(pl.col(col).replace(mapping).alias(col))

    return df


def uppercase_all_strings(df: pl.DataFrame):
    string_cols = [col for col, dtype in df.schema.items() if dtype == pl.String]
    return df.with_columns(
        [pl.col(col).str.to_uppercase().alias(col) for col in string_cols]
    )


def clean_address_punctuation(df: pl.DataFrame):
    return df.with_columns(
        pl.col("address")
        .str.replace_all(r"[^\w\s,&-]", "", literal=False)
        .alias("address")
    )


CORRECTION_MAP = {
    "HSBC TRUST COMPANY UK LTD": [
        "HSBC TRUST COMPANYUK LTD",
    ],
    "LLOYDS BANK SF NOMINEES LTD": [
        "LLOYDS BANK S F NOMINEES LTD",
    ],
    "CHURCH COMMISSIONERS FOR ENGLAND": ["CHURCH COMMISSIONERS"],
    "MO FARAH": ["MO FARAH LTD"],
    "NATIONAL HIGHWAYS LTD": [
        "NATIONAL HIGHWAYS COMPANY LTD",
        "HIGHWAYS ENGLAND COMPANY LTD",
    ],
    "EASTERN POWER NETWORKS PLC": [
        "EASTERN POWER NETWORKS PLC",
        "EASTERN ELECTRICITY PLC",
        "EASTERN ELECRICITY PLC",
        "EASTERN ELECTICITY PLC",
        "EASTERN ELECTIRICTY PLC",
        "EASTERN ELECTRCITY PLC",
        "EASTERN ELECTRICTY PLC",
        "EASTERN ELECTRIICTY PLC",
        "EASTERN ELECTRITY PLC",
        "EASTERN ELECTRICICY PLC",
        "EASTERN ELECTRICITY BOARD",
        "EASTERN GROUP PLC",
        "EASTERN ELECTRICITY BOARD PLC",
        "EASTERN ELECTRICITY LTD",
        "EPN DISTRIBUTION LIMITED",
        "EPN DISTRIBUTION PLC",
        "EDF ENERGY NETWORKS (EPN) PLC",
        "EASTERN POWER NETWORKS LTD",
        "EASTERN ELECTRICIY PLC",
        "EASTERN ELECTRIRICTY PLC",
        "EASTERN ELECTRICY PLC",
        "EASTERN ELECTRICIRTY PLC",
        "EASTERN ELECTRICITY GROUP PLC",
        "EASTERN ELECTRICITY",
        "EASTERN ELECTRICTY BOARD",
        "EASTERN POWER NETWORK PLC",
        "EASTERN POWER NETWORKS EPN PLC",
    ],
    "CLARION HOUSING ASSOCIATION LTD": ["CLARION HOUSING ASSOCIATION"],
    "LONDON & QUADRANT HOUSING TRUST": [
        "LONDON & QUADRANT HOUSING TRUST REGISTERED SOCIETY NO 30441R",
        "LONDON & QUADRANT HOUSING TRUST LTD",
        "LONDON & QUADRANT HOUSING TRUST OF OSBORN HOUSE",
        "LONDON & QUADRANT HOUSING TRUST",
        "LONDON & QUADRANT HOUISNG TRUST",
        "LONDON & QUANDRANT HOUSING TRUST",
        "LONDON & QUADRANT HOUSING ASSOCIATION",
        "LONDON & QUADRANT HOMES LTD",
        "LONDON AND QUADRANT TRUST",
        "LONDON AND QUADRANT HOUSING ASSOCIATION",
        "LONDON AND QUARDRANT HOUSING TRUST",
        "LONDON AND QUADRANT HOUSING TRUST",
        "LONDON AND QUANDRANT HOUSING TRUST",
        "LONDON AND QUADRANT HOUSING TRUST LTD",
    ],
    "SOUTH EASTERN POWER NETWORKS PLC": [
        "SOUTH EASTERN POWER NETWORK PLC",
        "SEEBOARD PLC POWER NETWORKS PLC",
        "EDF ENERGY NETWOKS SPN PLC",
        "EDF ENERGY SPN PLC",
    ],
    "SOUTHERN ELECTRIC POWER DISTRIBUTION PLC": [
        "SOUTHERN ELECTRIC DISTRIBUTION PLC",
        "SOUTHERN ELECTRIC POWER DISTIBUTION PLC",
        "SOUTHERN ELECTRIC POWER DISTRICTION PLC",
        "SOUTHERN ELECTRIC POWER DISTRIBUTION PLC",
        "SOUTHERN ELECTRIC POWER DISTRICBUTION PLC",
        "SOUTHERN ELECTRIC POWER DISTRIBURION PLC",
        "SOUTHERN ELECTRIC POWER DISRIBUTION PLC",
    ],
    "WESTERN POWER DISTRIBUTION EAST MIDLANDS PLC": [
        "WESTERN POWER DISTRIBUTION EAST MIDLAND PLC",
        "WESTERN POWER DISTRIBUTION EAST MIDLANDS LTD",
        "WESTERN POWER DISTRIBUTION EAST MIDLANDS PLC",
    ],
}

REVERSE_CORRECTION_MAP = {
    variation.upper(): correct
    for correct, variations in CORRECTION_MAP.items()
    for variation in variations
}


def apply_manual_corrections(df: pl.DataFrame) -> pl.DataFrame:
    name_cols = [f"proprietor_name_{i}" for i in range(1, 5)]

    for col in name_cols:
        df = df.with_columns(pl.col(col).replace(REVERSE_CORRECTION_MAP).alias(col))

    return df


def clean(extracted_files, datasets):
    print("Creating lazy frames...")
    lfs = create_lfs(
        extracted_files=extracted_files,
        datasets=datasets,
    )

    print("Merging lazy frames...")
    lf = pl.concat(lfs)

    print("Renaming columns...")
    lf = rename_columns(lf)

    print("Stripping whitespace...")
    lf = strip_whitespace(lf)

    print("Converting prices to strings...")
    lf = convert_price_to_string(lf)

    print("Creating dataframe...")
    df = lf.collect()

    print("Cleaning address punctuation...")
    df = clean_address_punctuation(df)

    print("Standardising company names...")
    df = standardise_company_names(df)

    print("Standardising jurisdictions...")
    df = standardise_countries(df)

    print("Capitalizing strings...")
    df = uppercase_all_strings(df)

    print("Applying manual corrections...")
    df = apply_manual_corrections(df)

    return df
