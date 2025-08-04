import styles from "./About.module.css";

export default function About() {
  return (
    <>
      <div className={`${styles.about} container`}>
        <h2 className={"h2"}>About</h2>
        <section className={styles.about__section}>
          <p>
            This web app is a non-commercial searchable database of two datasets
            published by the HM Land Registry:
          </p>
          <ul className={styles.about__list}>
            <li className={styles.about__listItem}>
              <span>
                <strong>
                  Overseas companies that own property in England and Wales
                  dataset ("OCOD")
                </strong>
                : a list of freehold or leasehold title registrations held by HM
                Land Registry, covering England and Wales, where the registered
                legal owner is an overseas company (a company incorporated
                outside of the UK).
              </span>
            </li>
            <li className={styles.about__listItem}>
              <span>
                <strong>
                  UK companies that own property in England and Wales ("CCOD")
                </strong>
                : a list of freehold or leasehold registered titles in England
                and Wales, where the registered legal owner of the land is a
                non-private individual.
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.about__section}>
          <h3 className={styles.about__sectionTitle}>Data included</h3>
          <p>
            This tool is designed to be used in conjunction with title searches
            at HM Land Registry. To that end, the app only uses the following
            columns from the datasets:
          </p>
          <ul className={styles.about__list}>
            <li className={styles.about__listItem}>Proprietor names</li>
            <li className={styles.about__listItem}>
              Proprietor countries of incorporation
            </li>
            <li className={styles.about__listItem}>Price last paid</li>
            <li className={styles.about__listItem}>Title number</li>
            <li className={styles.about__listItem}>Address</li>
          </ul>
        </section>

        <section className={styles.about__section}>
          <h3 className={styles.about__sectionTitle}>How to Use</h3>
          <ul className={styles.about__list}>
            <li className={styles.about__listItem}>
              Enter a either a company name or title number that you'd like to
              search.
            </li>
            <li className={styles.about__listItem}>
              The app then provides a table of results. You can filter this
              table using the search bar directly above.
            </li>
            <li className={styles.about__listItem}>
              You can also click on a column heading to change the order of the
              results (ascending, descending, or default).
            </li>
            <li className={styles.about__listItem}>
              Click on an item in the first column to run a search for that item
              in a new tab. In a company search result, this will run a title
              search on the selected title number. For a title search result,
              this will run a company search on the selected company.
            </li>
            <li className={styles.about__listItem}>
              The online demo version of this project uses a sample dataset. The
              companies included in the app can be found in the "top 10
              proprietors" tab.
            </li>
          </ul>
        </section>

        <section className={styles.about__section}>
          <h3 className={styles.about__sectionTitle}>Data cleaning</h3>
          <p>
            The raw data is inconsistent and contains errors, including spelling
            errors, typos, and inconsistent data formats. To address this, the
            app applies cleaning and standardisation processes. This app was
            created as part of a web development course and as such, it focuses
            on presenting the data rather than cleaning it perfectly. Future
            versions of the project will clean the data more granularly.
          </p>

          <div className={styles.about__subsection}>
            <h4 className={styles.about__subsectionTitle}>Title numbers</h4>
            <ul className={styles.about__list}>
              <li className={styles.about__listItem}>
                Titles are converted to uppercase and excess whitespace is
                removed.
              </li>
            </ul>
          </div>

          <div className={styles.about__subsection}>
            <h4 className={styles.about__subsectionTitle}>Address</h4>
            <ul className={styles.about__list}>
              <li className={styles.about__listItem}>
                Addresses are converted to uppercase and excess whitespace is
                removed.
              </li>
              <li className={styles.about__listItem}>
                Punctuation other than commas is removed.
              </li>
            </ul>
          </div>

          <div className={styles.about__subsection}>
            <h4 className={styles.about__subsectionTitle}>Price</h4>
            <ul className={styles.about__list}>
              <li className={styles.about__listItem}>
                Formatted as a number with comma separators.
              </li>
            </ul>
          </div>

          <div className={styles.about__subsection}>
            <h4 className={styles.about__subsectionTitle}>
              Jurisdiction of incorporation
            </h4>
            <ul className={styles.about__list}>
              <li className={styles.about__listItem}>
                Country of incorporation is renamed jurisdiction to reflect that
                not all places of incorpoation are countries.
              </li>
              <li className={styles.about__listItem}>
                Jurisdictions are standardised to be spelled according to UK
                official country and jurisdiction names.
              </li>
              <li className={styles.about__listItem}>
                Subnational jurisdictions (such as US states, freezones,
                emirates etc) are stanradised as [jurisdiction], [country].
              </li>
              <li className={styles.about__listItem}>
                Jurisdictions are converted to uppercase and excess whitespace
                is removed.
              </li>
              <li className={styles.about__listItem}>
                Jurisdictions which could not be standardised in database
                production have been left as they appear in the dataset.
              </li>
            </ul>
          </div>

          <div className={styles.about__subsection}>
            <h4 className={styles.about__subsectionTitle}>Company names</h4>
            <p>
              In addition to stripping excess whitespace, all punctuation is
              removed. The company types in the list below are standardised.
              These standardisations are important to note when searching by
              company name. More standardisations can be added as the app
              develops.
            </p>
            <ul className={styles.about__list}>
              <li className={styles.about__listItem}>AB</li>
              <li className={styles.about__listItem}>AG</li>
              <li className={styles.about__listItem}>BV</li>
              <li className={styles.about__listItem}>CO</li>
              <li className={styles.about__listItem}>CORPORATION</li>
              <li className={styles.about__listItem}>GMBH</li>
              <li className={styles.about__listItem}>LLC</li>
              <li className={styles.about__listItem}>LLP</li>
              <li className={styles.about__listItem}>LP</li>
              <li className={styles.about__listItem}>LTD</li>
              <li className={styles.about__listItem}>INC</li>
              <li className={styles.about__listItem}>OY</li>
              <li className={styles.about__listItem}>PTE LTD</li>
              <li className={styles.about__listItem}>PLC</li>
              <li className={styles.about__listItem}>SA</li>
              <li className={styles.about__listItem}>SARL</li>
            </ul>
            <p>
              Additionally, some company names are manually standardised by
              reviewing the database. Further cases can be added but it is
              envisioned that in future, some of this processing can be achieved
              through data analysis.
            </p>
          </div>
        </section>

        <section className={styles.about__section}>
          <h3 className={styles.about__sectionTitle}>Data validity</h3>
          <p>The database is up-to-date as of 7 July 2025.</p>
        </section>

        <section className={`${styles.about__section} ${styles.about__sectionAcknowledgements}`}>
          <h3 className={styles.about__sectionTitle}>Acknowledgements</h3>
          <p>
            Information produced by HM Land Registry © Crown copyright{" "}
            {new Date().getFullYear()}.
          </p>
          <p>Copyright © {new Date().getFullYear()} Joshua Mock.</p>
          <p>
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the “Software”), to deal in the Software without restriction,
            including without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the Software,
            and to permit persons to whom the Software is furnished to do so,
            subject to the following conditions: The above copyright notice and
            this permission notice shall be included in all copies or
            substantial portions of the Software.
          </p>
          <p>
            THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
        </section>

        <section className={styles.about__section}>
          <h3 className={styles.about__sectionTitle}>Terms of Use</h3>
          <ul className={styles.about__list}>
            <li className={styles.about__listItem}>
              You must not use the Information for any of the following
              purposes:
              <ol className={styles.about__list}>
                <li className={styles.about__listItem}>
                  to publish, commercially exploit, sell, license or distribute
                  the whole or any part of the Information as a Standalone
                  Licensed Product Or Service;
                </li>
                <li className={styles.about__listItem}>
                  to use the Information for the purposes of direct marketing
                  including but not limited to contacting registered proprietors
                  to offer goods or services or to make other offers;
                </li>
                <li className={styles.about__listItem}>
                  to use the Land Registry Title Number or permit it to be used
                  in any way that causes HM Land Registry systems or access to
                  those to be interrupted, damaged or impaired in any way;
                </li>
                <li className={styles.about__listItem}>
                  for any purpose that is contrary to any law or regulation or
                  any regulatory code.
                </li>
              </ol>
            </li>
            <li className={styles.about__listItem}>
              To deploy this application locally or to use the code in your own
              projects, you must{" "}
              <a
                href="https://use-land-property-data.service.gov.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.about__link}
              >
                obtain a license
              </a>{" "}
              from HM Land Registry to access the data.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
