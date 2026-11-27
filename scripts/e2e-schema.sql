CREATE TABLE transactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type VARCHAR(7) NOT NULL CHECK (type IN ('income', 'expense')),
    amount BIGINT NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL,
    memo TEXT NOT NULL CHECK (length(trim(memo)) > 0)
);

CREATE TABLE base_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    balance BIGINT NOT NULL,
    base_date DATE NOT NULL
);
