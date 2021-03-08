CREATE DATABASE IF NOT EXISTS WebBirdDB;
USE WebBirdDB;

DROP TABLE IF EXISTS Approvazione;
CREATE TABLE Approvazione(
                             utenteID int UNSIGNED NOT NULL,
                             contentID int UNSIGNED NOT NULL,
                             likes int NOT NULL) ENGINE = InnoDB;


insert into approvazione(utenteID, contentID, likes) VALUES
(1, 0, -1),(3, 0, -1), (4, 0, -1),(5, 0, -1),(2,6,0),(2,6,0),
(2,6,-1),(1,6,0),(3,5,0),(2,6,1),(6,6,0),(7,1,0),(2,2,0),(4,4,-1),(2,1,0);