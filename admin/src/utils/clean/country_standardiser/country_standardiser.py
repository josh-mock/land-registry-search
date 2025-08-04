import json
import os

base_dir = os.path.dirname(os.path.abspath(__file__))


class CountryStandardiser:
    def __init__(
        self,
        official_file=os.path.join(base_dir, "jurisdictions.json"),
        corrections_file=os.path.join(base_dir, "corrections.json"),
    ):
        self.official_file = official_file
        self.corrections_file = corrections_file

        self.official_jurisdictions = self._load_official()
        self.corrections_map = self._load_corrections()
        self.ignored_terms = set()

    def _load_official(self):
        with open(self.official_file, "r") as f:
            data = json.load(f)
        return set(data.get("jurisdictions", []))

    def _load_corrections(self):
        if os.path.exists(self.corrections_file):
            with open(self.corrections_file, "r") as f:
                return json.load(f)
        else:
            return {"corrections": []}

    def save_corrections(self):
        with open(self.corrections_file, "w") as f:
            json.dump(self.corrections_map, f, indent=2)

    def save_official_jurisdictions(self):
        with open(self.official_file, "w") as f:
            json.dump(
                {"jurisdictions": sorted(self.official_jurisdictions)}, f, indent=2
            )

    def find_official_name(self, input_term):
        # Exact match
        if input_term in self.official_jurisdictions:
            return input_term

        # Check corrections variations
        for entry in self.corrections_map["corrections"]:
            if input_term in entry["variations"]:
                return entry["official_term"]

        # Check ignored terms
        if input_term in self.ignored_terms:
            return input_term

        # Interactive prompt for correction
        print(f"'{input_term}' is not in the official jurisdiction list.")
        correction = input(
            f"Enter a correction for '{input_term}' or press Enter to keep as-is: "
        ).strip()

        if correction:
            # Add or update correction entry
            for entry in self.corrections_map["corrections"]:
                if entry["official_term"] == correction:
                    if input_term not in entry["variations"]:
                        entry["variations"].append(input_term)
                    break
            else:
                self.corrections_map["corrections"].append(
                    {"official_term": correction, "variations": [input_term]}
                )
            self.save_corrections()
            print()
            return correction
        else:
            add_to_official = (
                input(
                    f"Do you want to add '{input_term}' to the official jurisdictions? (y/n): "
                )
                .strip()
                .lower()
            )
            if add_to_official == "y":
                self.official_jurisdictions.add(input_term)
                self.save_official_jurisdictions()
                print(f"Added '{input_term}' to the official jurisdictions.")
                print()
            else:
                self.ignored_terms.add(input_term)
            print()
            return input_term
