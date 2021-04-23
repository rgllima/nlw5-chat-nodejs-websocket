import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class createConnectionsTable1619106973508 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "connections",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "admin_id",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "user_id",
                        type: "uuid"
                    },
                    {
                        name: "socket_id",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ]
            })
        );

        // 2ª forma de criar uma foreign key
        await queryRunner.createForeignKey(
            "connections",
            new TableForeignKey({
                name: "fk_connection_user",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 2ª forma de criar uma foreign key
        await queryRunner.dropForeignKey("connections", "fk_connection_user")
        await queryRunner.dropTable("connections");
    }

}
