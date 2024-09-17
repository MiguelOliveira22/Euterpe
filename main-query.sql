USE Usable;

CREATE SCHEMA Versoss;

CREATE TABLE Versoss.Main(
	id tinyint primary key IDENTITY(1, 1),
	nome varchar(30) NOT NULL,
	imagepath varchar(30) NOT NULL,
	songpath varchar(50) NOT NULL,
	votes int NULL
);

DROP TABLE Versoss.Main;

INSERT INTO Versoss.Main VALUES ('Maneva', 'maneva.jpg', 'https://www.youtube.com/watch?v=AmHUYnvA19o', 0);

SELECT id FROM Versoss.Main;