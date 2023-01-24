INSERT INTO admin(name, email, password)
VALUES (
    "Ashley Taylor",
    "ashleytaylor@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "Brian Thomas",
    "brianthomas@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "Emily Hernandez",
    "emilyhernandez@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  );
INSERT INTO user(name, email, password)
VALUES (
    "John Doe",
    "johndoe@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "Jane Smith",
    "janesmith@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "Bob Johnson",
    "bobjohnson@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "Emily Davis",
    "emilydavis@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "Michael Brown",
    "michaelbrown@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "Sarah Miller",
    "sarahmiller@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "David Garcia",
    "davidgarcia@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "Jessica Rodriguez",
    "jessicarodriguez@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "James Martinez",
    "jamesmartinez@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  ),
  (
    "William Anderson",
    "williamanderson@example.com",
    "$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq"
  );
INSERT INTO organizer(name, createdAt, adminId)
VALUES ("Starman Music LTDA", CURRENT_TIMESTAMP, 1),
  (
    "UFAL - Universidade Federal de Alagoas",
    CURRENT_TIMESTAMP,
    2
  ),
  ("Museu da Arte Moderna", CURRENT_TIMESTAMP, 1);
INSERT INTO event(
    title,
    address,
    date,
    contactEmail,
    contactPhone,
    availableTickets,
    price,
    organizerId,
    adminId
  )
VALUES (
    "Concerto da Orquestra Municipal de Arapiraca",
    "Teatro Cenecista Thereza Auto Teofilo: Rua Est. Jose de Oliveira Leite - Centro, Arapiraca - AL, 57301-060",
    "2023-04-13 20:00:00",
    "starman@music.com",
    NULL,
    50,
    70.00,
    1,
    1
  ),
  (
    "Amostra de filmes cults",
    "Av. Comendador Gustavo Paiva, 2990, Maceio Shopping, Maceio, BR 57037-532",
    "2023-01-28 09:30:00",
    "ufal@edu.br",
    "+558200000000",
    17,
    19.99,
    2,
    1
  ),
  (
    "Semana de Arte Moderna 2",
    "Museu de Arte Moderna de Sao Paulo - Av. Pedro Alvares Cabral - Vila Mariana, Sao Paulo - SP, 04094-000",
    "2022-02-10 11:00:00",
    "museu@arte.com",
    NULL,
    500,
    25.00,
    3,
    2
  ),
  (
    "Workshop de Engenharia Naval",
    "https://engenharia.naval/",
    "2023-05-15 16:00:00",
    "ufal@edu.br",
    "+558200000000",
    20,
    50.00,
    2,
    2
  ),
  (
    "Palestra sobre a vida, o universo e tudo mais",
    "Biblioteca Central UFAL - Cidade Universitaria, Maceio, AL",
    "2020-04-02 04:24:24",
    NULL,
    "+558200000000",
    42,
    42.42,
    2,
    1
  );
INSERT INTO discount(code, value, eventId, adminId)
VALUES ("ROCKET25", 25, 1, 1),
  ("ARTE10", 10, 3, 1),
  ("4242", 42, 5, 2);
INSERT INTO cart(quantity, eventId, userId, discountId)
VALUES (2, 1, 1, NULL),
  (1, 3, 1, 2);