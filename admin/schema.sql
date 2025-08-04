CREATE TABLE public.proprietors (
  id bigint NOT NULL,
  proprietor_name text,
  jurisdiction text,
  CONSTRAINT proprietors_pkey PRIMARY KEY (id)
);

CREATE TABLE public.titles (
  id bigint NOT NULL,
  title text,
  address text,
  price text,
  CONSTRAINT titles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.titles_proprietors (
  proprietor_id bigint NOT NULL,
  title_id bigint NOT NULL,
  CONSTRAINT titles_proprietors_pkey PRIMARY KEY (proprietor_id, title_id),
  CONSTRAINT fk_proprietor FOREIGN KEY (proprietor_id) REFERENCES public.proprietors (id) ON DELETE CASCADE,
  CONSTRAINT fk_title FOREIGN KEY (title_id) REFERENCES public.titles (id) ON DELETE CASCADE
);

CREATE MATERIALIZED VIEW top_proprietors AS
SELECT proprietor_id, COUNT(*) AS titles_count
FROM titles_proprietors
GROUP BY proprietor_id;


CREATE INDEX idx_proprietors_proprietor_name ON proprietors (proprietor_name);
CREATE INDEX idx_titles_proprietors_proprietor_id ON titles_proprietors (proprietor_id);
CREATE INDEX idx_titles_proprietors_title_id ON titles_proprietors (title_id);
CREATE INDEX idx_titles_title ON titles (title);



