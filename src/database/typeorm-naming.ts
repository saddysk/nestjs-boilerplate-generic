import { createHash } from 'crypto';
import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

// Identifier length limit is 63 bytes in PostgreSQL
// https://github.com/typeorm/typeorm/blob/master/src/naming-strategy/DefaultNamingStrategy.ts
export class TypeOrmNaming extends DefaultNamingStrategy implements NamingStrategyInterface {
  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}-${clonedColumnNames.join('_')}`;
    return identifierName('PK', key);
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${clonedColumnNames.join('_')}`;
    return identifierName('UQ', key);
  }

  relationConstraintName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    let key = `${replacedTableName}_${clonedColumnNames.join('_')}`;
    if (where) {
      key += `_${generateHash(where)}`;
    }

    return identifierName('REL', key);
  }

  defaultConstraintName(tableOrName: Table | string, columnName: string): string {
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${columnName}`;
    return identifierName('DF', key);
  }

  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[]
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${clonedColumnNames.join('_')}`;

    return identifierName('FK', key);
  }

  indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    let key = `${replacedTableName}_${clonedColumnNames.join('_')}`;
    if (where) {
      key += `_${generateHash(where)}`;
    }

    return identifierName('IDX', key);
  }
}

function identifierName(prefix: string, key: string) {
  return (prefix + '_' + key).substring(0, 53) + '_' + generateHash(key, 8);
}

function generateHash(key: string, length = 8) {
  return createHash('sha1').update(key).digest('hex').substring(0, length);
}
