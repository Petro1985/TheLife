using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LifeDataBase.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LifeUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LifeUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Patterns",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    PreviewImageBase64 = table.Column<string>(type: "text", nullable: false),
                    LastUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Survivors = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patterns", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LifeStates",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LastChange = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Survivors = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UserEntityId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LifeStates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LifeStates_LifeUsers_UserEntityId",
                        column: x => x.UserEntityId,
                        principalTable: "LifeUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LifeStates_UserEntityId",
                table: "LifeStates",
                column: "UserEntityId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LifeStates");

            migrationBuilder.DropTable(
                name: "Patterns");

            migrationBuilder.DropTable(
                name: "LifeUsers");
        }
    }
}
