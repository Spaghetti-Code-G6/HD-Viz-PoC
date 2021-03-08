---------------------------------------------Database------------------------------------------------------
HdViz mette a disposizione la possibilità di accedere a database RDBMS da configurazione JSON e relativo
sql di query per l'ottenimento dei dati salvati nel folder /dbConfig/ in modo che if due file siano omonimi.

Il file di configurazione è composto dalle proprietà:

    "name": Nome della configurazione a scopo descrittivo.
    "description": Descrizione della configurazione.
    "host": Server di accesso nel quale si trova il database della configurazione.
    "port": Porta per l'accesso al RDBMS.
    "database": Nome del database sul quale eseguire la query.
    "username": Nome utente per l'accesso al Database.
    "password": Password dell'utente.
    "dialect": Dialetto SQL utilizzato.
    "dialectOptions": Opzioni avanzate di Sequelize, consigliato di default: {}.

Un database di prova viene creato nell'esecuzione di test_creation su un RDBMS MariaDB, è tuttavia necessario
modificare i parametri: username, port, password ed eventualmente host (se non eseguito in locale).
-------------------------------------------------------------------------------------------------------------