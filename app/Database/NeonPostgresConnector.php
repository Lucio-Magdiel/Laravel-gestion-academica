<?php

namespace App\Database;

use Illuminate\Database\Connectors\PostgresConnector;
use PDO;

class NeonPostgresConnector extends PostgresConnector
{
    /**
     * Create a new PDO connection.
     *
     * @param  string  $dsn
     * @param  array  $config
     * @param  array  $options
     * @return \PDO
     */
    public function createConnection($dsn, array $config, array $options)
    {
        // Add Neon endpoint to DSN if provided
        if (!empty($config['endpoint'])) {
            $dsn .= ';options=\'endpoint=' . $config['endpoint'] . '\'';
        }

        // Force stringify booleans for PostgreSQL
        $options[PDO::ATTR_STRINGIFY_FETCHES] = false;
        $options[PDO::ATTR_EMULATE_PREPARES] = false;

        return parent::createConnection($dsn, $config, $options);
    }
}
